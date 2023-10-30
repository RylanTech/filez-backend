"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociateUserFile = exports.fileFactory = exports.File = void 0;
const sequelize_1 = require("sequelize");
const users_1 = require("./users");
class File extends sequelize_1.Model {
}
exports.File = File;
function fileFactory(sequelize) {
    File.init({
        fileId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
        }
    }, {
        freezeTableName: true,
        tableName: 'file',
        sequelize,
        collate: 'utf8_general_ci',
    });
}
exports.fileFactory = fileFactory;
function AssociateUserFile() {
    users_1.User.hasMany(File, { foreignKey: "userId" });
    File.belongsTo(users_1.User, { foreignKey: "userId" });
}
exports.AssociateUserFile = AssociateUserFile;
