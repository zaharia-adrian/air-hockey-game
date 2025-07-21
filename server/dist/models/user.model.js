import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/db.js';
export class User extends Model {
}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
});
//# sourceMappingURL=user.model.js.map