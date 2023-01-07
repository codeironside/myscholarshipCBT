require("dotenv").config();
const colors = require("colors")
const express = require("express");
const connectDB = require("./config/db")
const { errorHandler } = require("./middleware/errormiddleware.js");



const morgan = require('morgan');
const logger = require('./utils/logger')
const userlogger = require('./utils/userloger');


const app = express()

//logger
app.use(morgan('tiny', { stream: logger.stream }));
app.use(morgan('tiny', { stream: userlogger.stream }));
// db
connectDB()

//json

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router routes

app.use("/user", require("./routes/user.js"))

//error handler
app.use(errorHandler);

//port number
const PORT = process.env.PORT || 2000;
const env = process.env.NODE_ENV || 'development'

let host = env ==="development" ? 'development' : 'production';


app.listen(PORT, () => {
    console.log(`server is running on localhost:${PORT} `) 
    logger.info(`Server started and running on http://${host}:${PORT}`)
})