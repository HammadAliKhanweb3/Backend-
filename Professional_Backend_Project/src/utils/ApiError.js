class ApiError extends Error {
constructor(
    statusCode,
    message="Something Went Wrong",
    errors=[],
    stack=""
){
    super(message)
    this.stautsCode=statusCode,
    this.message = message,
    this.errors= errors,
    this.stack=stack
    this.data= null,
    this.success=false

    if (stack) {
        this.stack =stack
    }
    else{
        Error.captureStackTrace(this,this.constructor)
    }
}
}
export {ApiError}