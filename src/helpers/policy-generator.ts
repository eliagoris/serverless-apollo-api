import { AuthResponse } from "aws-lambda"

export const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
) => {
  let authResponse: AuthResponse = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [],
    },
  }

  if (effect && resource) {
    const statementOne = {
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: resource,
    }
    authResponse.policyDocument.Statement[0] = statementOne
  }

  return authResponse
}
