import "reflect-metadata";
import { DataSource } from "typeorm";
import { AllEntities } from "./entity";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "root",
	database: "react_graphql",
	synchronize: true,
	logging: false,
	entities: AllEntities,
	migrations: [],
	subscribers: [],
});