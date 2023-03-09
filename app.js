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
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
dotenv.config();

const PORT = process.env.PORT ;

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

app.use(helmet());

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, 
	max: 100, 
    // standardHeaders: true,
});

process.on('uncaughtException',(err) => {
    console.log('UNHANDLED EXCEPTION :: Shutting Down Applicaion...');
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
});

// Middleware
app.use('/api',limiter);
app.use(express.json({limit : '10kb'}));
app.use(express.static(path.join(__dirname,'./public')));
// app.use((req,res,next) => {
//     console.log(req.headers);
//     next();
// })
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
});

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

