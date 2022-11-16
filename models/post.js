import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const postSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  link: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref:'User'
  },
  author: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
