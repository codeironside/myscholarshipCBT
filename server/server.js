require("dotenv").config();
const colors = require("colors")
const express = require("express");
const connectDB = require("./config/db")
const { errorHandler } = require("./middleware/errormiddleware.js");



const app = express()

// db
connectDB()

//json

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router routes
app.get('/', (req, res) => {
    res.status(200).send('hompage')
})

app.use("/user", require("./routes/user.js"))

//error handler
app.use(errorHandler);

//port number
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`\nserver is running on localhost:${PORT}`)
)