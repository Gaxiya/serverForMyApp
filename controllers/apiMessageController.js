import tokenService  from'../service/tokenService.js'
import roomService from '../service/roomService.js';
import { validationResult } from 'express-validator';
import Room_dto from './../dtos/room_dto.js';

export const handleError = (res, error) => {
    console.log(error);
    res.send( "error").status(500);
  }
export const createOrGetRoom=async (req,res)=>{
    try {
        const {roomId}= req.body
        const {refreshToken}= req.cookies
        const tokenData= await tokenService.findToken(refreshToken)
        let room = await roomService.getRoom(roomId)
        if(!room){
            room = await roomService.createRoom(refreshToken)
            res.send(room)
        }
        else{
            const room_dto= new Room_dto(room,tokenData.userId)
            res.send(room_dto)
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
export const renameRoom = async (req,res) =>{
    try {
        const errors = validationResult(req)
        if(errors.errors.length>0){
        return res.status(400).json({message:'error on rename',errors})
        }
        const {refreshToken}= req.cookies
        const tokenData= await tokenService.findToken(refreshToken)
        const {roomId,roomName}= req.body
        const room = await roomService.setRoomName(roomId,roomName,tokenData)
        res.send(room)
    } catch (error) {
        console.log(error);
        res.send( "error").status(500);
    }
}


export const deleteRoom = async (req,res)=>{}