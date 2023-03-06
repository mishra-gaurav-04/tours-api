const User = require('../models/Users');
const catchAsync = require('../utils/asyncError');

exports.signup = catchAsync(async(req,res,next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status : 'Success',
        message : 'User created successfully',
        data : {
           user : newUser
        }
    })
});