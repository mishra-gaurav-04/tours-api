const User = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/asyncError');
const factory = require('../Functions/factoryFunction');


const getAllUsers = catchAsync(async(req,res,next) => {
    const users = await User.find();

    res.status(200).json({
        status : 'Success',
        data : {
            users
        }
    });
    
});

const filter = (reqBody,...options) => {
   const bodyObj = {}
   options.forEach((item) => {
        bodyObj[item] = reqBody[item];
   });
   return bodyObj;
}

const updateMe = catchAsync(async(req,res,next) => {
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('You cannot update password',400));
    }
    
    const userId = req.user.id;
    const filteredBody = filter(req.body,'name','email');
    const updatedUser = await User.findByIdAndUpdate(userId,filteredBody,{
        new : true,
        runValidators : true
    });

    res.status(200).json({
        status : 'Success',
        message : 'user updated successfully',
        data : {
            updatedUser
        }
    });
});

const getUser = (req,res) => {
    console.log('Get User');
}

const addNewUser = (req,res) => {
    console.log('Add new User');
}

const updateUser = (req,res) => {
    console.log('UpdateUser');
}

const deleteMe = catchAsync(async(req,res,next) => {
     await User.findByIdAndUpdate(req.user.id,{active : false});
    res.status(204).json({
        status : "Success",
        message : 'Deactivation successful',
        data : null
    });
});

const deleteUser = factory.deleteOne(User);

module.exports = {
    getAllUsers,
    getUser,
    addNewUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
};