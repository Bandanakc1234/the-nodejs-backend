const express = require("express")
const {register, getUserDetails, updateUser, Login, DeleteUser, Logout} = require('../controller/userController')
const router = express.Router()

router.post('/signup', register )

router.get ('/profile/:id', getUserDetails)

router.put('/profile/:id', updateUser )

router.post('/login', Login)

router.get('/logout', Logout)

router.delete('/profile/:id', DeleteUser)

module.exports = router