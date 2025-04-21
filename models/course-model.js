const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const slugify = require('slugify');

const Course = sequelize.define('course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        set(value) {
            this.setDataValue('title', value);
            this.setDataValue('titleSlug', slugify(value, { lower: true, trim: true }));
        }
    },
    imageUrl: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            is: {
                args: /\.(jpg|png)$/i,
                msg: 'Image URL must end with jpg or png'
            }
        }
    },
    summary: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    registrants: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titleSlug: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'courses',
    underscored: true
});

module.exports = Course;