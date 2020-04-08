"use strict"

import { APIGatewayProxyHandler } from "aws-lambda"
import { config } from "dotenv"

import {
  createNote,
  getNoteById,
  getAllNotes,
  updateNoteById,
  deleteNoteById,
} from "./src/controllers/note.controller"

config({ path: "./variables.env" })

export const createNoteHandler: APIGatewayProxyHandler = createNote

export const getOneNoteHandler: APIGatewayProxyHandler = getNoteById

export const getAllNotesHandler: APIGatewayProxyHandler = getAllNotes

export const updateNoteHandler: APIGatewayProxyHandler = updateNoteById

export const deleteNoteHandler: APIGatewayProxyHandler = deleteNoteById
