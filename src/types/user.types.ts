export const userTypes = `
  type Position {
    x: String
    y: String
  }

  type Character {
    name: String
    lookType: String
    position: Position
  }

  type User {
    _id: String
    email: String!
    username: String
    issuer: String!
    name: String
    lastLoginAt: String
    characters: [Character]
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
