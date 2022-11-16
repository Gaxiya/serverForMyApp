import roomService from "./service/roomService.js"
import toId from './helpers/toId.js';
import { Room } from './models/room.js';



export const reqTodb=async ()=>{
    const id= toId('62aa2d91a201d827643e2528')
    let Rooms=await roomService.getAllRooms(id)

    for await (const room of Rooms) {
        room.users.forEach(async e => {
            e.unreadenMessages={
                haveUnreaden:false,
                unreadenIds:[]}
        })
        let roome = await Room.findOne({roomId:room.roomId})
        roome=room
        roome.save()
    }
}


