module.exports = (sequelize, Sequelize) => {
  const Part = sequelize.define("part", {
    name: {
      type: Sequelize.STRING(250),
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    categoryId: {
      type: Sequelize.INTEGER
    },
    manufacturerId: {
      type: Sequelize.INTEGER
    },
    powerGain: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    torqueGain: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    compatibilityScore: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
    installDifficulty: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
    instruction: {
      type: Sequelize.TEXT
    }
  });

  return Part;
};
