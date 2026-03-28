const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    unique: true, // 1-1 relationship
  },
  university_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year_joined: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'teachers',
});

// Setup relationship
User.hasOne(Teacher, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Teacher.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Teacher;
