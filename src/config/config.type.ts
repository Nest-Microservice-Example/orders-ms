export type DatabaseConfig = {
  url: string;
};

export type Config = {
  database: DatabaseConfig;
  nats: string[];
};
