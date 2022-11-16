import mongoose from 'mongoose'
const Schema=mongoose.Schema;
const loginData = new Schema(
    {       userId:{type:mongoose.Types.ObjectId,ref:'User'},
            email:{type:String, required: true},
            password:{type:String, required: true}
    }
)
const LoginData=mongoose.model('LoginData',loginData);
export default LoginData