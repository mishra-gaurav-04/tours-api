const AppError = require('../utils/appError');

const sendErrorDev = (err,res) => {
    res.status(err.statusCode).json({
        status : err.status,
        message : err.message,
        error : err,
        stack : err.stack
    });
}

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
  };
  const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
  
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
  };
  const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
const handleJWTError = err =>{
    return new AppError('Invalid token ! login again',401);
}
const handleTokenExpirationError = err =>{
    return new AppError('Token Expired login again',401);
}
const sendErrorProd = (err,res) => {
    if(err.isOperational === true){
        res.status(err.statusCode).json({
            status : 'Fail',
            message : err.message
        })
    }
    else{
        console.log('Error handler',err);
        res.status(500).json({
            status : 'error',
            message : 'Internal Server Error'
        })
    }
}

const globalErrorHandler = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
    
        if (error.name === 'CastError'){
            error = handleCastErrorDB(error);
        }
        if (error.code === 11000){
            error = handleDuplicateFieldsDB(error);
        }
        if (error.name === 'ValidationError'){
            error = handleValidationErrorDB(error);
        }
        if(error.name === "JsonWebTokenError"){
            error = handleJWTError(error);
        }
        if(error.name === 'TokenExpiredError'){
            error = handleTokenExpirationError(error);
        }
    
        sendErrorProd(error, res);
    }
};

module.exports = globalErrorHandler;