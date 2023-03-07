const User = require('../models/Users');
const catchAsync = require('../utils/asyncError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const {promisify} = require('util');

const signToken = (id) => {
    return jwt.sign({id : id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
       });
};

exports.signup = catchAsync(async(req,res,next) => {
    // const newUser = await User.create({
    //     name : req.body.name,
    //     email : req.body.email,
    //     password : req.body.password,
    //     passwordConfirm : req.body.passwordConfirm
    // });
    const newUser  = await User.create(req.body);
   const token = signToken(newUser._id);
    res.status(201).json({
        status : 'Success',
        message : 'User created successfully',
        token,
        data : {
           user : newUser
        }
    })
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
    const token = signToken(user._id);
    
    res.status(200).json({
        status : 'Success',
        token
    });
};

exports.protect = catchAsync(async(req,res,next) => {
    // 1 => getting token and check if it's there
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('Access Denied ! Log in again',401));
    }
    // 2 => verify token
    const decodedPayload = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    // 3 => check if user still exist
    const freshUser = await User.findById(decodedPayload.id);
    if(!freshUser){
        return next(new AppError('User not found',401));
    }
    // 4 => check if user changed password aftereyJ token was issued
    if (freshUser.checkPasswordChange(decodedPayload.iat)){
        return next(new AppError('User has changed password',401));
    }
    next();
});