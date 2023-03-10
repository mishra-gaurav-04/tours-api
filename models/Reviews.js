const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewsSchma = new Schema({
    review : {
        type : String,
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
        
    }
})