const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');


const Testimonial = sequelize.define('testimonial', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    profession: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false
    }

}, {
    tableName: 'testimonials',
    underscored: true
});

module.exports = Testimonial;