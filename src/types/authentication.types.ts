export const authenticationTypes = `
  type AuthenticationPayload {
    user: User
    accessToken: String
  }

  input AuthenticationInput {
    didToken: String!
  }
`
