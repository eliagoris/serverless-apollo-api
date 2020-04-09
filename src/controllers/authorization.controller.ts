import { APIGatewayAuthorizerHandler } from "aws-lambda"
import { Magic } from "@magic-sdk/admin"

import { generatePolicy } from "../helpers/policy-generator"

const {
  env: { MAGIC_LINK_SECRET_KEY },
} = process
const magic = new Magic(MAGIC_LINK_SECRET_KEY)

export const handleAuthorization: APIGatewayAuthorizerHandler = async (
  event
) => {
  const { authorizationToken } = event as any

  const didToken = authorizationToken!.substring(7)
  const attachment = event["attachment"] ?? "none"

  try {
    magic.token.validate(didToken, attachment)

    return generatePolicy(didToken, "Allow", event.methodArn)
  } catch (err) {
    console.log(err)
    return generatePolicy("", "Disallow", event.methodArn)
  }
}
