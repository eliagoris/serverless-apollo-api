import { APIGatewayProxyHandler } from "aws-lambda"
import { useUser } from "../hooks/use-user"

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
