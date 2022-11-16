import User   from '../models/user.js';
import LoginData from '../models/loginData.js';
import bcrypt from 'bcryptjs'
import toId  from '../helpers/toId.js';
import {v4}  from 'uuid' 
import tokenService  from './tokenService.js'
import UserDto  from '../dtos/user_dto.js';
import MailService  from './mailService.js';
import ApiError  from '../exseptions/apiError.js';
import { Profile } from '../models/profile.js';





class UserService{
//
    async login (email,password){
    try {
    
    const login =await LoginData.findOne({email:email})
    if(!login){
    throw ApiError.BadRequest('login or password are incorrect ')
    }
    
    const validPassword = await bcrypt.compare(password,login.password)
    if (!validPassword){
        throw ApiError.BadRequest('login or password are incorrect ')
    }
    

    const user= await User.findOne({_id:toId(login.userId)})
    const userDto = new UserDto(user)

    const tokens = tokenService.generateToken({...userDto})
    
    await tokenService.saveToken(userDto.id,tokens.refreshToken)
    return {
        ...tokens, user: userDto
    }
//
    } catch (error) {
    
        throw ApiError.BadRequest('login or password are incorrect ')
    }

  }

//
  async registration(name,email,password){
    try {
      //validation data of new user
    const candidate =await LoginData.findOne({email:email})
    if(candidate){
        
        throw ApiError.BadRequest('login or password are incorrect ')
    }
    const hashedPassword = await bcrypt.hash(password,6)
    
    const activationLink= v4()
    //creating new user
    const user=  new User({name:name,activationLink:activationLink})
    const profile = new Profile({name:name,link:user._id})
    profile.save()
    const userDto = new UserDto(user)
    
    try {

        await MailService.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`)
    } catch (error) {
        throw new Error('mail ervice is unavailible');
    }
    
    // creating LoginData of new user
    const loginData=new LoginData({email:email,password:hashedPassword,userId:toId( (await user.save())._id)})
    
    loginData.save()

    //creating jwt token
    
    const tokens = tokenService.generateToken({...userDto})
    
    await tokenService.saveToken(userDto.id,tokens.refreshToken)
    return {
        ...tokens, user: userDto
    }
    } catch (error) {
      
        throw ApiError.BadRequest('login or password are incorrect ')
    }
  
//
  }
  async activation (activationLink){
    try {
        const user= await User.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('login or password are incorrect ')
        }
        user.isActivated= true
        user.save()
    } catch (error) {
        throw new Error(error)
    }
   
  }
//
async logout(refreshToken){
try {
    const token = await tokenService.removeToken(refreshToken)
    return token
} catch (error) {
    throw new Error(error)
}
}
async refresh(refreshToken){
    if(!refreshToken){
        throw new ApiError.UnauthorizedError()
        }
        const userData =  tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData||!tokenFromDb){
            throw new ApiError.UnauthorizedError()
        }
    const user = await User.findById(toId(userData.id))
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    
    await tokenService.saveToken(userDto.id,tokens.refreshToken)
    return {
        ...tokens, user: userDto
    }
    
}

}

export default new UserService();


