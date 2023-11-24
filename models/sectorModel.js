import mongoose from "mongoose";

const sectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Sector", sectorSchema);
