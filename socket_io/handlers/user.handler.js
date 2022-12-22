import roomService from "../../service/roomService.js"


const users = {}

export default async function userHandlers (io, socket) {
  const { roomIds,userId } = socket
  if (!roomIds.every(e=>Object.keys(users).includes(e))) {
    roomIds.forEach(async (r)=>{
        if(!Object.keys(users).includes(r)){
            let room = await roomService.getRoom(r,userId)
            users[r]=[room]
        }})
}

  const updateUserList = async (roomId,deleted,leave=false) => {
    if(deleted){
      io.to(roomId).emit('user_list:update',{
        users:null,
        deleted:deleted,
        roomId:roomId,
        leave:leave})
      return;
    }
    io.to(roomId).emit('user_list:update',{users:users[roomId],
      deleted:false,roomId:roomId,leave:leave})
  }

  socket.on('user:add', async (user,roomId) => {
    users[roomId] = await roomService.addUsersToRoom(roomId,user.followed.map((u)=>u.profileId),[socket.id])
    updateUserList(roomId)
  })

  socket.on('user:leave',async (roomId)=>{
    const leavingRoom = await roomService(roomId,userId)
    if(!leavingRoom){
      updateUserList(roomId,true,true)
      delete users[roomId]
      return;
    }
      users[roomId]=[leavingRoom]
      updateUserList(roomId,false,true)
  })
  socket.on('disconnect', async () => {
    let roomsDisc = await roomService.disconnet(userId)
    socket.disconnect(true)
    for (const room of roomsDisc) {
      if(!users[room.roomId]) continue;
      users[room.roomId]=[room]
      updateUserList(room.roomId)
    }
  })


}
