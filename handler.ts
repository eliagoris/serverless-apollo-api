"use strict"

import { ApolloServer } from "apollo-server-lambda"
import lambdaPlayground from "graphql-playground-middleware-lambda"

import { schema } from "./src/schemas"

const server = new ApolloServer({
  schema,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context: () => {
      console.log(context)
      return context
    },
  }),
  playground: {
    endpoint: "/dev/graphql",
  },
})

exports.playgroundHandler = lambdaPlayground({
  endpoint: "/dev/graphql",
})

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
})

import { handleAuthorization } from "./src/controllers/authorization.controller"

export const authorizationHandler = handleAuthorization
