const express = require('express');
const morgan = require('morgan');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const EventEmitter = require('stream');

const app = express();
dotenv.config();

const PORT = process.env.PORT ;

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

process.on('uncaughtException',(err) => {
    console.log('UNHANDLED EXCEPTION :: Shutting Down Applicaion...');
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
});

// Middleware

app.use(express.json());
app.use(express.static(path.join(__dirname,'./public')));
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('combined'));
}
//routing
app.use('/api/v1/tours',tourRoutes);
app.use('/api/v1/user',userRoutes);

app.all('*',(req,res,next) => {
    next(new AppError('404 Not found',404));
});

app.use(globalErrorHandler);

connectDB(process.env.MONGODB_URI)
.then((conn) => {
    console.log('Database connected successfully');
})

const server = app.listen(PORT,() => {
    console.log(`Server connected at port :: ${PORT}`);
});


process.on('unhandledRejection',(err) => {
    console.log('UNHANDLED REJECTIION :: Shutting Down Applicaion...');
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
});

