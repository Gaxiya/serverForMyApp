import jwt   from'jsonwebtoken'
import Token from'../models/token.js'
import toId  from'../helpers/toId.js'

class TokenService{
    generateToken(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'48h'})
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'60d'})
        return {
            accessToken,
            refreshToken
        }
        
    } 

    validateAcessToken(token){
        try {
            
            const userData =  jwt.verify(token,process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }

    validateRefreshToken(token){
        try {
            const userData =  jwt.verify(token,process.env.JWT_REFRESH_SECRET)
            
            return userData
        } catch (error) {
            return null
        }
    }


    async saveToken(userId,refreshToken){
        const tokenData= await Token.findOne({userId:toId(userId)})
        if (tokenData){
            tokenData.refreshToken= refreshToken
            return tokenData.save()
        }
        const token = new Token({userId:toId(userId),refreshToken:refreshToken})
        
        return token.save()
        
    }
    async removeToken(refreshToken){
        const tokenData = await Token.findOneAndDelete({refreshToken:refreshToken})
        return tokenData
    }
    
    async findToken(refreshToken){
  
        const tokenData = await Token.findOne({refreshToken:refreshToken})
        return tokenData
    }
}
export default new TokenService()