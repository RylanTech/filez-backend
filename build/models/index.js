"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
require("dotenv/config");
const users_1 = require("./users");
const dbName = "filez";
const username = "root";
const password = "0624";
// const dbName = process.env.DB_NAME ?? '';
// const username = process.env.DB_USER ?? '';
// const password = process.env.DB_PASS ?? '';
const sequelize = new sequelize_1.Sequelize(dbName, username, password, {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});
(0, users_1.userFactory)(sequelize);
exports.db = sequelize;
