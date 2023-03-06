const globalErrorHandler = (error,req,res,next) => {
    error.satusCode = error.satusCode || 500;
    error.status = error.status || 'Internal Server Error';
    res.status(error.satusCode).json({
        status : error.status,
        message : error.message,
    });
};

module.exports = globalErrorHandler;