require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { swaggerUi, specs } = require("./app/config/swagger.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// Ignore favicon requests to avoid 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from front directory
app.use(express.static('front'));

// simple route
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/front/index.html');
});

// API info route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Tunning Manual API",
    version: "1.0.0",
    endpoints: {
      categories: "/api/categories",
      parts: "/api/parts",
      cars: "/api/cars",
      manufacturers: "/api/manufacturers",
      customers: "/api/customers",
      configurations: "/api/configurations/countries",
      stats: "/api/stats",
      docs: "/api-docs"
    }
  });
});

// ============================================================
// API КОНФИГУРАЦИИ — данные для страницы configurations.html
// ============================================================

// Получить список стран с количеством автомобилей
app.get("/api/configurations/countries", async (req, res) => {
  try {
    const db = require("./app/models");
    const [results] = await db.sequelize.query(`
      SELECT 
        country,
        COUNT(*) as car_count
      FROM cars
      WHERE country IS NOT NULL AND country != 'unknown'
      GROUP BY country
      ORDER BY country
    `);

    // Карта стран с метаданными
    const countryMeta = {
      japan: { name: 'Япония', flag: '🇯🇵', cars_hint: 'Nissan, Toyota, Honda, Mazda...' },
      germany: { name: 'Германия', flag: '🇩🇪', cars_hint: 'BMW, Mercedes, Audi, VW...' },
      czech: { name: 'Чехия', flag: '🇨🇿', cars_hint: 'Skoda Octavia, Skoda Rapid...' },
      america: { name: 'Америка', flag: '🇺🇸', cars_hint: 'Ford, Chevrolet, Dodge, Tesla...' },
      russia: { name: 'Россия', flag: '🇷🇺', cars_hint: 'Lada, UAZ, Aurus...' },
      sweden: { name: 'Швеция', flag: '🇸🇪', cars_hint: 'Volvo, Koenigsegg, Saab...' }
    };

    const countries = results.map(r => ({
      code: r.country,
      ...(countryMeta[r.country] || { name: r.country, flag: '🏴', cars_hint: '' }),
      carCount: parseInt(r.car_count)
    }));

    // Добавить страны без машин (для UI)
    ['russia', 'sweden'].forEach(code => {
      if (!countries.find(c => c.code === code)) {
        countries.push({
          code,
          ...countryMeta[code],
          carCount: 0
        });
      }
    });

    res.json({ success: true, countries });
  } catch (error) {
    console.error("Countries API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить автомобили по стране с количеством совместимых деталей
app.get("/api/configurations/cars/:country", async (req, res) => {
  try {
    const db = require("./app/models");
    const countryParam = String(req.params.country || "").trim();

    const countryMap = {
      japan: "Japan",
      germany: "Germany",
      america: "USA",
      usa: "USA",
      russia: "Russia",
      sweden: "Sweden",
      czech: "Czech"
    };

    const normalizedCountry = countryMap[countryParam.toLowerCase()] || countryParam;

    const [cars] = await db.sequelize.query(`
      SELECT 
        c.id,
        c.brand,
        c.model,
        c.year,
        c.country,
        c.description,
        c.image,
        c.power,
        c.torque,
        c.acceleration,
        c."topSpeed",
        c."compatibilityRating",
        COALESCE(comp.parts_count, 0) as "availableParts"
      FROM cars c
      LEFT JOIN (
        SELECT carid, COUNT(*) as parts_count
        FROM compatibility
        GROUP BY carid
      ) comp ON c.id = comp.carid
      WHERE LOWER(c.country) = LOWER(:country)
      ORDER BY c."compatibilityRating" DESC
    `, {
      replacements: { country: normalizedCountry }
    });

    res.json({ success: true, cars });
  } catch (error) {
    console.error("Cars by country API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить совместимые детали для конкретного автомобиля
app.get("/api/configurations/parts/:carId", async (req, res) => {
  try {
    const db = require("./app/models");
    const carId = req.params.carId;

    const [parts] = await db.sequelize.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p."powerGain",
        p."torqueGain",
        p."compatibilityScore",
        p."installDifficulty",
        p.instruction,
        cat.name as category_name,
        m.name as manufacturer_name,
        comp.note as compatibility_note
      FROM parts p
      JOIN compatibility comp ON p.id = comp.partid
      LEFT JOIN categories cat ON p.categoryid = cat.id
      LEFT JOIN manufacturers m ON p.manufacturerid = m.id
      WHERE comp.carid = :carId
      ORDER BY p."compatibilityScore" DESC, p.price ASC
    `, {
      replacements: { carId }
    });

    res.json({ success: true, parts, totalParts: parts.length });
  } catch (error) {
    console.error("Compatible parts API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить общую статистику системы
app.get("/api/stats", async (req, res) => {
  try {
    const db = require("./app/models");

    const [stats] = await db.sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM cars) as "totalCars",
        (SELECT COUNT(*) FROM parts) as "totalParts",
        (SELECT COUNT(*) FROM manufacturers) as "totalManufacturers",
        (SELECT COUNT(*) FROM categories) as "totalCategories",
        (SELECT COUNT(*) FROM compatibility) as "totalCompatibilities",
        (SELECT COUNT(*) FROM customers) as "totalCustomers"
    `);

    res.json({
      success: true,
      stats: stats[0] || {
        totalCars: 0,
        totalParts: 0,
        totalManufacturers: 0,
        totalCategories: 0,
        totalCompatibilities: 0,
        totalCustomers: 0
      }
    });
  } catch (error) {
    console.error("Stats API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// API для настройки БД (создание таблиц и индексов)
// ============================================================
app.post("/api/db/setup", async (req, res) => {
  try {
    const db = require("./app/models");
    const sequelize = db.sequelize;
    const fs = require('fs');
    const path = require('path');

    // Читаем и выполняем SQL файл схемы
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Выполняем SQL по частям
    const statements = schemaSql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await sequelize.query(statement);
      }
    }

    res.json({
      success: true,
      message: "База данных успешно настроена с таблицами и индексами"
    });
  } catch (error) {
    console.error("Database setup error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API для заполнения тестовыми данными
app.post("/api/db/seed", async (req, res) => {
  try {
    const db = require("./app/models");
    const sequelize = db.sequelize;
    const fs = require('fs');
    const path = require('path');

    // Читаем и выполняем SQL файл с данными
    const seedPath = path.join(__dirname, 'init.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    // Выполняем SQL по частям
    const statements = seedSql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await sequelize.query(statement);
      }
    }

    // Проверяем результат
    const [stats] = await sequelize.query(`
      SELECT 'cars' as table_name, COUNT(*) as count FROM cars
      UNION ALL
      SELECT 'parts', COUNT(*) FROM parts
      UNION ALL
      SELECT 'compatibility', COUNT(*) FROM compatibility
      UNION ALL
      SELECT 'manufacturers', COUNT(*) FROM manufacturers
    `);

    res.json({
      success: true,
      message: "Тестовые данные успешно загружены",
      stats: stats
    });
  } catch (error) {
    console.error("Database seed error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API для поиска совместимых деталей для конкретного автомобиля (legacy)
app.get("/api/db/compatible-parts/:carId", async (req, res) => {
  try {
    const db = require("./app/models");
    const carId = req.params.carId;

    const [parts] = await db.sequelize.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p."powerGain",
        p."torqueGain",
        p."compatibilityScore",
        p."installDifficulty",
        p.instruction,
        cat.name as category_name,
        m.name as manufacturer_name,
        comp.note as compatibility_note
      FROM parts p
      JOIN compatibility comp ON p.id = comp.partid
      LEFT JOIN categories cat ON p.categoryid = cat.id
      LEFT JOIN manufacturers m ON p.manufacturerid = m.id
      WHERE comp.carid = :carId
      ORDER BY p."compatibilityScore" DESC, p.price ASC
    `, {
      replacements: { carId }
    });

    // Получаем информацию об автомобиле
    const [carResult] = await db.sequelize.query(`
      SELECT * FROM cars WHERE id = :carId
    `, {
      replacements: { carId }
    });

    res.json({
      success: true,
      car: carResult[0] || null,
      parts: parts,
      totalParts: parts.length
    });
  } catch (error) {
    console.error("Compatible parts error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API для выполнения произвольных SQL запросов (только для отладки)
app.post("/api/db/query", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter is required"
      });
    }

    const db = require("./app/models");
    const sequelize = db.sequelize;

    // Защита от опасных запросов
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE'];
    const upperQuery = query.toUpperCase();

    if (dangerousKeywords.some(keyword => upperQuery.includes(keyword))) {
      return res.status(403).json({
        success: false,
        error: "Dangerous operations are not allowed"
      });
    }

    const [results] = await sequelize.query(query);

    res.json({
      success: true,
      results: results,
      rowCount: Array.isArray(results) ? results.length : 0
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Import routes
require("./app/routes/category.routes")(app);
require("./app/routes/part.routes")(app);
require("./app/routes/car.routes")(app);
require("./app/routes/manufacturer.routes")(app);
require("./app/routes/customer.routes")(app);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
// Отключаем автоматический sync, чтобы не перезаписывать init.sql структуру
// Таблицы управляются через init.sql
db.sequelize.authenticate().then(() => {
  console.log("Database connection established successfully!");
}).catch(err => {
  console.log("Failed to connect to database: " + err.message);
});
