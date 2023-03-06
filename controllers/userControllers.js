const User = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/asyncError');



const getAllUsers = catchAsync(async(req,res,next) => {
    const users = await User.find();

    res.status(200).json({
        status : 'Success',
        data : {
            users
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

const deleteUser = (req,res) => {
    console.log('Delete User');
}

module.exports = {
    getAllUsers,
    getUser,
    addNewUser,
    updateUser,
    deleteUser
};