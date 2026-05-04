const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Модели для системы тюнинга автомобилей
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.parts = require("./part.model.js")(sequelize, Sequelize);
db.manufacturers = require("./manufacturer.model.js")(sequelize, Sequelize);
db.cars = require("./car.model.js")(sequelize, Sequelize);
db.compatibility = require("./compatibility.model.js")(sequelize, Sequelize);
db.customers = require("./customer.model.js")(sequelize, Sequelize);
db.orders = require("./order.model.js")(sequelize, Sequelize);
db.promotions = require("./promotion.model.js")(sequelize, Sequelize);
db.reviews = require("./review.model.js")(sequelize, Sequelize);
db.services = require("./service.model.js")(sequelize, Sequelize);
db.appointments = require("./appointment.model.js")(sequelize, Sequelize);
db.administrators = require("./administrator.model.js")(sequelize, Sequelize);
db.systemSettings = require("./systemSetting.model.js")(sequelize, Sequelize);
db.news = require("./news.model.js")(sequelize, Sequelize);

// Определение связей между моделями
db.categories.hasMany(db.parts, { foreignKey: 'categoryId' });
db.parts.belongsTo(db.categories, { foreignKey: 'categoryId' });

db.manufacturers.hasMany(db.parts, { foreignKey: 'manufacturerId' });
db.parts.belongsTo(db.manufacturers, { foreignKey: 'manufacturerId' });

db.cars.hasMany(db.compatibility, { foreignKey: 'carId' });
db.compatibility.belongsTo(db.cars, { foreignKey: 'carId' });

db.parts.hasMany(db.compatibility, { foreignKey: 'partId' });
db.compatibility.belongsTo(db.parts, { foreignKey: 'partId' });

db.customers.hasMany(db.orders, { foreignKey: 'customerId' });
db.orders.belongsTo(db.customers, { foreignKey: 'customerId' });

db.promotions.hasMany(db.orders, { foreignKey: 'promotionId' });
db.orders.belongsTo(db.promotions, { foreignKey: 'promotionId' });

db.customers.hasMany(db.reviews, { foreignKey: 'customerId' });
db.reviews.belongsTo(db.customers, { foreignKey: 'customerId' });

db.parts.hasMany(db.reviews, { foreignKey: 'partId' });
db.reviews.belongsTo(db.parts, { foreignKey: 'partId' });

db.services.hasMany(db.appointments, { foreignKey: 'serviceId' });
db.appointments.belongsTo(db.services, { foreignKey: 'serviceId' });

db.customers.hasMany(db.appointments, { foreignKey: 'customerId' });
db.appointments.belongsTo(db.customers, { foreignKey: 'customerId' });

db.administrators.hasMany(db.systemSettings, { foreignKey: 'administratorId' });
db.systemSettings.belongsTo(db.administrators, { foreignKey: 'administratorId' });

// Связь многие ко многим между заказами и деталями через compatibility
db.parts.belongsToMany(db.orders, { 
  through: 'order_parts',
  foreignKey: 'partId',
  otherKey: 'orderId'
});
db.orders.belongsToMany(db.parts, { 
  through: 'order_parts',
  foreignKey: 'orderId',
  otherKey: 'partId'
});

module.exports = db;
