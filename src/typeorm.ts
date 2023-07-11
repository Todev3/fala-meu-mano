import path from "path";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: true,
  entities: [path.join(__dirname, "entity/*.{ts,js}")],
  subscribers: [],
});

export const startConnection = async (): Promise<DataSource> =>
  await dataSource.initialize();

export const getDataSource = (): DataSource => dataSource;
