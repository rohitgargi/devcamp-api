const ErrorResponse = require("../util/errorResponse");
const errorHandler = (err,req,res,next) =>{
    console.log(err.stack.red);

    let error = {...err}
    error.message = err.message;

    //Mongoose bad objectid

    if(err.name==="CastError"){
        const msg = `Resource not found`;
        error = new ErrorResponse(msg,404)
    }

    if(err.code === 11000){
        const msg = "Duplicate field value";
        error = new ErrorResponse(msg,400);

    }

    if(err.name === "ValidationError"){
        const msg = Object.values(err.errors).map(val=> val.message);
        error = new ErrorResponse(msg,400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });

}

module.exports = errorHandler;