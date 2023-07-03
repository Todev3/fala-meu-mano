import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: true,
  entities: ["src/entity/**/*.ts", "src/entity/**/*.js"],
  subscribers: [],
  migrations: ["migrates/**/*.ts"],
  migrationsTableName: "migrations",
});

export const startConnection = async (): Promise<DataSource> =>
  await dataSource.initialize();

export const getDataSource = (): DataSource => dataSource;
