import { Config } from './config.type';
import * as process from 'node:process';

export default (): Config => ({
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST,
  database: {
    url: process.env.DATABASE_URL,
  },
  microservice: {
    products: {
      port: parseInt(process.env.PRODUCTS_MICROSERVICE_PORT || '3001', 10),
      host: process.env.PRODUCTS_MICROSERVICE_HOST,
    },
  },
});
