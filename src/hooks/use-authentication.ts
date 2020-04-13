import { Magic } from "@magic-sdk/admin"
import { sign } from "jsonwebtoken"

import { useUser, MagicUser } from "../hooks/use-user.hook"

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

export function useAuthentication() {
  async function createAuthentication(didToken: string) {
    try {
      /** First, validate the DID token */
      magic.token.validate(didToken)

      /** Generate magic user from DID token */
      const magicUser = getMagicUserFromDidToken(didToken)
      const { issuer } = magicUser
      const accessToken = sign(
        { issuer },
        MAGIC_LINK_SECRET_KEY || "This is not a secret"
      )

      /** Get user meta data */
      const userMetaData = await magic.users.getMetadataByIssuer(issuer)

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
        user = await createUserFromMagicUser(magicUser, userMetaData)
      } else {
        console.log("updating user...")
        user = await updateUserFromMagicUser(magicUser, userMetaData)
      }

      return { user, accessToken }
    } catch (e) {
      throw e
    }
  }

  return { createAuthentication }
}
