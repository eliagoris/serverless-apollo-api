import { getDatabaseConnection } from "../utils/database-connector"
import Note from "../models/note"

export async function useNotes() {
  const databaseConnection = await getDatabaseConnection()
  const noteModel = Note(databaseConnection)

  return { noteModel }
}
