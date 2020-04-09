import { APIGatewayProxyHandler } from "aws-lambda"
import { Magic } from "@magic-sdk/admin"
import * as jwt from "jsonwebtoken"

import { getIsAuthorizationTokenValid } from "../helpers/authorization-token-validator"

const {
  env: { MAGIC_LINK_SECRET_KEY },
} = process
const magic = new Magic(MAGIC_LINK_SECRET_KEY)

const getMagicUserFromDidToken = (didToken: string) => {
  const user = {
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

    const magicUser = getMagicUserFromDidToken(didToken)
    const { issuer } = magicUser
    const token = jwt.sign({ issuer }, MAGIC_LINK_SECRET_KEY)

    /** Returns the user */
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: token,
        magicUser,
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
