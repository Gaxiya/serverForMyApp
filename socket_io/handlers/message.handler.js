import  Message from '../../models/message.js'
import { removeFile } from'../../service/fileService.js'
import onError from'../../exseptions/onError.js'
import roomService from '../../service/roomService.js'

const messages = {}
const RoomsUnreadenMessages = {}
export default function messageHandlers(io, socket) {
// const { roomId } = socket

const updateMessageList = (roomId) => {
    io.to(roomId).emit('message_list:update', messages[roomId],roomId)
}
const updateUnreadenMessages = (roomId)=>{
    io.to(roomId).emit('unreadenMessages:update',RoomsUnreadenMessages[roomId],roomId)
}
socket.on('message:getAll',async(roomIds)=>{
    try {
        for await (const roomId of roomIds) {
            const _messages = await Message.find({ roomId:roomId }).sort({ createdAt: -1 })
            const room = await roomService.getRoom(roomId)
            RoomsUnreadenMessages[roomId]={}
            room.users.forEach(e => {
                RoomsUnreadenMessages[roomId][e.userId]= e.unreadenMessages
            });
            messages[roomId] = _messages
            updateMessageList(roomId)
        }
    } catch (e) {
        onError(e)
    }
})
socket.on('message:get', async (roomId) => {
    try {
    const _messages = await Message.find({ roomId:roomId }).sort({ createdAt: -1 })
    messages[roomId] = _messages
    updateMessageList(roomId)
    } catch (e) {
    onError(e)
    }
})
socket.on('message:read',async (roomId,userId)=>{
    try {
        RoomsUnreadenMessages[roomId] = await roomService.readMessage(roomId,userId,RoomsUnreadenMessages[roomId])
        updateUnreadenMessages(roomId)
    } catch (error) {
        onError(e)
    }
})
socket.on('message:add',async (message,roomId) => {
    Message.create(message).catch(onError)
    message.createdAt = Date.now()
    messages[roomId].unshift(message)
    RoomsUnreadenMessages[roomId] = await roomService.addUnreadenMessage(roomId,message.messageId,message.userId,RoomsUnreadenMessages[roomId])
    updateMessageList(roomId)
    updateUnreadenMessages(roomId)
})
socket.on('message:edit', async (message,roomId)=>{
    const{messageId,text} = message
    const message=await Message.findOneAndUpdate({messageId:messageId},
        {textOrPathToFile:text},
        {new:true})
    const index = messages[roomId].findIndex(m=>`${m.messageId}`===`${messageId}`)
    messages[roomId][index]=message
    updateMessageList(roomId)
})

socket.on('message:remove', (message,roomId) => {
    const { messageId, messageType, textOrPathToFile } = message

    Message.deleteOne({ messageId })
    .then(() => {
        if (messageType !== 'text') {
        removeFile(textOrPathToFile)
        }
    })
    .catch(onError)

    messages[roomId] = messages[roomId].filter((m) => m.messageId !== messageId)

    updateMessageList(roomId)
})
socket.on('dialogs:leave',async ({roomId,deletedRoom})=>{
    socket.leave(roomId)
    if(deletedRoom){
        delete messages[roomId]
        delete RoomsUnreadenMessages[roomId]
        return;
    }
    delete RoomsUnreadenMessages[roomId][socket.userId]
    updateUnreadenMessages(roomId)
})

}

