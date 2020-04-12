import { APIGatewayProxyHandler } from "aws-lambda"

import { useUser } from "../hooks/use-user.hook"
import { getIsAuthorizationTokenValid } from "../helpers/authorization-token-validator"

export const getAuthenticatedUser: APIGatewayProxyHandler = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

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
    const accessToken = Authorization!.substring(7)

    const { getUserByAccessToken } = await useUser()

    /** Retrieve user by access token */
    const user = await getUserByAccessToken(accessToken)

    if (!user) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "text/plain" },
        body: "User is not authenticated.",
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the user.",
    }
  }
}

export const getOneUserById: APIGatewayProxyHandler = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { getUserById } = await useUser()

    const { pathParameters } = event

    if (!pathParameters || !pathParameters.id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "text/plain" },
        body: "Malformed request.",
      }
    }

    const user = await getUserById(pathParameters.id)

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the user.",
    }
  }
}
