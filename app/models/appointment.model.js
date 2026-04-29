module.exports = (sequelize, Sequelize) => {
  const Appointment = sequelize.define("appointments", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    time: {
      type: Sequelize.TIME,
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
    serviceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Appointment;
};
