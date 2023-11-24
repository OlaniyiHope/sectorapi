import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    sectors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sector" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
