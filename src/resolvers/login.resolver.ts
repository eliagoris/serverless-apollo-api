import { useAuthentication } from "../hooks/use-authentication"

export const resolvers = {
  Mutation: {
    async login(parent, { input }) {
      const { createAuthentication } = await useAuthentication()

      const user = await createAuthentication(input)
      return user
    },
  },
}
