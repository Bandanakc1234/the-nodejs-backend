const User = require('../model/userModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Token = require('./../model/tokenModel')
const crypto  = require('crypto')
const jwt = require("jsonwebtoken")
// const { expressjwt } = require("express-jwt")

const createToken = (user) => {
    var token = jwt.sign({
        username: user.username,
        _id: user._id,
        role: user.role
    }, process.env.JWT_SECRET_KEY)
    return token;
}

const UserInformation = (user, reqData) => {
    if (reqData.name) {
        user.name = reqData.name
    }
    if (reqData.username) {
        user.username = reqData.username
    }
    if (reqData.email) {
        user.email = reqData.email
    }
    if (reqData.password) {
        user.password = reqData.password
    }
    if (reqData.gender) {
        user.gender = reqData.gender
    }
    if (reqData.role) {
        user.role = reqData.role
    }
    if (reqData.isVerified) {
        user.isVerified = reqData.isVerified
    }
}

//register new user
exports.register = async(req, res) =>{
    // const {username, email, password} = req.body
    //check if email already registered
    const user = await User.findOne({email: email})
    if(user){
        return res.status(400).json({error: "email already exists."})
    }
    let newUser = new User({
        // username: username,
        // email: email,
        // password: password
    })
    //create unique password
    UserInformation(newUser, req.body)
    let salt = await bcrypt.genSalt(saltRounds)
    newUser.password = await bcrypt.hash(req.body.password, salt)
    //add user to database
    newUser = await newUser.save()
    if(!newUser){
        return res.status(400).json({error: "Something wet wrong"})
    }
    //generate token
    let token = new Token({
        token: crypto.randomBytes(24).toString("hex"),
        user: newUser._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:"fail to generate token" })
    }
    res.send(newUser)
}

// to get user Details
exports.getUserDetails = async (req, res) => {
    let user = await User.findById(req.params.id)
    if (!user) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    res.send(user)
}

//update user
exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id,
            {
                firstname: req.body.name,
                username: req.body.username,
                email: req.body.email,
                gender: req.body.gender,
            },
        { new: true })
    if (!user) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    else {
        return res.status(400).json({ msg: "User updated Successfully" })
    }
}

// user Login
exports.Login = async (req, res) => {
    console.log(req.body)
    let { email, password } = req.body;
    // Check email
    let user = await User.findOne({
        $or: [
            { username: req.body.email },
            { email: req.body.email }
        ]
    });
    if (!user) {
        return res.status(400).json({ error: "Email not registered." });
    }
    if (!password) {
        return res.status(400).json({ error: "Please enter your password" })
    }
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(400).json({ error: "Email and password do not match" });
    }
    // Create login token
    let token = createToken({ user: user._id, role: user.role })

    // Set cookie
    res.cookie('myCookie', token, { expire: Date.now() + 86400 });

    // Return info to frontend
    let { _id, username, role} = user;
    res.status(200).json({ token, user: { _id, username, email, role} });
}



//logout
exports.Logout = async (req, res) => {
    await res.clearCookie("myCookie")
    res.send({ msg: "Signed out successfully" })
}

//delete user
exports.DeleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(400).json({ error: "user not found!!" })
            }
            return res.status(200).json({ message: "User deleted successfully" })
        })
        .catch(error => {
            return res.status(400).json({ error: error.message })
        })
}
