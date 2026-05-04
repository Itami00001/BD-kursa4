module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define("cars", {
    brand: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'brand'
    },
    model: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'model'
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'year'
    },
    country: {
      type: Sequelize.STRING(50),
      defaultValue: 'unknown',
      field: 'country'
    },
    description: {
      type: Sequelize.TEXT,
      field: 'description'
    },
    image: {
      type: Sequelize.STRING(10),
      defaultValue: '🚗',
      field: 'image'
    },
    power: {
      type: Sequelize.STRING(50),
      field: 'power'
    },
    torque: {
      type: Sequelize.STRING(50),
      field: 'torque'
    },
    acceleration: {
      type: Sequelize.STRING(50),
      field: 'acceleration'
    },
    topSpeed: {
      type: Sequelize.STRING(50),
      field: 'topSpeed'
    },
    compatibilityRating: {
      type: Sequelize.DECIMAL(3, 1),
      defaultValue: 0,
      field: 'compatibilityRating'
    }
  }, {
    underscored: false,
    freezeTableName: true,
    timestamps: false
  });

  return Car;
};
