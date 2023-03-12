const AppError = require("../utils/appError");
const catchAsync = require("../utils/asyncError");
const APIFeatures = require('../utils/apifeatures');
const { Model } = require("mongoose");


exports.deleteOne = (Model) => catchAsync(async(req,res,next) => {
    const docId = req.params.id;
    const doc = await Model.findByIdAndDelete(docId);

    if(!doc){
        return next(new AppError('No document found with that id',404));
    }

    res.status(204).json({
        status : 'Success',
        data : null
    });
});

exports.updateOne = (Model) => catchAsync(async(req,res,nect) => {
    const docId = req.params.id;
    const doc = await Model.findByIdAndUpdate(docId,req.body,{
        new : true,
        runValidators: true
    });

    if(!doc){
        return next(new AppError('Not Found',404));
    }
    res.status(200).json({
        status : 'Success',
        data : {
            doc
        }
    });
});

exports.createOne = (Model) => catchAsync(async(req,res,next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status : 'Success',
        data : {
            doc
        }
    });
});


exports.getOne = (Model) => catchAsync(async(req,res,next) => {
    const docId = req.params.id;
    const doc = await Model.findById(docId);

    if(!doc){
        return next(new AppError('Not Found',404));
    }

    res.status(200).json({
        status : 'Success',
        data : {
            data : doc
        }
    });
});

exports.getAll = (Model) => catchAsync(async(req,res,next) => {
    let filter = {};

    if(req.params.tourId){
        filter = {
            tour : req.params.tourId
        };
    }

    const features = new APIFeatures(Model.find(filter),req.query).filter().sorting().limiting().pagination();

    const doc = await features.query.explain();

    res.status(200).json({
        status : 'Success',
        results : doc.length,
        data : {
            doc
        }
    });
});
