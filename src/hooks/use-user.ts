import { getDatabaseConnection } from "../helpers/database-connector"
import User from "../models/user"

export async function useUser() {
  const databaseConnection = await getDatabaseConnection()
  const UserModel = User(databaseConnection)

  const getUserById = async (id: string) => {
    const user = await UserModel.findById(id)

    return user
  }

  return { UserModel, getUserById }
}
