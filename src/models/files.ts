import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { User } from "./users";


export class File extends Model<InferAttributes<File>, InferCreationAttributes<File>>{
    declare fileId: number;
    declare name: string;
    declare path: string;
    declare description: string;
    declare size: string;
    declare uploadDate: Date;
    declare userId: number;
}

export function fileFactory(sequelize: Sequelize) {
    File.init({
        fileId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
        },
        uploadDate: {
            type: DataTypes.DATE,
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
        }
    },
        {
            freezeTableName: true,
            tableName: 'file',
            sequelize,
            collate: 'utf8_general_ci',
        })
}

export function AssociateUserFile() {
    User.hasMany(File, { foreignKey: "userId" });
    File.belongsTo(User, { foreignKey: "userId" });
  }