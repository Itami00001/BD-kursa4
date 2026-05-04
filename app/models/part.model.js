module.exports = (sequelize, Sequelize) => {
  const Part = sequelize.define("parts", {
    name: {
      type: Sequelize.STRING(250),
      allowNull: false,
      field: 'name'
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      field: 'price'
    },
    categoryid: {
      type: Sequelize.INTEGER,
      field: 'categoryid'
    },
    manufacturerid: {
      type: Sequelize.INTEGER,
      field: 'manufacturerid'
    },
    powerGain: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      field: 'powerGain'
    },
    torqueGain: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      field: 'torqueGain'
    },
    compatibilityScore: {
      type: Sequelize.INTEGER,
      defaultValue: 5,
      field: 'compatibilityScore'
    },
    installDifficulty: {
      type: Sequelize.INTEGER,
      defaultValue: 5,
      field: 'installDifficulty'
    },
    instruction: {
      type: Sequelize.TEXT,
      field: 'instruction'
    }
  }, {
    underscored: false,
    freezeTableName: true,
    timestamps: false
  });

  return Part;
};
