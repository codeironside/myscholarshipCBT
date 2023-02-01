require("dotenv").config();
const colors = require("colors")
const express = require("express");
const connectDB = require("./config/db")
const { errorHandler } = require("./middleware/errormiddleware.js");
const ip = require('express-ip')
const path=require('path')


const sessions= require("./middleware/sessions")

const morgan = require('morgan');
const logger = require('./utils/logger')
const userlogger = require('./utils/userloger');
// const session = require("express-session");


const app = express()
//ip
app.use(ip().getIpInfoMiddleware)

//logger
app.use(morgan('tiny', { stream: logger.stream }));
app.use(morgan('tiny', { stream: userlogger.stream }));


//views
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"../public")))
// db
connectDB()

//json

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router routes
app.use(sessions)
app.use("/user", require("./routes/user.js"))
app.use("", require("./routes/user.js"))


//Admin routes
app.use("/user", require("./routes/Admin.js"))

//error handler
app.use(errorHandler);
//sessions middle ware

//port number
const PORT = process.env.PORT || 2000;
const env = process.env.NODE_ENV || 'development'

let host = env ==="development" ? 'development' : 'production';


app.listen(PORT, () => {
    console.log(`server is running on localhost:${PORT} `) 
    logger.info(`Server started and running on http://${host}:${PORT}`)
})