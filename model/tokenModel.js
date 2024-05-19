const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema

const TokenCreate = new Schema({
    token: {
        type:String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 86400
    }
})

const Token = mongoose.model("Token", TokenCreate) 
module.exports = Token