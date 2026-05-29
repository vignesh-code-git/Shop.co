const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UploadedFile = sequelize.define('UploadedFile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['filename']
    }
  ]
});

module.exports = UploadedFile;
