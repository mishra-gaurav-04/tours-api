const User = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/asyncError');
const factory = require('../Functions/factoryFunction');

const filter = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

exports.getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async(req,res,next) => {
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

exports.deleteMe = catchAsync(async(req,res,next) => {
     await User.findByIdAndUpdate(req.user.id,{active : false});
    res.status(204).json({
        status : "Success",
        message : 'Deactivation successful',
        data : null
    });
});

exports.createUser = (req,res) => {
    res.status(500).json({
        status : 'error',
        message : 'This route is not defined'
    });
};


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);