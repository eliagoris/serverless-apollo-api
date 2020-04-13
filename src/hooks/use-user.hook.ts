import { Claim } from "@magic-sdk/admin"
import * as jwt from "jsonwebtoken"

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
    const { issuer } = jwt.verify(accessToken, MAGIC_LINK_SECRET_KEY)

    if (!issuer) return false

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

    const createdUser = await createUser(userToCreate)
    return createdUser
  }

  const createUser = async (user: User) => {
    const createdUser = await UserModel.create(user)
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
    getAllUsers,
    createUser,
    createUserFromMagicUser,
    getUserById,
    getUserByIssuer,
    updateUserFromMagicUser,
    getUserByAccessToken,
  }
}