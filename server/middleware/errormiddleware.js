const { stack } = require("../routes/user.js")
const userlogger = require("../utils/userloger.js")

const httpcottext = require("express-http-context")

const errorHandler=(err,req,res,next)=>{
    const statusCode = res.statusCode? res.statusCode:500
    res.status(statusCode).json({
        Message:err.Message,
        stack:process.env.NODE_ENV === "production"? null: err.stack
    })
    const reqid=httpcottext.get("reqId")
    console.log(reqid)
    userlogger.error(new Error(`${res.statusCode} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`));
    next()
}
module.exports={
    errorHandler,
}

