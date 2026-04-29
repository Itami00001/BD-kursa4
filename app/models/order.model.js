module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    customerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    promotionId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'promotions',
        key: 'id'
      }
    }
  });

  return Order;
};
