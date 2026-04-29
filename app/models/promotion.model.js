module.exports = (sequelize, Sequelize) => {
  const Promotion = sequelize.define("promotions", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    discount: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    }
  });

  return Promotion;
};
