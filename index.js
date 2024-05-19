const express = require('express')
require('dotenv').config()
require('./database/connection')
const morgan = require("morgan")
const cors = require('cors')

//middleware
const bodyParser = require('body-parser')

const userRoute = require('./routes/userRoute')

const app = express()
const port = process.env.PORT || 8000

//middleware
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors())

//use routes
app.use('/api/auth', userRoute)


app.listen(port, ()=>{
    console.log(`server started successfully at port ${port}`)
})