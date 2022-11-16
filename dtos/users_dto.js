export default class UsersDto{
    link;
    name;
    status;
    location;
    constructor(model){
        this.link= model.link
        this.name=model.name
        this.status=model.status
        this.location=model.location
    }
    
} 