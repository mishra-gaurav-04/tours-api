const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tour = require('./Tours');


const reviewsSchema = new Schema({
    review : {
        type : String,
        required: [true,'Tour must have a review']
    },
    rating : {
        type : Number,
        required : [true,'Please give the rating'],
        min : [1,'Rating must between 1 and 5'],
        max : [5,'Rating must be between 1 and 5']
    },
    tour : {
        type : Schema.ObjectId,
        ref : 'Tour',
        required : [true,'Review must belong to the tour']
    },
    user : {
            type : Schema.ObjectId,
            ref : 'User',
            required : [true,'Review must belong to the user']
        }
    ,
    createdAt : {
        type : Date,
        default : Date.now(),
    },
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

reviewsSchema.pre(/^find/,function(next){
   this.populate({
        path : 'user',
        select : 'name photo'
    });
    next();
});

module.exports = mongoose.model('Review',reviewsSchema);