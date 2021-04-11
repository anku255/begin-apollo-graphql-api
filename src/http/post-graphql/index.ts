import "dotenv-safe/config";
import arc from "@architect/functions";
import { ApolloServer } from "apollo-server-lambda";
// import { composeMongoose } from "graphql-compose-mongoose";
// import { schemaComposer } from "graphql-compose";
// import Quote from "./models/quote.model";
import "./config/database";
import { redisConnection } from "./utils/redis";
import graphqlSchema from "./graphql/schema";

const redisClient = redisConnection();

// // STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
// const customizationOptions = {}; // left it empty for simplicity, described below
// const QuoteTC = composeMongoose(Quote, customizationOptions);

// // STEP 3: Add needed CRUD User operations to the GraphQL Schema
// // via graphql-compose it will be much much easier, with less typing
// schemaComposer.Query.addFields({
//   quoteById: QuoteTC.mongooseResolvers.findById(),
//   quoteByIds: QuoteTC.mongooseResolvers.findByIds(),
//   quoteOne: QuoteTC.mongooseResolvers.findOne(),
//   quoteMany: QuoteTC.mongooseResolvers.findMany(),
//   quoteDataLoader: QuoteTC.mongooseResolvers.dataLoader(),
//   quoteDataLoaderMany: QuoteTC.mongooseResolvers.dataLoaderMany(),
// });

// const graphqlSchema = schemaComposer.buildSchema();

let server = new ApolloServer({
  schema: graphqlSchema,
  context: (ctx) => ({
    redisClient,
  }),
});

let handler = server.createHandler();

exports.handler = function (event, context, callback) {
  let body = arc.http.helpers.bodyParser(event);
  // Support for AWS HTTP API syntax
  event.httpMethod = event.httpMethod
    ? event.httpMethod
    : event.requestContext.http.method;
  // Also support hte HTTP syntax...
  event.path = event.rawPath;
  // Body is now parsed, re-encode to JSON for Apollo
  event.body = JSON.stringify(body);
  handler(event, context, callback);
};
