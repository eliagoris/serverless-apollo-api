import { useUser } from "../hooks/use-user.hook"

export const resolvers = {
  Query: {
    async user(parent, { accessToken }) {
      const { getUserByAccessToken } = await useUser()

      const user = await getUserByAccessToken(accessToken)

      return user
    },
  },

  Mutation: {
    async createUser(parent, { input }) {
      const { createUser } = await useUser()

      const user = await createUser(input)
      return user
    },
  },
}
