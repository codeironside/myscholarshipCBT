const express = require("express");
const { errorHandler } = require("./middleware/errormiddleware.js");
require("dotenv").config();


const app = express()

// db

// const mongoose = require("mongoose");
// const connectionString = process.env.MONGODB_URI;

// module.exports = mongoose.connect(connectionString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('you have successfully connected to mongodb database')).catch(()=> console.log('failed to connect to database'))

//json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router routes
app.get('./', (req, res) => {
    res.status(200).send('hompage')
})

app.use("/user", require("./routes/user"))

//error handler
app.use(errorHandler);

//port number
const PORT = process.env.PORT || 2000


app.listen(PORT, () => {
    console.log(`server listening on  port ${PORT}`)
})