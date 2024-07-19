export type DatabaseConfig = {
  url: string;
};

export type Config = {
  port: number;
  host: string;
  database: DatabaseConfig;
};
