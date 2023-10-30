import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { User } from "./users";


export class File extends Model<InferAttributes<File>, InferCreationAttributes<File>>{
    declare fileId: number;
    declare name: string;
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