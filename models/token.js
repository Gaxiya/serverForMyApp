import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  refreshToken: {
    type: String,
    required: true}
  })

const Token = mongoose.model('Token', tokenSchema);
export default Token;
