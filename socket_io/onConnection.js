import  userHandlers from'./handlers/user.handler.js'
import messageHandlers from'./handlers/message.handler.js'
import roomService from '../service/roomService.js'

export default async function onConnection(io, socket) {
const userId = socket.handshake.auth

const rooms = await roomService.getAllRooms(userId.userId)

const { userName } = socket.handshake.query

if(rooms!==null){
    socket.roomIds = rooms.map(r=>r.roomId)
    socket.userName = userName
    socket.join(rooms.map(r=>r.roomId))
    console.log(socket.rooms);
    userHandlers(io, socket)
    messageHandlers(io, socket)
}

}