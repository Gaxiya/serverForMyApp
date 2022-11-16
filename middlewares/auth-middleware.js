import ApiError  from"../exseptions/apiError.js";
import tokenService  from"../service/tokenService.js";

export default function authMiddleware (req,res,next) {
    try {
        
        const authorization = req.headers.authorization
        if(!authorization){
            
            return next(ApiError.UnauthorizedError())
        }
        const acessToken= authorization.split(' ')[1]
        if(!acessToken){
            
            return next(ApiError.UnauthorizedError())
        }
        const userData = tokenService.validateAcessToken(acessToken)
        
        if(!userData){
            
            return next(ApiError.UnauthorizedError())
        }
        req.user= userData
        next()
    } catch (error) {
        return next(ApiError.UnauthorizedError())
    }
  }