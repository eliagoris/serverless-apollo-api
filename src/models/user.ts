import { Schema } from "mongoose"

const UserSchema = new Schema({
  issuer: String,
  email: String,
  username: String,
  name: String,
})

const User = (databaseConnection) => {
  return databaseConnection.model("User", UserSchema)
}

export default User
