import { Config } from './config.type';
import * as process from 'node:process';

export default (): Config => ({
  nats: process.env.NATS_SERVERS.split(','),
  database: {
    url: process.env.DATABASE_URL,
  },
});
