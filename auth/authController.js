const User = require('../models/Users');
const catchAsync = require('../utils/asyncError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const {promisify} = require('util');
const {sendEmail} = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({id : id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
       });
};

const createSendToken = (user,statusCode,res) => {
    try
    {
        const token = signToken(user._id);
        const cookiesOptions = {
            expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
            httpOnly : true
        };
        if(process.env.NODE_ENV === 'production'){
            cookiesOptions.secure = true;
        }
        res.cookie('jwt',token,cookiesOptions);
        user.password = undefined;

        res.status(statusCode).json({
            status : 'Success',
            token ,
            data : {
                user
            }
        });
    }
    catch(err){
        console.log(err);
    }
};

exports.signup = catchAsync(async(req,res,next) => {
    // const newUser = await User.create({
    //     name : req.body.name,
    //     email : req.body.email,
    //     password : req.body.password,
    //     passwordConfirm : req.body.passwordConfirm
    // });
    const newUser  = await User.create(req.body);
    createSendToken(newUser,201,res);
});

exports.login = async(req,res,next) => {
    const {email,password} = req.body;

    if(!email || !password){
        return next(new AppError('Please provide email and password',400));
    }

    const user = await User.findOne({email}).select('+password');
    // const correct = await user.correctPassword(password,user.password);

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Invalid email or password',401));
    }
    createSendToken(user,200,res);
};

exports.protect = catchAsync(async(req,res,next) => {
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('Access Denied ! Log in again',401));
    }

    const decodedPayload = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    const freshUser = await User.findById(decodedPayload.id);
    if(!freshUser){
        return next(new AppError('User not found',401));
    }
    if (await freshUser.checkPasswordChange(decodedPayload.iat)){
        return next(new AppError('User has changed password',401));
    }
    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req,res,next) => {

        if(!roles.includes(req.user.role)){
            return next(new AppError('Access Denied',403));
        }
        next();
    }
};

exports.forgotPassword = catchAsync(async(req,res,next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new AppError('Invalid email id',404));
    }
    const resetToken = user.generateResetToken();
    await user.save({validateBeforeSave : false});
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
    const message = `Click on the link to reset the password \n ${resetUrl}`;
    try{
        await sendEmail({
            email : user.email,
            subject : 'Reset Password',
            message : message
        });
    
        res.status(200).json({
            status : 'Success',
            message : 'Token sent successfully'
        });
    }
    catch(err){
        user.passwordResetToken = undefined,
        user.passwordResetTokenExpiresIn = undefined
        await user.save({validateBeforeSave : false});
        return next(new AppError('There was an error in sending email.Try again later',500));
    }

});
exports.resetPassword = catchAsync(async(req,res,next) => {
    const resetToken = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({passwordResetToken : hashedToken,passwordResetTokenExpiresIn : {$gt : Date.now()}});
    if(!user){
        return next(new AppError('Invalid token',400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save();
    createSendToken(user,200,res);
});
exports.updatePassword = catchAsync(async(req,res,next) => {
    const user = await User.findById(req.user.id).select('+password');
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
        return next(new AppError('Incorrect Password',401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user,200,res);
});