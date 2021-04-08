import { Claim, MagicUserMetadata } from "@magic-sdk/admin"
import { verify } from "jsonwebtoken"

import { getDatabaseConnection } from "../helpers/database-connector"
import User from "../models/user"

interface User {
  issuer: string
  email: string
  username?: string
  name?: string
  lastLoginAt?: number
}

export interface MagicUser {
  issuer: string
  publicAddress: string
  claim: Claim
}

export async function useUser() {
  const databaseConnection = await getDatabaseConnection()
  const UserModel = User(databaseConnection)

  const getAllUsers = async (): Promise<any> => {
    const users = await UserModel.find()

    return users
  }

  const getUserById = async (id: string): Promise<User> => {
    const user = await UserModel.findById(id)

    return user
  }

  const getUserByIssuer = async (issuer: string): Promise<User> => {
    const user = await UserModel.findOne({ issuer })

    return user
  }

  const getUserByAccessToken = async (accessToken: string) => {
    const {
      env: { MAGIC_LINK_SECRET_KEY },
    } = process
    const token = verify(
      accessToken,
      MAGIC_LINK_SECRET_KEY || "This is not a secret"
    ) as { issuer: string }

    if (!token) return false

    const { issuer } = token
    const user = getUserByIssuer(issuer)

    return user
  }

  const createUser = async (user: User) => {
    const createdUser = await UserModel.create(user)

    return createdUser
  }

  /**
   * Used to create the user on first login
   */
  const createUserFromMagicUser = async (
    user: MagicUser,
    userMetaData: MagicUserMetadata
  ) => {
    const { issuer } = user
    const { email, ...rest } = userMetaData

    const userToCreate: User = {
      ...rest,
      issuer,
      email: email ?? "",
      lastLoginAt: user.claim.iat,
    }

    const createdUser = await createUser(userToCreate)
    return createdUser
  }

  /**
   * Updates user last login timestamp
   */
  const updateUserFromMagicUser = async (
    user: MagicUser,
    userMetaData: MagicUserMetadata
  ) => {
    const { issuer } = user
    const { email } = userMetaData

    const userToUpdate: User = {
      issuer,
      email: email ?? "",
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
    getAllUsers,
    createUser,
    createUserFromMagicUser,
    getUserById,
    getUserByIssuer,
    updateUserFromMagicUser,
    getUserByAccessToken,
  }
}
