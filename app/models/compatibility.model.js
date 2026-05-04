module.exports = (sequelize, Sequelize) => {
  const Compatibility = sequelize.define("compatibility", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    carid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'carid'
    },
    partid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'partid'
    },
    note: {
      type: Sequelize.TEXT,
      field: 'note'
    }
  }, {
    underscored: false,
    freezeTableName: true,
    timestamps: false
  });

  return Compatibility;
};
