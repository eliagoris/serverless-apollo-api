"use strict"

import { config } from "dotenv"

config({ path: "./variables.env" })

import { handleAuthorization } from "./src/controllers/authorization.controller"
import { createAuthentication } from "./src/controllers/authentication.controller"

export const authorizationHandler = handleAuthorization

export const createAuthenticationHandler = createAuthentication
