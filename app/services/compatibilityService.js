const { compatibility, cars, parts } = require("../models");
const { executeTransaction } = require("../utils/transaction");

class CompatibilityService {
  // Получить все записи совместимости
  async getAllCompatibility() {
    try {
      const result = await compatibility.findAll({
        include: [
          { model: cars },
          { model: parts }
        ]
      });
      return result;
    } catch (error) {
      throw new Error(`Error fetching compatibility: ${error.message}`);
    }
  }

  // Получить совместимость по ID
  async getCompatibilityById(id) {
    try {
      const compat = await compatibility.findByPk(id, {
        include: [
          { model: cars },
          { model: parts }
        ]
      });
      
      if (!compat) {
        throw new Error('Compatibility not found');
      }
      
      return compat;
    } catch (error) {
      throw new Error(`Error fetching compatibility: ${error.message}`);
    }
  }

  // Создать новую запись совместимости с транзакцией
  async createCompatibility(compatData) {
    try {
      const result = await executeTransaction('SERIALIZABLE', async (transaction) => {
        // Проверяем существование автомобиля
        const car = await cars.findByPk(compatData.carId, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        
        if (!car) {
          throw new Error('Car not found');
        }

        // Проверяем существование детали
        const part = await parts.findByPk(compatData.partId, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        
        if (!part) {
          throw new Error('Part not found');
        }

        // Проверяем дубликаты
        const existing = await compatibility.findOne({
          where: {
            carId: compatData.carId,
            partId: compatData.partId
          },
          transaction
        });

        if (existing) {
          throw new Error('Compatibility already exists');
        }

        // Создаем запись совместимости
        const newCompat = await compatibility.create({
          carId: compatData.carId,
          partId: compatData.partId,
          compatibilityScore: compatData.compatibilityScore || 5,
          installDifficulty: compatData.installDifficulty || 5,
          notes: compatData.notes
        }, { transaction });

        return newCompat;
      });

      return result;
    } catch (error) {
      throw new Error(`Error creating compatibility: ${error.message}`);
    }
  }

  // Обновить запись совместимости
  async updateCompatibility(id, compatData) {
    try {
      const compat = await compatibility.findByPk(id);
      
      if (!compat) {
        throw new Error('Compatibility not found');
      }
      
      await compat.update(compatData);
      return compat;
    } catch (error) {
      throw new Error(`Error updating compatibility: ${error.message}`);
    }
  }

  // Удалить запись совместимости
  async deleteCompatibility(id) {
    try {
      const compat = await compatibility.findByPk(id);
      
      if (!compat) {
        throw new Error('Compatibility not found');
      }
      
      await compat.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting compatibility: ${error.message}`);
    }
  }

  // Получить совместимые детали для автомобиля
  async getCompatiblePartsForCar(carId, options = {}) {
    try {
      const { 
        sortBy = 'compatibilityScore', 
        sortOrder = 'DESC', 
        minScore,
        maxDifficulty,
        limit 
      } = options;
      
      let whereClause = { carId };
      if (minScore) whereClause.compatibilityScore = { [compatibility.sequelize.Op.gte]: minScore };
      if (maxDifficulty) whereClause.installDifficulty = { [compatibility.sequelize.Op.lte]: maxDifficulty };
      
      const queryOptions = {
        where: whereClause,
        include: [
          {
            model: parts,
            include: [
              { association: 'category' },
              { association: 'manufacturer' }
            ]
          }
        ],
        order: [[sortBy, sortOrder.toUpperCase()]]
      };
      
      if (limit) {
        queryOptions.limit = parseInt(limit);
      }
      
      const result = await compatibility.findAll(queryOptions);
      
      // Форматируем результат
      return result.map(compat => ({
        compatibilityId: compat.id,
        compatibilityScore: compat.compatibilityScore,
        installDifficulty: compat.installDifficulty,
        notes: compat.notes,
        part: compat.part
      }));
    } catch (error) {
      throw new Error(`Error fetching compatible parts: ${error.message}`);
    }
  }

  // Получить совместимые автомобили для детали
  async getCompatibleCarsForPart(partId, options = {}) {
    try {
      const { 
        sortBy = 'compatibilityScore', 
        sortOrder = 'DESC', 
        minScore,
        maxDifficulty,
        limit 
      } = options;
      
      let whereClause = { partId };
      if (minScore) whereClause.compatibilityScore = { [compatibility.sequelize.Op.gte]: minScore };
      if (maxDifficulty) whereClause.installDifficulty = { [compatibility.sequelize.Op.lte]: maxDifficulty };
      
      const queryOptions = {
        where: whereClause,
        include: [
          { model: cars }
        ],
        order: [[sortBy, sortOrder.toUpperCase()]]
      };
      
      if (limit) {
        queryOptions.limit = parseInt(limit);
      }
      
      const result = await compatibility.findAll(queryOptions);
      
      // Форматируем результат
      return result.map(compat => ({
        compatibilityId: compat.id,
        compatibilityScore: compat.compatibilityScore,
        installDifficulty: compat.installDifficulty,
        notes: compat.notes,
        car: compat.car
      }));
    } catch (error) {
      throw new Error(`Error fetching compatible cars: ${error.message}`);
    }
  }

  // Массовое создание совместимостей с транзакцией
  async bulkCreateCompatibility(compatibilities) {
    try {
      const result = await executeTransaction('SERIALIZABLE', async (transaction) => {
        const createdRecords = [];
        
        for (const compatData of compatibilities) {
          // Проверяем существование записей
          const car = await cars.findByPk(compatData.carId, { transaction });
          const part = await parts.findByPk(compatData.partId, { transaction });
          
          if (!car) {
            throw new Error(`Car with ID ${compatData.carId} not found`);
          }
          
          if (!part) {
            throw new Error(`Part with ID ${compatData.partId} not found`);
          }
          
          // Проверяем дубликаты
          const existing = await compatibility.findOne({
            where: {
              carId: compatData.carId,
              partId: compatData.partId
            },
            transaction
          });

          if (!existing) {
            const newCompat = await compatibility.create(compatData, { transaction });
            createdRecords.push(newCompat);
          }
        }
        
        return createdRecords;
      });

      return result;
    } catch (error) {
      throw new Error(`Error bulk creating compatibility: ${error.message}`);
    }
  }

  // Получить статистику совместимости
  async getCompatibilityStats() {
    try {
      const [stats] = await compatibility.sequelize.query(`
        SELECT 
          COUNT(*) as total_compatibility,
          AVG(compatibilityScore) as avg_score,
          AVG(installDifficulty) as avg_difficulty,
          COUNT(CASE WHEN compatibilityScore >= 8 THEN 1 END) as high_compatibility,
          COUNT(CASE WHEN installDifficulty <= 3 THEN 1 END) as easy_install
        FROM compatibility
      `);

      const [byCar] = await compatibility.sequelize.query(`
        SELECT 
          c.brand,
          c.model,
          COUNT(*) as compatible_parts,
          AVG(comp.compatibilityScore) as avg_score
        FROM cars c
        JOIN compatibility comp ON c.id = comp.carId
        GROUP BY c.id, c.brand, c.model
        ORDER BY compatible_parts DESC
        LIMIT 10
      `);

      const [byPart] = await compatibility.sequelize.query(`
        SELECT 
          p.name,
          m.name as manufacturer_name,
          COUNT(*) as compatible_cars,
          AVG(comp.compatibilityScore) as avg_score
        FROM parts p
        JOIN manufacturers m ON p.manufacturerId = m.id
        JOIN compatibility comp ON p.id = comp.partId
        GROUP BY p.id, p.name, m.name
        ORDER BY compatible_cars DESC
        LIMIT 10
      `);

      return {
        overall: stats[0],
        topCars: byCar,
        topParts: byPart
      };
    } catch (error) {
      throw new Error(`Error fetching compatibility stats: ${error.message}`);
    }
  }

  // Поиск совместимостей по параметрам
  async searchCompatibility(searchParams) {
    try {
      const { carBrand, carModel, partName, minScore, maxDifficulty } = searchParams;
      
      let whereClause = {};
      
      if (minScore) whereClause.compatibilityScore = { [compatibility.sequelize.Op.gte]: minScore };
      if (maxDifficulty) whereClause.installDifficulty = { [compatibility.sequelize.Op.lte]: maxDifficulty };
      
      const includeOptions = [
        {
          model: cars,
          where: {}
        },
        {
          model: parts,
          where: {}
        }
      ];
      
      if (carBrand) {
        includeOptions[0].where.brand = { [cars.sequelize.Op.like]: `%${carBrand}%` };
      }
      
      if (carModel) {
        includeOptions[0].where.model = { [cars.sequelize.Op.like]: `%${carModel}%` };
      }
      
      if (partName) {
        includeOptions[1].where.name = { [parts.sequelize.Op.like]: `%${partName}%` };
      }
      
      const result = await compatibility.findAll({
        where: whereClause,
        include: includeOptions,
        limit: 50
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error searching compatibility: ${error.message}`);
    }
  }
}

module.exports = new CompatibilityService();
