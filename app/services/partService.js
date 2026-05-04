const db = require("../models");
const { parts, categories, manufacturers, compatibility, cars } = db;

class PartService {
  // Получить все детали
  async getAllParts() {
    try {
      const query = `
        SELECT 
          p.*,
          c.name as category_name,
          m.name as manufacturer_name
        FROM parts p
        LEFT JOIN categories c ON p.categoryid = c.id
        LEFT JOIN manufacturers m ON p.manufacturerid = m.id
      `;
      
      const results = await parts.sequelize.query(query, {
        type: parts.sequelize.QueryTypes.SELECT
      });
      
      return results || [];
    } catch (error) {
      throw new Error(`Error fetching parts: ${error.message}`);
    }
  }

  // Получить деталь по ID
  async getPartById(id) {
    try {
      const part = await parts.findByPk(id, {
        include: [
          { model: categories },
          { model: manufacturers },
          {
            model: compatibility,
            include: [cars]
          }
        ]
      });
      
      if (!part) {
        throw new Error('Part not found');
      }
      
      return part;
    } catch (error) {
      throw new Error(`Error fetching part: ${error.message}`);
    }
  }

  // Создать новую деталь
  async createPart(partData) {
    try {
      const newPart = await parts.create({
        name: partData.name,
        price: partData.price,
        categoryId: partData.categoryId,
        manufacturerId: partData.manufacturerId,
        powerGain: partData.powerGain || 0,
        torqueGain: partData.torqueGain || 0,
        compatibilityScore: partData.compatibilityScore || 5,
        installDifficulty: partData.installDifficulty || 5,
        instruction: partData.instruction
      });
      
      return newPart;
    } catch (error) {
      throw new Error(`Error creating part: ${error.message}`);
    }
  }

  // Обновить деталь
  async updatePart(id, partData) {
    try {
      const part = await parts.findByPk(id);
      
      if (!part) {
        throw new Error('Part not found');
      }
      
      await part.update(partData);
      return part;
    } catch (error) {
      throw new Error(`Error updating part: ${error.message}`);
    }
  }

  // Удалить деталь
  async deletePart(id) {
    try {
      const part = await parts.findByPk(id);
      
      if (!part) {
        throw new Error('Part not found');
      }
      
      await part.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting part: ${error.message}`);
    }
  }

  // Получить детали по категории
  async getPartsByCategory(categoryId) {
    try {
      const result = await parts.findAll({
        where: { categoryId },
        include: [
          { model: categories },
          { model: manufacturers }
        ]
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error fetching parts by category: ${error.message}`);
    }
  }

  // Получить детали по производителю
  async getPartsByManufacturer(manufacturerId) {
    try {
      const result = await parts.findAll({
        where: { manufacturerId },
        include: [
          { model: categories },
          { model: manufacturers }
        ]
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error fetching parts by manufacturer: ${error.message}`);
    }
  }

  // Получить совместимые детали для автомобиля
  async getCompatibleParts(carId, options = {}) {
    try {
      const { sortBy = 'compatibilityScore', sortOrder = 'DESC', limit } = options;
      
      const query = `
        SELECT 
          p.*,
          c.name as category_name,
          m.name as manufacturer_name
        FROM parts p
        JOIN categories c ON p.categoryid = c.id
        JOIN manufacturers m ON p.manufacturerid = m.id
        JOIN compatibility comp ON p.id = comp.partid
        WHERE comp.carid = :carId
        ORDER BY p.${sortBy} ${sortOrder}
        ${limit ? 'LIMIT :limit' : ''}
      `;
      
      const replacements = { carId };
      if (limit) {
        replacements.limit = parseInt(limit);
      }
      
      const results = await parts.sequelize.query(query, {
        replacements,
        type: parts.sequelize.QueryTypes.SELECT
      });
      
      return results;
    } catch (error) {
      throw new Error(`Error fetching compatible parts: ${error.message}`);
    }
  }

  // Получить детали с пагинацией и фильтрацией
  async getPartsPaginated(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        categoryId, 
        manufacturerId,
        minPrice,
        maxPrice,
        sortBy = 'name',
        sortOrder = 'ASC'
      } = options;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      if (categoryId) where.categoryId = categoryId;
      if (manufacturerId) where.manufacturerId = manufacturerId;
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[parts.sequelize.Op.gte] = minPrice;
        if (maxPrice) where.price[parts.sequelize.Op.lte] = maxPrice;
      }
      
      const result = await parts.findAndCountAll({
        where,
        include: [
          { model: categories },
          { model: manufacturers }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });
      
      return {
        data: result.rows,
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.count / limit)
      };
    } catch (error) {
      throw new Error(`Error fetching parts paginated: ${error.message}`);
    }
  }

  // Поиск деталей по названию
  async searchParts(searchTerm) {
    try {
      const result = await parts.findAll({
        where: {
          [parts.sequelize.Op.or]: [
            { name: { [parts.sequelize.Op.like]: `%${searchTerm}%` } },
            { instruction: { [parts.sequelize.Op.like]: `%${searchTerm}%` } }
          ]
        },
        include: [
          { model: categories },
          { model: manufacturers }
        ],
        limit: 50
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error searching parts: ${error.message}`);
    }
  }
}

module.exports = new PartService();
