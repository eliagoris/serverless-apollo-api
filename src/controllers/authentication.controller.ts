import { APIGatewayProxyHandler } from "aws-lambda"
import { Magic } from "@magic-sdk/admin"
import * as jwt from "jsonwebtoken"

import { getIsAuthorizationTokenValid } from "../helpers/authorization-token-validator"
import { useUser, MagicUser } from "../hooks/use-user"

const {
  env: { MAGIC_LINK_SECRET_KEY },
} = process
const magic = new Magic(MAGIC_LINK_SECRET_KEY)

/**
 * Generates magic user from DID token
 */
const getMagicUserFromDidToken = (didToken: string) => {
  const user: MagicUser = {
    issuer: magic.token.getIssuer(didToken),
    publicAddress: magic.token.getPublicAddress(didToken),
    claim: magic.token.decode(didToken)[1],
  }

  return user
}

/**
 * Creates user authentication from authorization token
 */
export const createAuthentication: APIGatewayProxyHandler = async (event) => {
  const {
    headers: { authorization },
  } = event as any

  const isTokenValid = getIsAuthorizationTokenValid(authorization)

  if (!isTokenValid) {
    return {
      statusCode: 403,
      body: "Malformed authorization header.",
    }
  }

  try {
    const didToken = authorization!.substring(7)

    /** First, validate the DID token */
    magic.token.validate(didToken)

    /** Generate magic user from DID token */
    const magicUser = getMagicUserFromDidToken(didToken)
    const { issuer } = magicUser

    /** Create JWT */
    const token = jwt.sign({ issuer }, MAGIC_LINK_SECRET_KEY)

    /** Now we check if it's a returning or a new user */
    /** Use user hook to retrieve the user from database */
    const {
      getUserByIssuer,
      createUserFromMagicUser,
      updateUserFromMagicUser,
    } = await useUser()
    const existingUser = await getUserByIssuer(issuer)

    /**
     * Make sure to update if the user already exists, and create if not
     */
    let user: object
    if (!existingUser) {
      console.log("creating user...")
      user = await createUserFromMagicUser(magicUser)
    } else {
      console.log("updating user...")
      user = await updateUserFromMagicUser(magicUser)
    }

    /** Return the user and the access token */
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: token,
        user,
      }),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 403,
      body: JSON.stringify(err),
    }
  }
}
