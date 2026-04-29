module.exports = (sequelize, Sequelize) => {
  const Service = sequelize.define("services", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    durationMinutes: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Service;
};
