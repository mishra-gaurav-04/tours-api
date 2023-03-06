const User = require('../models/Users');
const catchAsync = require('../utils/asyncError');

exports.signup = catchAsync(async(req,res,next) => {
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });
    res.status(201).json({
        status : 'Success',
        message : 'User created successfully',
        data : {
           user : newUser
        }
    })
});