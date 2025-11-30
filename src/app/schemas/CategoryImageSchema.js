import mongoose from 'mongoose';

const categoryImageSchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
      unique: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    imageBuffer: {
      type: Buffer,
      required: false,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CategoryImage', categoryImageSchema);
