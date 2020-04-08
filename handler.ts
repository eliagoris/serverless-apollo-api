"use strict"

import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { getDatabaseConnection } from "./database-connector"
import Note from "./models/note"

require("dotenv").config({ path: "./variables.env" })

export const createNote: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  getDatabaseConnection().then(() => {
    Note.create(JSON.parse(event.body || ""))
      .then((note) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(note),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not create the note.",
        })
      )
  })
}

export const getOneNote: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  getDatabaseConnection().then(() => {
    Note.findById(event.pathParameters?.id)
      .then((note) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(note),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the note.",
        })
      )
  })
}

export const getAllNotes: APIGatewayProxyHandler = async (
  event,
  context,
  callback
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const databaseConnection = await getDatabaseConnection()
    const noteModel = Note(databaseConnection)

    const notes = await noteModel.find()

    console.log("notes: ")
    console.log(notes)

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

export const updateNote: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  getDatabaseConnection().then(() => {
    Note.findByIdAndUpdate(
      event.pathParameters?.id,
      JSON.parse(event.body || ""),
      {
        new: true,
      }
    )
      .then((note) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(note),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the notes.",
        })
      )
  })
}

export const deleteNote: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  getDatabaseConnection().then(() => {
    Note.findByIdAndRemove(event.pathParameters?.id)
      .then((note) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: "Removed note with id: " + note._id,
            note: note,
          }),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the notes.",
        })
      )
  })
}
