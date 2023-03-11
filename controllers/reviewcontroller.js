const Review  = require('../models/Reviews');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/asyncError');
const factory = require('../Functions/factoryFunction');

const getAllReview = catchAsync(async(req,res,next) => {
    let filter = {}
    if(req.params.tourId){
        fiter = {
            tour : req.params.tourId,
        }
    }
    const reviews = await Review.find(filter);
    res.status(200).json({
        status : 'Success',
        results : reviews.length,
        data : {
            reviews
        }
    });
});

const createNewReview = catchAsync(async(req,res,next) => {
    if(!req.body.tour){
        req.body.tour = req.params.tourId;
    }
    if(!req.body.user){
        req.body.user = req.user.id;
    }
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status : 'Success',
        message : 'Review created successfully',
        data : {
            newReview
        }
    });
});

const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

module.exports = {
    getAllReview,
    createNewReview,
    deleteReview,
    updateReview
}