export default class Room_dto{
    roomId;
    roomName;
    users;
    unreadenMessages;

    constructor(model,userId){
        this.roomId= model.roomId
        this.roomName=model.roomName
        this.users=model.users.map(u=>{
        const {_id,unreadenMessages,...nu}=u.toObject()
        return nu})
        this.unreadenMessages=model.users.find(user=>{
            if(`${user.userId}`===`${userId}`)
            return user
        }).unreadenMessages
    }
    
} 