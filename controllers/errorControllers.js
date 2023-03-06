const sendErrorDev = (err,res) => {
    res.status(err.statusCode).json({
        status : 'Fail',
        message : err.message,
        error : err,
        stack : err.stack
    });
}

const sendErrorProd = (err,res) => {
    if(err.isOperational){
        res.status(err.satusCode).json({
            status : 'Fail',
            message : err.message
        })
    }
    else{
        // 1) Logging error to console
        console.error('ERROR',err);
        res.status(500).json({
            status : 'error',
            message : 'Internal Server Error'
        })
    }
}

const globalErrorHandler = (err,req,res,next) => {
    err.satusCode = err.satusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }
    else if(process.env.NODE_ENV === 'production'){
        sendErrorProd(err,res);
    }
};

module.exports = globalErrorHandler;