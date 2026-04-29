module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define("reviews", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
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
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    text: {
      type: Sequelize.TEXT
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  return Review;
};
