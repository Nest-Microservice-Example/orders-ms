import { Config } from './config.type';

export default (): Config => ({
  nats: process.env.NATS_SERVERS.split(','),
  database: {
    url: process.env.DATABASE_URL,
  },
});
