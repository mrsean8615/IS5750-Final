const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Contact = sequelize.define('contact', {
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
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email address'
            },
            is: {
                args: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                msg: 'Please enter a valid email address'
            }
        }
    },
    subject: {
        type: DataTypes.STRING(),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    post_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    response_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }   
}, {
    tableName: 'contacts',
    underscored: true
}, {
    options: {
        underscored: true,
        tableName: "contacts"
    }
});


module.exports = Contact;