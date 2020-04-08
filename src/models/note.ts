import { Schema } from "mongoose"

const NoteSchema = new Schema({
  title: String,
  description: String,
})

const Note = (databaseConnection) => {
  return databaseConnection.model("Note", NoteSchema)
}

export default Note
