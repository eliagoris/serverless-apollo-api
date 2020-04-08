"use strict"

import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { getDatabaseConnection } from "./database-connector"
import Note from "./models/note"

require("dotenv").config({ path: "./variables.env" })

async function useNotes() {
  const databaseConnection = await getDatabaseConnection()
  const noteModel = Note(databaseConnection)

  return noteModel
}

export const createNote: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { noteModel } = await useNotes()
    const note = await noteModel.create(JSON.parse(event.body || ""))

    return {
      statusCode: 200,
      body: JSON.stringify(note),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the note.",
    }
  }
}

export const getOneNote: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { noteModel } = await useNotes()
    const note = await noteModel.findById(event.pathParameters?.id)

    return {
      statusCode: 200,
      body: JSON.stringify(note),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the note.",
    }
  }
}

export const getAllNotes: APIGatewayProxyHandler = async (
  event,
  context,
  callback
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { noteModel } = await useNotes()
    const notes = await noteModel.find()

    return {
      statusCode: 200,
      body: JSON.stringify(notes),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the notes.",
    }
  }
}

export const updateNote: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { noteModel } = await useNotes()
    const note = noteModel.findByIdAndUpdate(
      event.pathParameters?.id,
      JSON.parse(event.body || ""),
      {
        new: true,
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify(note),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the notes.",
    }
  }
}

export const deleteNote: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { noteModel } = await useNotes()
    const note = noteModel.findByIdAndRemove(event.pathParameters?.id)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Removed note with id: " + note._id,
        note: note,
      }),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the notes.",
    }
  }
}
