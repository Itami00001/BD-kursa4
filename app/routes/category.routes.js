/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор категории
 *         name:
 *           type: string
 *           description: Название категории
 *       example:
 *         id: 1
 *         name: Двигатель и выхлоп
 */

module.exports = app => {
  const categories = require("../controllers/category.controller.js");
  
  var router = require("express").Router();

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Создать новую категорию
   *     tags: [Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *             example:
   *               name: Двигатель и выхлоп
   *     responses:
   *       200:
   *         description: Категория успешно создана
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   */
  router.post("/", categories.create);

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Получить все категории
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: Список всех категорий
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Category'
   */
  router.get("/", categories.findAll);

  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     summary: Получить категорию по ID
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID категории
   *     responses:
   *       200:
   *         description: Категория найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       404:
   *         description: Категория не найдена
   */
  router.get("/:id", categories.findOne);

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Обновить категорию
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID категории
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Категория успешно обновлена
   *       404:
   *         description: Категория не найдена
   */
  router.put("/:id", categories.update);

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Удалить категорию
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID категории
   *     responses:
   *       200:
   *         description: Категория успешно удалена
   *       404:
   *         description: Категория не найдена
   */
  router.delete("/:id", categories.delete);

  /**
   * @swagger
   * /api/categories:
   *   delete:
   *     summary: Удалить все категории
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: Все категории успешно удалены
   */
  router.delete("/", categories.deleteAll);

  app.use('/api/categories', router);
};
