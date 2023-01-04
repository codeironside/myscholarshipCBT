const express = require("express");
const { errorHandler } = require("./middleware/errormiddleware,js");



app=express()

//router routes
app.use("/user",require("./routes/user"))


//error handler
app.use(errorHandler);
//port number
const PORT= process.env.PORT||2000


app.listen(PORT,()=>{
    console.log(`server listening on  port ${PORT}`)
})