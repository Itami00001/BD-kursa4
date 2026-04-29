module.exports = (sequelize, Sequelize) => {
  const Compatibility = sequelize.define("compatibility", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    carId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'cars',
        key: 'id'
      }
    },
    partId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'parts',
        key: 'id'
      }
    },
    note: {
      type: Sequelize.TEXT
    }
  });

  return Compatibility;
};
