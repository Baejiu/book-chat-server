import { sequelize } from './db/database.js';
import SQ from 'sequelize';

const DataTypes = SQ.DataTypes;

export const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  nickname: {
    type: DataTypes.STRING(45),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  url: DataTypes.TEXT,
});
export async function findBynickname(nickname) {
  return User.findOne({ where: { nickname } });
}
export async function findById(id) {
  return User.findByPk(id);
}

export async function createUser(user) {
  return User.create(user).then((data) => {
    console.log(data);
    return data.dataValues.id;
  });
}
