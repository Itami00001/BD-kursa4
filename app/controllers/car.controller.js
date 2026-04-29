const carService = require("../services/carService");

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - brand
 *         - model
 *         - year
 *       properties:
 *         id:
 *           type: integer
 *           description: Автоматически сгенерированный ID
 *         brand:
 *           type: string
 *           description: Марка автомобиля
 *         model:
 *           type: string
 *           description: Модель автомобиля
 *         year:
 *           type: integer
 *           description: Год выпуска
 *         country:
 *           type: string
 *           description: Страна производства
 *         description:
 *           type: string
 *           description: Описание автомобиля
 *         image:
 *           type: string
 *           description: Изображение или эмодзи
 *         power:
 *           type: string
 *           description: Мощность
 *         torque:
 *           type: string
 *           description: Крутящий момент
 *         acceleration:
 *           type: string
 *           description: Разгон до 100 км/ч
 *         topSpeed:
 *           type: string
 *           description: Максимальная скорость
 *         compatibilityRating:
 *           type: number
 *           description: Рейтинг совместимости
 */

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Создать новый автомобиль
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Автомобиль успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Неверные данные запроса
 *       500:
 *         description: Внутренняя ошибка сервера
 */
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.brand || !req.body.model || !req.body.year) {
      return res.status(400).send({
        message: "Brand, model and year can not be empty!"
      });
    }

    const newCar = await carService.createCar(req.body);
    res.status(201).send(newCar);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the car."
    });
  }
};

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Получить все автомобили
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Фильтр по марке автомобиля
 *     responses:
 *       200:
 *         description: Список автомобилей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
exports.findAll = async (req, res) => {
  try {
    const brand = req.query.brand;
    let cars;
    
    if (brand) {
      cars = await carService.searchCars(brand);
    } else {
      cars = await carService.getAllCars();
    }
    
    res.send(cars);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving cars."
    });
  }
};

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Получить автомобиль по ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Данные автомобиля
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Автомобиль не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
exports.findOne = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    res.send(car);
  } catch (error) {
    if (error.message === 'Car not found') {
      res.status(404).send({
        message: `Cannot find car with id=${req.params.id}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving car with id=" + req.params.id
      });
    }
  }
};

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Обновить автомобиль
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Автомобиль успешно обновлен
 *       404:
 *         description: Автомобиль не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
exports.update = async (req, res) => {
  try {
    const updatedCar = await carService.updateCar(req.params.id, req.body);
    res.send({
      message: "Car was updated successfully.",
      data: updatedCar
    });
  } catch (error) {
    if (error.message === 'Car not found') {
      res.status(404).send({
        message: `Cannot update car with id=${req.params.id}. Maybe car was not found or req.body is empty!`
      });
    } else {
      res.status(500).send({
        message: "Error updating car with id=" + req.params.id
      });
    }
  }
};

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Удалить автомобиль
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Автомобиль успешно удален
 *       404:
 *         description: Автомобиль не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
exports.delete = async (req, res) => {
  try {
    await carService.deleteCar(req.params.id);
    res.send({
      message: "Car was deleted successfully!"
    });
  } catch (error) {
    if (error.message === 'Car not found') {
      res.status(404).send({
        message: `Cannot delete car with id=${req.params.id}. Maybe car was not found!`
      });
    } else {
      res.status(500).send({
        message: "Could not delete car with id=" + req.params.id
      });
    }
  }
};

/**
 * @swagger
 * /api/cars/country/{country}:
 *   get:
 *     summary: Получить автомобили по стране
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список автомобилей указанной страны
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
exports.getCarsByCountry = async (req, res) => {
  try {
    const cars = await carService.getCarsByCountry(req.params.country);
    res.send(cars);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving cars by country."
    });
  }
};

/**
 * @swagger
 * /api/cars/stats/countries:
 *   get:
 *     summary: Получить статистику по странам
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Статистика автомобилей по странам
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   car_count:
 *                     type: integer
 *       500:
 *         description: Внутренняя ошибка сервера
 */
exports.getCountriesStats = async (req, res) => {
  try {
    const stats = await carService.getCountriesStats();
    res.send(stats);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error fetching countries stats."
    });
  }
};
