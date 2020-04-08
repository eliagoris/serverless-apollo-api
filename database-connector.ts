import { Mongoose } from "mongoose"

const mongoose = new Mongoose()
mongoose.Promise = global.Promise

let databaseConnection: Mongoose

export const getDatabaseConnection = async () => {
  if (databaseConnection) {
    console.log("=> using existing database connection")
    return databaseConnection
  }

  const {
    env: { DATABASE_ENDPOINT },
  } = process

  if (!DATABASE_ENDPOINT) {
    console.error("No database endpoint was found")
    return Promise.reject()
  }

  console.log("=> using new database connection")

  const database = await mongoose.connect(DATABASE_ENDPOINT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  databaseConnection = database

  return databaseConnection
}
