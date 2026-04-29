module.exports = (sequelize, Sequelize) => {
  const SystemSetting = sequelize.define("system_settings", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    },
    administratorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'administrators',
        key: 'id'
      }
    }
  });

  return SystemSetting;
};
