const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name : {
        type : String,
        required : [true,'Please Enter User Name'],
        maxlength : [20,'User name must be of atmost 20 character'],
        minlength : [4,'User name must be of atleast 20 character'],
        // validate : [validator.isAlpha,'A user name must contain alphabets']
    },
    email : {
        type : String,
        required : [true,'Please Enter user name'],
        unique : [true,'Already Register'],
        lowercase : true,
        validate : [validator.isEmail,'Not a valid email address']
    },
    photo : {
        type : String,
    },
    role : {
        type : String,
        enum : {
            values : ['user','guide','lead-guide','admin'],
            message : 'Not a valid role'
        },
        default : 'user'
    },
    password : {
        type :  String,
        required : [true,'Please Enter the password'],
        minlength : [8,'Password must be atleast 8 character'],
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true,'Please enter the confirm password'],
        validate : {
            validator : function(ele){
                return ele === this.password;
            },
            message : 'Password Does not match'
        }
    },
    passwordChangedAt : Date
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return bcrypt.compare(candidatePassword,userPassword);
};

userSchema.methods.checkPasswordChange = async function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(changedTimeStamp,JWTTimeStamp);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
}

module.exports = mongoose.model('User',userSchema);