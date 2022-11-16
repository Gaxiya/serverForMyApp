import  userService from'../service/userService.js'
import  {validationResult} from'express-validator'



export const loginUser = async(req,res)=>{


  try {
    const errors = validationResult(req)
    if(!errors.isEmpty){
      return res.status(400).json({message:'error on registration',errors})
    }
    const {email,password}=req.body
    
    const result=await userService.login(email,password)
    res.cookie('refreshToken',result.refreshToken,{maxAge:60*24*60*60*1000,httpOnly:true})
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(200).json(result)
  } catch (error) {
    console.log(error);
    res.status(400).json({message:'login error'})
  }

}
export const  addUser = async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty){
      return res.status(400).json({message:'error on registration',errors})
    }
    const {name,email,password} =req.body
    console.log(name,email,password);
    const result=await userService.registration(name,email,password)
    res.cookie('refreshToken',result.refreshToken,{maxAge:60*24*60*60*1000,httpOnly:true})
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    res.status(200).json(result)
    
}
export const activate = async(req,res,next)=>{
 try {
  const activacitionLink = req.params.link
  await userService.activation(activacitionLink)
  return res.redirect(process.env.CLIENT_URL)
 } catch (error) {
  next(e)
 }
}
export const logout = async(req,res,next)=>{
  try {
    const {refreshToken} = req.cookies
    const token = await userService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.send(token)
  } catch (error) {
  next(e)
  }
 }
export const refresh = async(req,res,next)=>{
  try {
      
    const {refreshToken}= req.cookies
    const result=await userService.refresh(refreshToken)
    
    res.cookie('refreshToken',result.refreshToken,{maxAge:60*24*60*60*1000,httpOnly:true})
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}




