const db = require("../models");
const { cars, compatibility, parts } = db;

class CarService {
  // Получить все автомобили
  async getAllCars() {
    try {
      const result = await cars.findAll({
        raw: true
      });
      return result;
    } catch (error) {
      throw new Error(`Error fetching cars: ${error.message}`);
    }
  }

  // Получить автомобиль по ID
  async getCarById(id) {
    try {
      const car = await cars.findByPk(id);
      
      if (!car) {
        throw new Error('Car not found');
      }
      
      return car;
    } catch (error) {
      throw new Error(`Error fetching car: ${error.message}`);
    }
  }

  // Создать новый автомобиль
  async createCar(carData) {
    try {
      const newCar = await cars.create({
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        country: carData.country || 'unknown',
        description: carData.description,
        image: carData.image || '🚗',
        power: carData.power,
        torque: carData.torque,
        acceleration: carData.acceleration,
        topSpeed: carData.topSpeed,
        compatibilityRating: carData.compatibilityRating || 0
      });
      
      return newCar;
    } catch (error) {
      throw new Error(`Error creating car: ${error.message}`);
    }
  }

  // Обновить автомобиль
  async updateCar(id, carData) {
    try {
      const car = await cars.findByPk(id);
      
      if (!car) {
        throw new Error('Car not found');
      }
      
      await car.update(carData);
      return car;
    } catch (error) {
      throw new Error(`Error updating car: ${error.message}`);
    }
  }

  // Удалить автомобиль
  async deleteCar(id) {
    try {
      const car = await cars.findByPk(id);
      
      if (!car) {
        throw new Error('Car not found');
      }
      
      await car.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting car: ${error.message}`);
    }
  }

  // Получить автомобили по стране
  async getCarsByCountry(country) {
    try {
      const result = await cars.findAll({
        where: { country },
        raw: true
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error fetching cars by country: ${error.message}`);
    }
  }

  // Получить статистику по странам
  async getCountriesStats() {
    try {
      const [results] = await cars.sequelize.query(`
        SELECT 
          country,
          COUNT(*) as car_count
        FROM cars
        GROUP BY country
        ORDER BY car_count DESC
      `);
      
      return results;
    } catch (error) {
      throw new Error(`Error fetching countries stats: ${error.message}`);
    }
  }

  // Поиск автомобилей по марке
  async searchCars(brand) {
    try {
      const result = await cars.findAll({
        where: {
          brand: { [cars.sequelize.Op.like]: `%${brand}%` }
        },
        raw: true
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error searching cars: ${error.message}`);
    }
  }
}

module.exports = new CarService();
