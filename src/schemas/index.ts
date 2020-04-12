import { makeExecutableSchema } from "apollo-server"

import { userTypes } from "../types/user.types"
import { resolvers as userResolvers } from "../resolvers/user.resolver"

const queries = `
  type Query {
    user(accessToken: String): User
  }
`

const mutations = `
  type Mutation {
    createUser(input: CreateUserInput!): CreateUserPayload
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [queries, mutations, userTypes],
  resolvers: userResolvers,
})
