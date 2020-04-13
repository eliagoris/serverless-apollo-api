import { useUser } from "../hooks/use-user.hook"

export const userResolvers = {
  Query: {
    async user(parent, { accessToken }) {
      const { getUserByAccessToken } = await useUser()

      const user = await getUserByAccessToken(accessToken)

      return user
    },

    async users() {
      const { getAllUsers } = await useUser()

      const users = await getAllUsers()

      return users
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
