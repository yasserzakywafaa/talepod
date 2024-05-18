import mongoose from "mongoose";

const audioFileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AudioFile = mongoose.model("AudioFile", audioFileSchema);

export default AudioFile;
