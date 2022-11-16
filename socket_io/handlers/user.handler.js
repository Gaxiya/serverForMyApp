import roomService from "../../service/roomService.js"

const users = {}

export default async function userHandlers (io, socket) {
  const { roomIds, userName } = socket
  if (!roomIds.every(e=>Object.keys(users).includes(e))) {
    roomIds.forEach(async (r)=>{
  if(!Object.keys(users).includes(r)){
    let room = await roomService.getRoom(r)
    users[r]=[room]
  }
})
  }
  

  const updateUserList = async (roomId) => {
    io.to(roomId).emit('user_list:update',users[roomId])
  }

  socket.on('user:add', async (user,roomId) => {
    socket.to(roomId).emit('log', `User ${userName} connected`)
    users[roomId] = await roomService.addUsersToRoom(roomId,user.followed.map((u)=>u.profileId),[socket.id])
    updateUserList(roomId)
  })

  socket.on('disconnect', async(roomId) => {
    if (!users[roomId]) return

    socket.to(roomId).emit('log', `User ${userName} disconnected`)
    let roomDisc = await roomService.disconnet(roomId,userName)
    users[roomId] = [roomDisc]

    updateUserList(roomId)
  })
}
