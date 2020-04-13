export const authenticationTypes = `
  type AuthenticationPayload {
    user: User
  }

  input AuthenticationInput {
    didToken: String!
  }
`
