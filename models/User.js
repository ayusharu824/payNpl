const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    emailID: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    NpMobileNo:{
        type: String
        //NP - Nepal
    },
    INMobileNo: {
        type: String,
        //IN - India
    },
    Latitude:{
        type: String
    },
    Longitude:{
        type: String
    },
    appVersion:{
        type: String
    },
    OsType: {
        type: String
    },
    PushToken: {
        type: String
    },
    CreatedDate: {
        type: Date,
        default: Date.now
    },
    CreatedBy: {
        type: Object
    },
    IsActive:{
        type: Boolean,
        default: true
    }

})
module.exports = User = mongoose.model('user', UserSchema)