module.exports = (sequelize, Sequelize) => {
  const Manufacturer = sequelize.define("manufacturers", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Manufacturer;
};
