class ApiError extends Error {
    status;
    errors;
    constructor(status,message,errors= []){
        super(message)
        this.errors=errors
        this.status=status
    }

    static UnauthorizedError () {
        return new ApiError(401,'User is unauthorized')
    }
    static BadRequest(message,errors=[] ){
        return new ApiError (400,message,errors)
    }
}
export default ApiError