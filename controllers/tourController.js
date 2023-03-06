const Tour = require('../models/Tours');
const APIFeatures = require('../utils/apifeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/asyncError');

const aliasTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAvg,price';
    req.query.fields = 'name,price,summary,difficulty,ratingsAvg'
    next();
}

const checkBody = (req,res,next) => {
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status : 'fail',
            message : 'Missing name or price'
        });
    }
    next();
}


const getAllTours = catchAsync(async(req,res,next) => {
    const features = new APIFeatures(Tour.find(),req.query)
    .filter()
    .sorting()
    .limiting()
    .pagination()
    const tours = await features.query;
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {
            tours
        }
    });
});

const addNewTour = catchAsync(async(req,res,next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status : 'Success',
        message : 'New Tour Created Successfully',
        data : {
            newTour,
        }
    });
});

const getTour = catchAsync( async(req,res,next) => {
    const tourId = req.params.id;

        const tour = await Tour.findById(tourId);
        if(!tour){
            return next(new AppError('Tour not found :: invalid ID',404));
        }
        res.status(200).json({
            status : 'Success',
            data : {
                tour
            }
        });
});

const updateTour = catchAsync(async(req,res,next) => {
    const tourId = req.params.id;
    const {name,price,rating} = req.body;

    const updatedTour =  await Tour.findByIdAndUpdate(tourId,{
            name : name,
            price : price,
            rating : rating
        },
        {
            new : true,
            runValidators : true
        });
    if(!updatedTour){
        return next(new AppError('Tour not found :: Invalid Tour-ID',404));
    }

        res.status(204).json({
            status : 'Updated Successfully',
            data : {
                updatedTour
            }
        });    
});

const deleteTour = catchAsync(async(req,res,next) => {
    const tourId = req.params.id;
        await Tour.findByIdAndDelete(tourId);
        res.status(200).json({
            status : 'Success',
            message : 'Tour Delete successfully'
        });
});

const getToursStats = catchAsync(async(req,res,next) => {
    const stats = await Tour.aggregate([
        {
            $match : {ratingsAvg : {$gte : 4.5}}
        },
        {
            $group : {
                _id : {$toUpper : '$difficulty'},
                numTours : {$sum : 1},
                numRatings : {$sum : '$ratingsQuantity'},
                avgRating : {$avg : '$ratingsAvg'},
                avgPrice : {$avg : '$price'},
                maxPrice : {$max : '$price'},
                minPrice : {$min : '$price'}
            }
        },
        {
            $sort : {avgPrice : 1}
        },
        {
            $match : {_id : {$ne : 'EASY'}}
        }

    ]);
    res.status(200).json({
        status : 'Success',
        data : {
            stats
        }
    });
});

const getMonthlyPlan = (async (req,res,next) => {
    const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind : '$startDates'
            },
            // fix gte and lte range
            // {
            //     $match : {
            //         startDates : {
            //             $gte : new Date(`${year}-01-01`),
            //             $lte : new Date(`${year}-12-31`),
            //         }
            //     }
            // },
            {
                $group :{
                    _id : {$month : '$startDates'},
                    numTour : {$sum : 1},
                    tours : {$push : '$name'}
                }
            },
            {
                $addFields : {
                    month : '$_id'
                }
            },
            {
                $project : {
                    _id : 0
                }
            },
            {
                $sort : {numTourStarts : -1}
            },
            {
                $limit : 12
            }
        ]);

        console.log(plan);

        res.status(200).json({
            status : 'Success',
            data : {
                plan
            }
        });
})

module.exports = {
    getAllTours,
    getTour,
    getToursStats,
    getMonthlyPlan,
    addNewTour,
    updateTour,
    deleteTour,
    checkBody,
    aliasTopTours,
    
};