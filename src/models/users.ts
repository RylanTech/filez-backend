import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>{
    declare userId: number;
    declare email: string;
    declare password: string;
    declare name: string;
    declare userType: string;
}

export function userFactory(sequelize: Sequelize) {
    User.init({
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userType: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            freezeTableName: true,
            tableName: 'user',
            sequelize,
            collate: 'utf8_general_ci',
        })
}