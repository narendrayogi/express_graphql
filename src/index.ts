import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLError } from "graphql";
import queryComplexity, {
	simpleEstimator,
	fieldExtensionsEstimator,
} from "graphql-query-complexity";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { UserResolver } from "./resolver/user";

// Express configuration
const app: Application = express();

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(express.json({}));

const bootstrap = async () => {
	const schema = await buildSchema({
		resolvers: [UserResolver],
		nullableByDefault: true,
		emitSchemaFile: true,
	});

	app.use(
		"/graphql",
		graphqlHTTP(async (req, res, { variables }) => ({
			schema,
			graphiql: true,
			validationRules: [
				/**
				 * This provides GraphQL query analysis to reject complex queries to your GraphQL server.
				 * This can be used to protect your GraphQL servers
				 * against resource exhaustion and DoS attacks.
				 * More documentation can be found (here)[https://github.com/ivome/graphql-query-complexity]
				 */
				queryComplexity({
					// The maximum allowed query complexity, queries above this threshold will be rejected
					maximumComplexity: 20,
					// The query variables. This is needed because the variables are not available
					// in the visitor of the graphql-js library
					variables,
					// Optional callback function to retrieve the determined query complexity
					// Will be invoked weather the query is rejected or not
					// This can be used for logging or to implement rate limiting
					onComplete: (complexity: number) => {
						// tslint:disable-next-line: no-console
						console.log("Determined query complexity: ", complexity);
					},
					createError: (max: number, actual: number) => {
						return new GraphQLError(
							`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`,
						);
					},
					// Add any number of estimators. The estimators are invoked in order, the first
					// numeric value that is being returned by an estimator is used as the field complexity.
					// If no estimator returns a value, an exception is raised.
					estimators: [
						// fieldConfigEstimator(),
						fieldExtensionsEstimator(),
						// Add more estimators here...
						// This will assign each field a complexity of 1 if no other estimator
						// returned a value.
						simpleEstimator({
							defaultComplexity: 1,
						}),
					],
				}),
			],
		})),
	);

	const server = app.listen(4000, async () => {
		console.log("\nRunning a GraphQL API server at http://localhost:4000/graphql");

		return AppDataSource.initialize()
			.then(() => {
				console.log("Data Source has been initialized!")
			})
			.catch((err) => {
				console.error("Error during Data Source initialization", err)
			})
	});
};

export default bootstrap();