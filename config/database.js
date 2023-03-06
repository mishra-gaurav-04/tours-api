const mongoose = require('mongoose');

const connectDB = (url) => {
   return  mongoose.connect(url,{
          useNewUrlParser : true,
     });
     console.log('Mongo DB connected');
}

module.exports = connectDB;