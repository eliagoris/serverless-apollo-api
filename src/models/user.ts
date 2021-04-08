import { Schema, Model } from "mongoose"

const CharacterSchema = new Schema({
  name: String,
  lookType: String,
  position: { x: Number, y: Number },
})

const UserSchema = new Schema({
  issuer: String,
  email: String,
  username: String,
  name: String,
  lastLoginAt: Number,
  characters: [CharacterSchema],
})

const User = (databaseConnection): Model<any> => {
  return databaseConnection.model("User", UserSchema)
}

export default User
