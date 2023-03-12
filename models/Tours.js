const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Schema = mongoose.Schema;


const tourSchema = new Schema({
    name : {
        type : String,
        required : [true,'A tour must have a name'],
        unique : true,
        trim : true,
        maxlength : [50,'A tour name must not have more than 10 chracters'],
        minlength : [4 ,'A tour name must have more than 4 charcters'],
        // validate : [validator.isAlpha,'A tour name must contain only alphabets']
    },
    slug : String,
    duration : {
        type : Number,
        required : [true,'A tour must have a duration']
    },
    difficulty : {
        type : String,
        required : [true,'A tour must have a difficulty'],
        enum : {
            values : ['easy','medium','difficult'],
            message : 'Difficulty is either easy,medium or difficult'
        }
    },
    maxGroupSize : {
        type : Number,
        required : [true,'A tour must have a group size']
    },
    price : {
        type : Number,
        required : true
    }
    ,
    ratingsAverage : {
        type : Number,
        default : 4.5,
        min : [1,'Ratings must be greater than or equal to 1'],
        max : [5,'Ratngs must be less than or equal to 5 ']
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    priceDiscount : {
        type : Number,
        validate : {
            validator : function(val){
                return val<this.price;
            },
            message : 'Validation failed'
        }
    },
    summary : {
        type : String,
        trim : true,
        required : [true,'A tour must have a summary']
    },
    description : {
        type : String,
        trim : true,
    },
    imageCover : {
        type : String,
        required : [true,'A tour must have a image cover']
    },
    images : [String],
    createdAt : {
        type : Date,
        default : Date.now(),
        select : false
    },
    startLocation : {
        type : {
            type : String,
            default : 'Point',
            enum : ['Point'],
        },
        coordinates : [Number],
        address : String,
        description : String 
    },
    location : [
        {
            type : {
                type : String,
                default : 'Point',
                enum : ['Point'],
            },
            coordinates : [Number],
            address : String,
            description : String,
            day : Number
        }
    ],
    guides : [
        {
            type : Schema.ObjectId,
            ref : 'User'
        }
    ],
    startDates : [Date],
    secretTour : {
        type : Boolean,
        default : false
    }
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

//Documnet middleware

tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower : true});
    next();
});

tourSchema.index({price : 1});

// tourSchema.pre('save', async function(next) {
//        const guidesPromises = this.guides.map(async id => await User.findById(id));
//        this.guides = await Promise.all(guidesPromises);
//        next();
//     });

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// });

// query middleware
tourSchema.pre(/^find/,function(next){
    this.find({secretTour : {$ne : true}});
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/,function(next){
    this.populate({
        path : 'guides',
        select : '-__v -passwordChangedAt'
    });
    next();
});

tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match : {secretTour : {$ne : true}}});
    next();
})

tourSchema.virtual('durationWeek').get(function() {
    return this.duration/7;
});


tourSchema.virtual('reviews',{
    ref : 'Review',
    foreignField : 'tour',
    localField : '_id'
});

module.exports = mongoose.model('Tour',tourSchema);