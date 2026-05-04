module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define("news", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    authorId: {
      type: Sequelize.INTEGER,
      field: 'author_id'
    },
    style: {
      type: Sequelize.STRING(20),
      defaultValue: 'classic'
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'active'
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return News;
};
