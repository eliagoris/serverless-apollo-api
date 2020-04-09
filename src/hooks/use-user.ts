import { Claim } from "@magic-sdk/admin"

import { getDatabaseConnection } from "../helpers/database-connector"
import User from "../models/user"

interface User {
  issuer: string
  email: string
  username: string
  name: string
  lastLoginAt: number
}

export interface MagicUser {
  issuer: string
  publicAddress: string
  claim: Claim
}

export async function useUser() {
  const databaseConnection = await getDatabaseConnection()
  const UserModel = User(databaseConnection)

  const getUserById = async (id: string): Promise<User> => {
    const user = await UserModel.findById(id)

    return user
  }

  const getUserByIssuer = async (issuer: string): Promise<User> => {
    const user = await UserModel.findOne({ issuer })

    return user
  }

  const createUserFromMagicUser = async (user: MagicUser) => {
    const userToCreate: User = {
      issuer: user.issuer,
      email: "mail@mail.com",
      username: "eduardo",
      name: "Eduardo Campos",
      lastLoginAt: user.claim.iat,
    }

    const createdUser = await UserModel.create(userToCreate)
    return createdUser
  }

  const updateUserFromMagicUser = async (user: MagicUser) => {
    const userToUpdate: User = {
      issuer: user.issuer,
      email: "mail@mail.com",
      username: "eduardo",
      name: "Eduardo C.",
      lastLoginAt: user.claim.iat,
    }

    const updated = await UserModel.findOneAndUpdate(
      { issuer: user.issuer },
      userToUpdate
    )
    return updated
  }

  return {
    UserModel,
    createUserFromMagicUser,
    getUserById,
    getUserByIssuer,
    updateUserFromMagicUser,
  }
}
