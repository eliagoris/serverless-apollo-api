import { makeExecutableSchema } from "apollo-server"

import { userTypes } from "../types/user.types"
import { resolvers as userResolvers } from "../resolvers/user.resolver"
import { loginTypes } from "../types/login.types"

const queries = `
  type Query {
    user(accessToken: String): User
    users: [User]
  }
`

const mutations = `
  type Mutation {
    createUser(input: CreateUserInput!): CreateUserPayload
    login(input: LoginInput!): LoginPayload
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [queries, mutations, userTypes, loginTypes],
  resolvers: userResolvers,
})
