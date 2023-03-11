const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewsSchema = new Schema({
    review : {
        type : String,
        required: [true,'Tour must have a review']
    },
    rating :{
        type : Number,
        required : [true,'Please give the rating'],
        min : [1,'Rating must between 1 and 5'],
        max : [5,'Rating must be between 1 and 5']
    },
    tour : {
        type : Schema.Types.ObjectId,
        ref : 'Tour',
        required : [true,'Review must belong to the tour']
    },
    users :[
        {
            type : Schema.Types.ObjectId,
            ref : 'User',
            required : [true,'Review must belong to the user']
        }
    ],
    createdAt : {
        type : Date,
        default : Date.now(),
        select : false
    },
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

reviewsSchema.pre(/^find/,function(next){
   this.populate({
        path : 'users',
        select : 'name photo'
    });
    next();
});

module.exports = mongoose.model('Reviews',reviewsSchema);