export type DatabaseConfig = {
  url: string;
};

export type MicroserviceConfig = {
  port: number;
  host: string;
};

export type Config = {
  port: number;
  host: string;
  database: DatabaseConfig;
  microservice: {
    products: MicroserviceConfig;
  };
};
