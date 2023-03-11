const Review  = require('../models/Reviews');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/asyncError');

const getAllReview = catchAsync(async(req,res,next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status : 'Success',
        results : reviews.length,
        data : {
            reviews
        }
    });
});

const createNewReview = catchAsync(async(req,res,next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status : 'Success',
        message : 'Review created successfully',
        data : {
            newReview
        }
    });
});

module.exports = {
    getAllReview,
    createNewReview
}