module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define("car", {
    brand: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    model: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    country: {
      type: Sequelize.STRING(50),
      defaultValue: 'unknown'
    },
    description: {
      type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.STRING(10),
      defaultValue: '🚗'
    },
    power: {
      type: Sequelize.STRING(50)
    },
    torque: {
      type: Sequelize.STRING(50)
    },
    acceleration: {
      type: Sequelize.STRING(50)
    },
    topSpeed: {
      type: Sequelize.STRING(50)
    },
    compatibilityRating: {
      type: Sequelize.DECIMAL(3, 1),
      defaultValue: 0
    }
  });

  return Car;
};
