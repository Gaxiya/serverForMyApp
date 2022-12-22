import roomService from '../service/roomService.js'
const checkRoomIdsIn = async (roomIds,check,userId)=>{
    if (!roomIds.every(e=>Object.keys(check).includes(e))) {
        roomIds.forEach(async (r)=>{
            if(!Object.keys(check).includes(r)){
                let room = await roomService.getRoom(r,userId)
                check[r]=[room]
            }})
    }
    return check
}
export default checkRoomIdsIn