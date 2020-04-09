"use strict"

import { APIGatewayProxyHandler } from "aws-lambda"
import { config } from "dotenv"

config({ path: "./variables.env" })

import {
  createNote,
  getNoteById,
  getAllNotes,
  updateNoteById,
  deleteNoteById,
} from "./src/controllers/note.controller"
import { handleAuthorization } from "./src/controllers/authorization.controller"
import { handleLogin } from "./src/controllers/authentication.controller"

export const authorizationHandler = handleAuthorization

export const loginHandler = handleLogin

export const createNoteHandler: APIGatewayProxyHandler = createNote

export const getOneNoteHandler: APIGatewayProxyHandler = getNoteById

export const getAllNotesHandler: APIGatewayProxyHandler = getAllNotes

export const updateNoteHandler: APIGatewayProxyHandler = updateNoteById

export const deleteNoteHandler: APIGatewayProxyHandler = deleteNoteById
