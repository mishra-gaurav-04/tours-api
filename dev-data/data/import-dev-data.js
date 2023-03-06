const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tours = require('../../models/Tours');

dotenv.config({path : '/home/gaurav/Development/Web-D/Backend/tours/.env'});

mongoose.connect(process.env.MONGODB_URI)
.then((conn) => {
    console.log('DB connected successfully')
})
.catch((err) => {
    console.log(err);
})

// reading json file
const tours = JSON.parse(fs.readFileSync('/home/gaurav/Development/Web-D/Backend/tours/dev-data/data/tours-sample.json','utf-8'));

// loading data to DB
const importData = async() => {
    try{
        await Tours.create(tours);
        console.log('Data loaded successsfully to database');
        process.exit();
    }
    catch(err){
        console.log(err);
    }
};

// Deleting the existing data from DB
const deleteData = async() => {
    try{
        await Tours.deleteMany();
        console.log('Data deleted Successfully');
        process.exit();
    }
    catch(err){
        console.log(err);
    }
};

if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deleteData();
}