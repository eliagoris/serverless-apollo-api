"use strict"

import { APIGatewayProxyHandler } from "aws-lambda"

require("dotenv").config({ path: "./variables.env" })

const connectToDatabase = require("./db")
const Note = require("./models/note")

export const createNote: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase().then(() => {
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

  connectToDatabase().then(() => {
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

export const getAllNotes: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase().then(() => {
    Note.find()
      .then((notes) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(notes),
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

export const updateNote: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase().then(() => {
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

  connectToDatabase().then(() => {
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
