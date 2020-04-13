import { makeExecutableSchema } from "apollo-server"

import { userTypes } from "../types/user.types"
import { userResolvers } from "../resolvers/user.resolver"
import { authenticationResolvers } from "../resolvers/authentication.resolver"
import { authenticationTypes } from "../types/authentication.types"

const queries = `
  type Query {
    user(accessToken: String): User
    users: [User]
  }
`

const mutations = `
  type Mutation {
    createUser(input: CreateUserInput!): CreateUserPayload
    createAuthentication(input: AuthenticationInput!): AuthenticationPayload
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [queries, mutations, userTypes, authenticationTypes],
  resolvers: [userResolvers, authenticationResolvers],
})
