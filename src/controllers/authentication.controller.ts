import { APIGatewayProxyHandler } from "aws-lambda"
import { Magic, MagicUserMetadata } from "@magic-sdk/admin"
import { getIsAuthorizationTokenValid } from "../helpers/authorization-token-validator"

const {
  env: { MAGIC_LINK_SECRET_KEY },
} = process
const magic = new Magic(MAGIC_LINK_SECRET_KEY)

/**
 * Creates user authentication from authorization token
 */
export const handleLogin: APIGatewayProxyHandler = async (event) => {
  const {
    headers: { Authorization },
  } = event as any

  const isTokenValid = getIsAuthorizationTokenValid(Authorization)

  if (!isTokenValid) {
    return {
      statusCode: 403,
      body: "Malformed authorization header.",
    }
  }

  try {
    const didToken = Authorization!.substring(7)

    /** First, validate the DID token */
    magic.token.validate(didToken)

    const issuer = magic.token.getIssuer(didToken)

    /** Get user metadata */
    const userMetadata: MagicUserMetadata = await magic.users.getMetadataByIssuer(
      issuer
    )

    if (!userMetadata) {
      throw new Error("No user metadata was found")
    }

    const user = {
      issuer,
      email: userMetadata.email,
    }

    /** Returns the user */
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 403,
      body: JSON.stringify(err),
    }
  }
}
