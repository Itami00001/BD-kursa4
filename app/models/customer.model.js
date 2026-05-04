module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customers", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'fullname'
    },
    phone: {
      type: Sequelize.STRING,
      field: 'phone'
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'email'
    },
    balance: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      field: 'balance'
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false
  });

  return Customer;
};
