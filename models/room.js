import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const unreadenId=new Schema({
    id:{
        type:String,
        required:true,
        ref:'Message'
    }
})
const userRoom = new Schema({
    userName:{
    type: String,
    required:true
    },
    userId:{
    type:mongoose.Types.ObjectId,
    required:true
    ,ref:'User'
    },
    socketId:{
        type: String},
    isOnline:{
        active:{type:Boolean},
        lastActive:{type:Date}
    },
    unreadenMessages:{
        haveUnreaden:{type:Boolean},
        unreadenIds:[unreadenId]
    }
    
})
const roomSchema = new Schema({
roomId: {
    type:String,
    required:true
},
roomName:{
    type:String
},
// messages:[messagesLinks],
users: [userRoom]
})
// export const MessagesLinks = mongoose.model('MessagesLinks',messagesLinks)
export const UnreadenId= mongoose.model('UnreadenId',unreadenId)
export const UserRoom = mongoose.model('UserRoom',userRoom)
export const Room = mongoose.model('Room', roomSchema);
