import { User } from './auth.js';
import { sequelize } from './db/database.js';
import SQ from 'sequelize';

const Sequelize = SQ.Sequelize;
const DataTypes = SQ.DataTypes;

const Tweet = sequelize.define('tweet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Tweet.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'userId',
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.nickname'), 'nickname'],
    [Sequelize.col('user.url'), 'url'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};
const ORDER_DESC1 = { order: [['createdAt', 'DESC']] };

export async function getAll() {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC1,
  });
}

export async function getAllBynickname(nickname) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC1,
    include: {
      ...INCLUDE_USER.include,
      where: {
        nickname,
      },
    },
  });
}

export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text, userId) {
  return Tweet.create({ text, userId }) //
    .then((data) => this.getById(data.dataValues.id));
}

export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then((tweet) => {
      tweet.text = text;
      return tweet.save();
    });
}

export async function remove(id) {
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then((tweet) => {
      tweet.destroy();
    });
}
