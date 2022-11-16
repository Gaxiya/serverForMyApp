import toId  from'../helpers/toId.js'
import tokenService  from'../service/tokenService.js'
import roomService from '../service/roomService.js';

export const handleError = (res, error) => {
    console.log(error);
    res.send( "error").status(500);
  }
export const createOrGetRoom=async (req,res)=>{
    try {
        const {roomId}= req.body
        const {refreshToken}= req.cookies
        let room = await roomService.getRoom(roomId)
        if(!room){
            room = await roomService.createRoom(refreshToken)
            res.send(room)
        }
    } catch (error) {
        console.log(error);
        res.send( "error").status(500);
    }
}
export const getAllRooms= async (req,res)=>{
    try {
        const {refreshToken}= req.cookies
        const tokenData= await tokenService.findToken(refreshToken)
        const rooms =await roomService.getAllRooms(tokenData.userId)
        res.send(rooms)
    } catch (error) {
        console.log(error);
        res.send( "error").status(500);
    }
}
export const addUsersToRoom=async (req,res)=>{
    try {
        const {roomId,users}= req.body
        const room = await roomService.addUsersToRoom(roomId,users)
        res.send(room)
        
    } catch (error) {
        console.log(error);
        res.send( "error").status(500);
    }
}



export const deleteRoom = async (req,res)=>{}