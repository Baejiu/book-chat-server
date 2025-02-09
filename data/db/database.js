import { config } from '../../config.js';
import SQ from 'sequelize';

const { host, user, database, password, port, name, dialect } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  port,
  name,
  dialect,
  logging: false,
});
