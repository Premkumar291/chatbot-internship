import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    name : {
        type:String,
        required:true
    },
    dateOfBirth : {
        type : Date,
        required : false
    },
    lastLogin : {
        type: Date,
        default: Date.now()
    },
    // resetPasswordToken : String,
    // resetPasswordExpiresAt : Date,
    // verificationToken : String,
    // verificationTokenExpiresAt : Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;