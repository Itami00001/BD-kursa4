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
    const countryParam = String(req.params.country || "").trim().toLowerCase();

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
      WHERE LOWER(c.country) = :country
      ORDER BY c."compatibilityRating" DESC
    `, {
      replacements: { country: countryParam },
      type: db.sequelize.QueryTypes.SELECT
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
// API ГАРАЖА (user_garage - JSONB подход)
// ============================================================

// Получить гараж текущего пользователя
app.get("/api/garage", async (req, res) => {
  try {
    const db = require("./app/models");
    // TODO: Получать userId из сессии/JWT когда будет авторизация
    const userId = req.query.userId || 1; // Временно для теста

    const [garage] = await db.sequelize.query(`
      SELECT 
        g.id,
        g.name as configName,
        g.parts,
        g.stats,
        g.created_at,
        g.updated_at,
        c.id as car_id,
        c.brand,
        c.model,
        c.year,
        c.country,
        c.power,
        c.torque,
        c.acceleration,
        c."topSpeed",
        c."compatibilityRating"
      FROM user_garage g
      JOIN cars c ON g.car_id = c.id
      WHERE g.user_id = :userId
      LIMIT 1
    `, { replacements: { userId } });

    if (!garage || garage.length === 0) {
      return res.json({ success: true, garage: null, message: "Гараж пуст. Выберите машину в конфигурациях." });
    }

    res.json({ success: true, garage: garage[0] });
  } catch (error) {
    console.error("Garage API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Выбрать машину в гараж (создать или обновить)
app.post("/api/garage/select-car", async (req, res) => {
  try {
    const db = require("./app/models");
    const userId = req.body.userId || 1; // TODO: из сессии
    const carId = req.body.carId;
    const configName = req.body.name || "Моя конфигурация";

    if (!carId) {
      return res.status(400).json({ success: false, error: "carId обязателен" });
    }

    // UPSERT: создать или обновить
    await db.sequelize.query(`
      INSERT INTO user_garage (user_id, car_id, name, parts, stats, created_at, updated_at)
      VALUES (:userId, :carId, :name, '[]', '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        car_id = EXCLUDED.car_id,
        name = EXCLUDED.name,
        parts = '[]',
        stats = '{}',
        updated_at = CURRENT_TIMESTAMP
    `, { replacements: { userId, carId, name: configName } });

    res.json({ success: true, message: "Машина выбрана" });
  } catch (error) {
    console.error("Garage select-car error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Добавить деталь в гараж
app.post("/api/garage/add-part", async (req, res) => {
  try {
    const db = require("./app/models");
    const userId = req.body.userId || 1; // TODO: из сессии
    const { partId, name, category, powerGain, torqueGain, compatibilityScore, installDifficulty } = req.body;

    if (!partId) {
      return res.status(400).json({ success: false, error: "partId обязателен" });
    }

    // Получить текущий гараж
    const [garage] = await db.sequelize.query(
      `SELECT id, parts FROM user_garage WHERE user_id = :userId`,
      { replacements: { userId } }
    );

    if (!garage || garage.length === 0) {
      return res.status(400).json({ success: false, error: "Сначала выберите машину в конфигурациях" });
    }

    let parts = garage[0].parts || [];
    if (typeof parts === 'string') {
      parts = JSON.parse(parts);
    }

    // Проверить, нет ли уже такой детали
    if (parts.find(p => p.partId === partId)) {
      return res.json({ success: false, error: "Деталь уже в гараже" });
    }

    // Добавить деталь
    parts.push({
      partId,
      name: name || `Деталь #${partId}`,
      category: category || 'unknown',
      powerGain: powerGain || 0,
      torqueGain: torqueGain || 0,
      compatibilityScore: compatibilityScore || 5,
      installDifficulty: installDifficulty || 5,
      addedAt: new Date().toISOString()
    });

    // Пересчитать статы
    const stats = {
      totalPowerGain: parts.reduce((sum, p) => sum + (p.powerGain || 0), 0),
      totalTorqueGain: parts.reduce((sum, p) => sum + (p.torqueGain || 0), 0),
      avgCompatibility: Math.round(parts.reduce((sum, p) => sum + (p.compatibilityScore || 5), 0) / parts.length),
      totalInstallDifficulty: Math.round(parts.reduce((sum, p) => sum + (p.installDifficulty || 5), 0) / parts.length),
      partsCount: parts.length
    };

    // Сохранить
    await db.sequelize.query(`
      UPDATE user_garage 
      SET parts = :parts::jsonb, 
          stats = :stats::jsonb, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = :userId
    `, { replacements: { userId, parts: JSON.stringify(parts), stats: JSON.stringify(stats) } });

    res.json({ success: true, message: "Деталь добавлена", stats });
  } catch (error) {
    console.error("Garage add-part error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Удалить деталь из гаража
app.delete("/api/garage/parts/:partId", async (req, res) => {
  try {
    const db = require("./app/models");
    const userId = req.query.userId || 1; // TODO: из сессии
    const partId = parseInt(req.params.partId);

    // Получить текущий гараж
    const [garage] = await db.sequelize.query(
      `SELECT id, parts FROM user_garage WHERE user_id = :userId`,
      { replacements: { userId } }
    );

    if (!garage || garage.length === 0) {
      return res.status(400).json({ success: false, error: "Гараж не найден" });
    }

    let parts = garage[0].parts || [];
    if (typeof parts === 'string') {
      parts = JSON.parse(parts);
    }

    // Удалить деталь
    parts = parts.filter(p => p.partId !== partId);

    // Пересчитать статы
    const stats = parts.length > 0 ? {
      totalPowerGain: parts.reduce((sum, p) => sum + (p.powerGain || 0), 0),
      totalTorqueGain: parts.reduce((sum, p) => sum + (p.torqueGain || 0), 0),
      avgCompatibility: Math.round(parts.reduce((sum, p) => sum + (p.compatibilityScore || 5), 0) / parts.length),
      totalInstallDifficulty: Math.round(parts.reduce((sum, p) => sum + (p.installDifficulty || 5), 0) / parts.length),
      partsCount: parts.length
    } : {};

    // Сохранить
    await db.sequelize.query(`
      UPDATE user_garage 
      SET parts = :parts::jsonb, 
          stats = :stats::jsonb, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = :userId
    `, { replacements: { userId, parts: JSON.stringify(parts), stats: JSON.stringify(stats) } });

    res.json({ success: true, message: "Деталь удалена", stats });
  } catch (error) {
    console.error("Garage remove-part error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Очистить гараж (удалить все детали, оставить машину)
app.post("/api/garage/clear-parts", async (req, res) => {
  try {
    const db = require("./app/models");
    const userId = req.body.userId || 1;

    await db.sequelize.query(`
      UPDATE user_garage 
      SET parts = '[]'::jsonb, 
          stats = '{}'::jsonb, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = :userId
    `, { replacements: { userId } });

    res.json({ success: true, message: "Детали очищены" });
  } catch (error) {
    console.error("Garage clear error:", error);
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

// ============================================================
// API для аналитики и коин-панели
// ============================================================

// Получить распределение рейтингов совместимости (из таблицы parts)
app.get("/api/compatibilities/stats/distribution", async (req, res) => {
  try {
    const db = require("./app/models");
    const results = await db.sequelize.query(`
      SELECT 
        CASE 
          WHEN "compatibilityScore" BETWEEN 1 AND 2 THEN '1-2'
          WHEN "compatibilityScore" BETWEEN 3 AND 4 THEN '3-4'
          WHEN "compatibilityScore" BETWEEN 5 AND 6 THEN '5-6'
          WHEN "compatibilityScore" BETWEEN 7 AND 8 THEN '7-8'
          WHEN "compatibilityScore" BETWEEN 9 AND 10 THEN '9-10'
          ELSE '0'
        END as rating_range,
        COUNT(*) as count
      FROM parts
      GROUP BY rating_range
      ORDER BY rating_range
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    // Преобразуем в массив [count_1_2, count_3_4, count_5_6, count_7_8, count_9_10]
    const distribution = [0, 0, 0, 0, 0];
    results.forEach(row => {
      const index = ['1-2', '3-4', '5-6', '7-8', '9-10'].indexOf(row.rating_range);
      if (index !== -1) distribution[index] = parseInt(row.count);
    });
    
    res.json({ success: true, distribution });
  } catch (error) {
    console.error("Compatibility distribution error:", error);
    res.json({ success: false, distribution: [5, 15, 35, 25, 20] });
  }
});

// Отправить коины пользователю (админ-панель)
app.post("/api/coins/send", async (req, res) => {
  try {
    const { userId, amount, adminId = 1 } = req.body;
    
    if (!userId || !amount || amount < 1) {
      return res.status(400).json({ success: false, error: "userId и amount обязательны" });
    }
    
    const db = require("./app/models");
    const Customer = db.customers;
    
    // Находим пользователя
    const customer = await Customer.findByPk(userId);
    if (!customer) {
      return res.status(404).json({ success: false, error: "Пользователь не найден" });
    }
    
    // Обновляем баланс
    const currentBalance = customer.balance || 0;
    await customer.update({ balance: currentBalance + parseInt(amount) });
    
    // Логируем транзакцию (можно добавить отдельную таблицу transactions)
    console.log(`[COINS] Admin ${adminId} sent ${amount} coins to user ${userId}`);
    
    res.json({ 
      success: true, 
      message: `Отправлено ${amount} коинов пользователю ${customer.fullname || customer.email}`,
      newBalance: currentBalance + parseInt(amount)
    });
  } catch (error) {
    console.error("Send coins error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить статистику для аналитики
app.get("/api/stats", async (req, res) => {
  try {
    const db = require("./app/models");
    
    const [
      [carsCount],
      [partsCount],
      [manufacturersCount],
      [categoriesCount],
      [compatibilitiesCount],
      [customersCount]
    ] = await Promise.all([
      db.sequelize.query("SELECT COUNT(*) as count FROM cars", { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query("SELECT COUNT(*) as count FROM parts", { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query("SELECT COUNT(*) as count FROM manufacturers", { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query("SELECT COUNT(*) as count FROM categories", { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query("SELECT COUNT(*) as count FROM compatibilities", { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query("SELECT COUNT(*) as count FROM customers", { type: db.sequelize.QueryTypes.SELECT })
    ]);
    
    res.json({
      success: true,
      stats: {
        totalCars: parseInt(carsCount?.count || 0),
        totalParts: parseInt(partsCount?.count || 0),
        totalManufacturers: parseInt(manufacturersCount?.count || 0),
        totalCategories: parseInt(categoriesCount?.count || 0),
        totalCompatibilities: parseInt(compatibilitiesCount?.count || 0),
        totalCustomers: parseInt(customersCount?.count || 0)
      }
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.json({
      success: true,
      stats: {
        totalCars: 22, totalParts: 45, totalManufacturers: 18,
        totalCategories: 8, totalCompatibilities: 67, totalCustomers: 5
      }
    });
  }
});

// ============================================================
// API для новостей
// ============================================================

// Получить все новости (premium сначала, затем по дате)
app.get("/api/news", async (req, res) => {
  try {
    const db = require("./app/models");
    const news = await db.sequelize.query(`
      SELECT * FROM news 
      WHERE status = 'active'
      ORDER BY 
        CASE style WHEN 'premium' THEN 0 ELSE 1 END,
        created_at DESC
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    res.json({ success: true, news });
  } catch (error) {
    console.error("News fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить одну новость по ID (с увеличением просмотров)
app.get("/api/news/:id", async (req, res) => {
  try {
    const db = require("./app/models");
    const newsId = req.params.id;
    
    // Увеличиваем счетчик просмотров
    await db.sequelize.query(
      `UPDATE news SET views = views + 1 WHERE id = :id`,
      { replacements: { id: newsId }, type: db.sequelize.QueryTypes.UPDATE }
    );
    
    const [news] = await db.sequelize.query(
      `SELECT * FROM news WHERE id = :id`,
      { replacements: { id: newsId }, type: db.sequelize.QueryTypes.SELECT }
    );
    
    if (!news) {
      return res.status(404).json({ success: false, error: "News not found" });
    }
    
    res.json({ success: true, news });
  } catch (error) {
    console.error("News fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Создать новость с оплатой COIN
app.post("/api/news", async (req, res) => {
  try {
    const db = require("./app/models");
    const { title, content, author, userId, style = 'classic' } = req.body;
    
    if (!title || !content || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: "Title, content and userId are required" 
      });
    }
    
    // Расчет стоимости
    const baseCost = 1000;
    const styleCost = style === 'premium' ? 1500 : 500;
    const totalCost = baseCost + styleCost;
    
    // Проверяем баланс пользователя
    const [user] = await db.sequelize.query(
      `SELECT id, fullname, balance FROM customers WHERE id = :userId`,
      { replacements: { userId }, type: db.sequelize.QueryTypes.SELECT }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    if (user.balance < totalCost) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient balance. Required: ${totalCost} COIN, Available: ${user.balance} COIN`,
        required: totalCost,
        available: user.balance
      });
    }
    
    // Списываем COIN
    await db.sequelize.query(
      `UPDATE customers SET balance = balance - :cost WHERE id = :userId`,
      { replacements: { cost: totalCost, userId }, type: db.sequelize.QueryTypes.UPDATE }
    );
    
    // Создаем новость
    const [newNews] = await db.sequelize.query(`
      INSERT INTO news (title, content, author, author_id, style, status, views)
      VALUES (:title, :content, :author, :userId, :style, 'active', 0)
      RETURNING *
    `, {
      replacements: { title, content, author: author || user.fullname, userId, style },
      type: db.sequelize.QueryTypes.INSERT
    });
    
    // Записываем платеж
    await db.sequelize.query(`
      INSERT INTO news_payments (news_id, user_id, amount, base_cost, style_cost)
      VALUES (:newsId, :userId, :amount, :baseCost, :styleCost)
    `, {
      replacements: { 
        newsId: newNews.id, 
        userId, 
        amount: totalCost, 
        baseCost, 
        styleCost 
      },
      type: db.sequelize.QueryTypes.INSERT
    });
    
    res.json({ 
      success: true, 
      news: newNews,
      cost: totalCost,
      remainingBalance: user.balance - totalCost
    });
  } catch (error) {
    console.error("News creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Удалить новость (только автор или админ)
app.delete("/api/news/:id", async (req, res) => {
  try {
    const db = require("./app/models");
    const newsId = req.params.id;
    const { userId } = req.body;
    
    const [news] = await db.sequelize.query(
      `SELECT * FROM news WHERE id = :id`,
      { replacements: { id: newsId }, type: db.sequelize.QueryTypes.SELECT }
    );
    
    if (!news) {
      return res.status(404).json({ success: false, error: "News not found" });
    }
    
    // Проверяем права (автор или админ)
    if (news.author_id != userId) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    
    await db.sequelize.query(
      `DELETE FROM news WHERE id = :id`,
      { replacements: { id: newsId }, type: db.sequelize.QueryTypes.DELETE }
    );
    
    res.json({ success: true, message: "News deleted" });
  } catch (error) {
    console.error("News delete error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// ============================================================
// API для поиска деталей на внешних площадках
// ============================================================

// Поиск на Авито - возвращает редирект или прокси-страницу
app.get("/api/search/avito", async (req, res) => {
  try {
    const { query, categoryID = 5 } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, error: "Query parameter required" });
    }

    // Формируем URL для Авито
    // categoryID=5 - запчасти и аксессуары
    const avitoUrl = `https://www.avito.ru/all?q=${encodeURIComponent(query)}&categoryID=${categoryID}`;

    // Вариант 1: Простой редирект (быстрый, но Авито может блокировать)
    // res.redirect(avitoUrl);

    // Вариант 2: Прокси через наш сервер (можно добавить кастомизацию)
    // Делаем fetch и возвращаем HTML (может не работать без headless browser)
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

    try {
      const response = await fetch(avitoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': 'https://www.avito.ru/'
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Avito returned ${response.status}`);
      }

      const html = await response.text();

      // Модифицируем HTML для вставки нашего фрейма
      const modifiedHtml = html
        .replace(/<head>/i, `<head><base href="https://www.avito.ru/">`)
        .replace(/<\/body>/i, `
          <div style="position:fixed;top:0;left:0;right:0;background:#dc586d;color:white;padding:10px;text-align:center;z-index:99999;font-family:Inter,sans-serif;">
            🔍 Результаты поиска на Авито для: "${query}" | 
            <a href="${avitoUrl}" target="_blank" style="color:white;text-decoration:underline;">Открыть оригинал</a> | 
            <a href="javascript:window.close()" style="color:white;text-decoration:underline;">Закрыть</a>
          </div>
          <script>window.scrollTo(0, 100);</script>
        </body>`);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(modifiedHtml);

    } catch (fetchError) {
      console.error('Avito fetch error:', fetchError.message);
      // Fallback: редирект на прямую ссылку
      res.redirect(avitoUrl);
    }

  } catch (error) {
    console.error("Avito search error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Поиск через Яндекс - просто редирект (они менее агрессивно блокируют)
app.get("/api/search/yandex", (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, error: "Query parameter required" });
  }
  const yandexUrl = `https://yandex.ru/search/?text=${encodeURIComponent(query)}`;
  res.redirect(yandexUrl);
});

// Health check endpoint для проверки поиска
app.get("/api/search/health", (req, res) => {
  res.json({
    success: true,
    endpoints: {
      avito: "/api/search/avito?query=турбина",
      yandex: "/api/search/yandex?query=турбина"
    },
    note: "Avito может требовать headless browser для стабильной работы"
  });
});

const db = require("./app/models");
// Отключаем автоматический sync, чтобы не перезаписывать init.sql структуру
// Таблицы управляются через init.sql
db.sequelize.authenticate().then(() => {
  console.log("Database connection established successfully!");
}).catch(err => {
  console.log("Failed to connect to database: " + err.message);
});
