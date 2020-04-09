import { Schema, Model } from "mongoose"

const UserSchema = new Schema({
  issuer: String,
  email: String,
  username: String,
  name: String,
  lastLoginAt: Number,
})

const User = (databaseConnection): Model<any> => {
  return databaseConnection.model("User", UserSchema)
}

export default User
