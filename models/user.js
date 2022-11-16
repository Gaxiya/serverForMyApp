import mongoose from 'mongoose'
const Schema=mongoose.Schema;
const userSchema = new Schema(
    {
        name: {
                type: String,
                required: true,
        },
        role:{
                type:String,
                default:'User'},
        isActivated:{
                type:Boolean,
                default:false},
        activationLink:{
                type:String
        }
        
    }
)
const User=mongoose.model('User',userSchema);
export default User

