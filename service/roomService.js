import { Room, UnreadenId } from "../models/room.js"
import toId from './../helpers/toId.js';
import { v4 } from "uuid";
import { UserRoom } from './../models/room.js';
import User from './../models/user.js';
import tokenService from "./tokenService.js";
import Room_dto from './../dtos/room_dto.js';
import Message from "../models/message.js";
import { removeFile } from "./fileService.js";
class RoomService{
    async getAllRooms(userId){
        try {
            const rooms = await Room.find({'users.userId':`${toId(userId)}`}).populate('users')
            const room_dto= rooms.map(r=>new Room_dto(r,userId))
            return room_dto
        } catch (error) {
            console.log(error);
            return null
        }
    }
    async getRoom(roomId,userId){
        try {
            const room = await Room.findOne({roomId:roomId})
            if(userId){
                return new Room_dto(room,userId)
            }
        return room
        } catch (error) {
            return 0 
        }
        
    }
    async createRoom(refreshToken,socketId){
        const roomId= v4()
        const tokenData= await tokenService.findToken(refreshToken)
        const user= await User.findOne({_id:toId(tokenData.userId)})
        const userFollowing= new UserRoom({userName:user.name,userId:user._id,socketId:socketId?socketId:''})
        let room = new Room({roomId:roomId,roomName:userFollowing.userName})
        room.users.push(userFollowing)
        room.save()
        const room_dto= new Room_dto(room,tokenData.userId)
        return room_dto
    }
    async addUsersToRoom(roomId,followed,followedSocketIds){
        if(!roomId&!followed){return null}
        followed.forEach((user)=>{toId(user)})
        let room = await Room.findOne({roomId:roomId})
        const users=await User.find({ '_id': { $in: followed } })
        const userFollowed= users.flatMap((user,index)=>  new UserRoom({userName:user.name,userId:user._id}))
        room.users.push(...userFollowed)
        room.roomName+=','+users.map((user)=>user.name).join()
        room.save()
        const room_dto= new Room_dto(room,tokenData.userId)
        return room_dto
    }
    async deleteRoom(){}
    async disconnet(userId){
        const rooms = await Room.find({'users.userId':`${toId(userId)}`}).populate('users')
        rooms.forEach((r)=>{
            const index =r.users.findIndex((user)=>user.userId==`${userId}`)
            r.users[index].socketId=''
            r.users[index].isOnline={
                active:false,
                lastActive:new Date()
            }
        })
        rooms.save()
        return rooms
    }
    async addUnreadenMessage(roomId,messageId,senderId,unreadenMessages){
        try {
            const room = await Room.findOne({roomId:roomId})
            const unreadenId= new UnreadenId({id:messageId})
            room.users.forEach(e => {
                if(`${e.userId}`!=`${senderId}`){
                    e.unreadenMessages.haveUnreaden=true
                    e.unreadenMessages.unreadenIds.push(unreadenId)
                }
                unreadenMessages[e.userId]=e.unreadenMessages
            });
            room.save()
            
            return unreadenMessages
        } catch (error) {
            console.log(error);
            return null
        }
        }
    async readMessage(roomId,userId,unreadenMessages){
        try {
            const room = await Room.findOne({roomId:roomId})
            room.users.find(e=>{
                if(e.userId==userId){
                    e.unreadenMessages.haveUnreaden=false
                    e.unreadenMessages.unreadenIds=[]
                    unreadenMessages[e.userId]=e.unreadenMessages
                }
                
            })
            room.save()
            return unreadenMessages
        } catch (error) {
            console.log(error);
            return null
        }
    }
    async setRoomName(roomId,roomName,tokenData){
        try {
            const room = await Room.findOne({roomId:roomId})
            room.roomName = roomName
            room.save()
            return new Room_dto(room,tokenData.userId)
        } catch (error) {
            
        }
    }
    async leaveTheRoom (roomId,userId){
        try {
            const room = await Room.findOne({roomId:roomId})
            room.users=room.users.filter((user)=>`${user.userId}`!=`${userId}`)
            if(room.users.length==0){
                await Message.deleteMany({ roomId:roomId })
                removeFile(`/${roomId}`)
                return null
            }
            room.save()
            return new Room_dto(room,tokenData.userId)
        } catch (error) {
            
        }
    }
}
export default new RoomService()
