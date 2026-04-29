const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tunning Manual 8080 API",
      version: "1.0.0",
      description: "API для системы подбора тюнинговых деталей для автомобилей с поддержкой транзакций и уровней изоляции",
      contact: {
        name: "API Support",
        email: "support@tunningmanual.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
      {
        url: "https://api.tunningmanual.com",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT токен для аутентификации"
        }
      },
      schemas: {
        Car: {
          type: "object",
          required: ["brand", "model", "year"],
          properties: {
            id: {
              type: "integer",
              description: "Автоматически сгенерированный ID",
              readOnly: true
            },
            brand: {
              type: "string",
              description: "Марка автомобиля",
              example: "Toyota"
            },
            model: {
              type: "string", 
              description: "Модель автомобиля",
              example: "Supra"
            },
            year: {
              type: "integer",
              description: "Год выпуска",
              example: 2020
            },
            country: {
              type: "string",
              description: "Страна производства",
              example: "Japan"
            },
            description: {
              type: "string",
              description: "Описание автомобиля"
            },
            image: {
              type: "string",
              description: "Изображение или эмодзи",
              example: "🚗"
            },
            power: {
              type: "string",
              description: "Мощность",
              example: "280 л.с."
            },
            torque: {
              type: "string", 
              description: "Крутящий момент",
              example: "350 Нм"
            },
            acceleration: {
              type: "string",
              description: "Разгон до 100 км/ч",
              example: "4.3 сек"
            },
            topSpeed: {
              type: "string",
              description: "Максимальная скорость",
              example: "280 км/ч"
            },
            compatibilityRating: {
              type: "number",
              description: "Рейтинг совместимости",
              example: 8.5
            }
          }
        },
        Part: {
          type: "object",
          required: ["name", "price", "categoryId", "manufacturerId"],
          properties: {
            id: {
              type: "integer",
              description: "ID детали",
              readOnly: true
            },
            name: {
              type: "string",
              description: "Название детали",
              example: "Турбокомпрессор Garrett GT35"
            },
            price: {
              type: "number",
              description: "Цена",
              example: 150000.00
            },
            categoryId: {
              type: "integer",
              description: "ID категории"
            },
            manufacturerId: {
              type: "integer",
              description: "ID производителя"
            },
            powerGain: {
              type: "integer",
              description: "Прирост мощности в л.с.",
              example: 100
            },
            torqueGain: {
              type: "integer",
              description: "Прирост крутящего момента в Нм",
              example: 150
            },
            compatibilityScore: {
              type: "integer",
              description: "Оценка совместимости (1-10)",
              example: 8
            },
            installDifficulty: {
              type: "integer",
              description: "Сложность установки (1-10)",
              example: 6
            },
            instruction: {
              type: "string",
              description: "Инструкция по установке"
            }
          }
        },
        Order: {
          type: "object",
          required: ["customerId", "amount"],
          properties: {
            id: {
              type: "integer",
              description: "ID заказа",
              readOnly: true
            },
            customerId: {
              type: "integer",
              description: "ID клиента"
            },
            promotionId: {
              type: "integer",
              description: "ID акции"
            },
            amount: {
              type: "number",
              description: "Сумма заказа",
              example: 250000.00
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
              description: "Статус заказа",
              example: "pending"
            },
            orderDate: {
              type: "string",
              format: "date-time",
              description: "Дата заказа",
              readOnly: true
            }
          }
        },
        Compatibility: {
          type: "object",
          required: ["carId", "partId"],
          properties: {
            id: {
              type: "integer",
              description: "ID совместимости",
              readOnly: true
            },
            carId: {
              type: "integer",
              description: "ID автомобиля"
            },
            partId: {
              type: "integer",
              description: "ID детали"
            },
            compatibilityScore: {
              type: "integer",
              description: "Оценка совместимости (1-10)",
              example: 9
            },
            installDifficulty: {
              type: "integer",
              description: "Сложность установки (1-10)",
              example: 5
            },
            notes: {
              type: "string",
              description: "Примечания по установке"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Описание ошибки",
              example: "Car not found"
            },
            error: {
              type: "string",
              description: "Тип ошибки",
              example: "ValidationError"
            },
            details: {
              type: "object",
              description: "Детали ошибки"
            }
          }
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              description: "Массив данных"
            },
            total: {
              type: "integer",
              description: "Общее количество записей"
            },
            page: {
              type: "integer",
              description: "Текущая страница"
            },
            limit: {
              type: "integer",
              description: "Количество записей на странице"
            },
            totalPages: {
              type: "integer",
              description: "Общее количество страниц"
            }
          }
        }
      }
    },
    tags: [
      {
        name: "Cars",
        description: "Управление автомобилями"
      },
      {
        name: "Parts",
        description: "Управление деталями"
      },
      {
        name: "Orders",
        description: "Управление заказами"
      },
      {
        name: "Compatibility",
        description: "Совместимость деталей"
      },
      {
        name: "Categories",
        description: "Категории деталей"
      },
      {
        name: "Manufacturers",
        description: "Производители деталей"
      },
      {
        name: "Configurations",
        description: "Конфигурации и подбор деталей"
      },
      {
        name: "Transactions",
        description: "Транзакции и блокировки"
      }
    ]
  },
  apis: ["./app/routes/*.js", "./app/controllers/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
