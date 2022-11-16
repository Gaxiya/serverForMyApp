export default class ProfileDto{
    id;
    name;
    status;
    followed;
    dateOfBirth;
    education;
    work;
    location;
    constructor(model){
        this.id= model.link
        this.name=model.name
        this.status=model.status
        this.followed=model.followed
        this.dateOfBirth=model.dateOfBirth
        this.education=model.education
        this.work=model.work
        this.location=model.location
    }
    
} 