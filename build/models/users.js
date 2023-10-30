"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFactory = exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
function userFactory(sequelize) {
    User.init({
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        userType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        tableName: 'user',
        sequelize,
        collate: 'utf8_general_ci',
    });
}
exports.userFactory = userFactory;
