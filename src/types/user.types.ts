export const userTypes = `
  type User {
    _id: String
    email: String!
    username: String
    issuer: String!
    name: String
    lastLoginAt: String
  }

  type CreateUserPayload {
    user: User
  }

  input CreateUserInput {
    email: String!
    username: String
    issuer: String!
    name: String
    lastLoginAt: String
  }
`
