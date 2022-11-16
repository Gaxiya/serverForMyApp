import mongoose from 'mongoose'
const Schema= mongoose.Schema
const messageSchema= new Schema({
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    messageType: {
        type: String,
        required: true
    },
    textOrPathToFile: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})
const Message=mongoose.model('Message',messageSchema);
export default Message