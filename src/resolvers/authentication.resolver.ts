import { AuthenticationError } from "apollo-server"

import { useAuthentication } from "../hooks/use-authentication"

export const authenticationResolvers = {
  Mutation: {
    async createAuthentication(parent, { input: { didToken } }) {
      const { createAuthentication } = useAuthentication()

      try {
        const { user, accessToken } = await createAuthentication(didToken)

        return { user, accessToken }
      } catch (e) {
        throw new AuthenticationError("Couldn't authenticate the user. " + e)
      }
    },
  },
}
