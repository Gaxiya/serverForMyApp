export default class UserDto{
    id;
    isActivated;

    role
    constructor(model){
        this.id= model._id
        this.isActivated=model.isActivated
        this.role=model.role
    }
    
} 