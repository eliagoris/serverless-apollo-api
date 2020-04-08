const mongoose = require("mongoose")
mongoose.Promise = global.Promise

let isConnected

module.exports = connectToDatabase = () => {
  if (isConnected) {
    console.log("=> using existing database connection")
    return Promise.resolve()
  }

  const {
    env: { DATABASE_ENDPOINT },
  } = process

  console.log("=> using new database connection")
  return mongoose
    .connect(DATABASE_ENDPOINT, {
      useNewUrlParser: true,
    })
    .then((db) => {
      isConnected = db.connections[0].readyState
    })
}
