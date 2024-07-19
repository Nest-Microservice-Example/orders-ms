import { Config } from './config.type';
import * as process from 'node:process';

export default (): Config => ({
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST,
  database: {
    url: process.env.DATABASE_URL,
  },
});
