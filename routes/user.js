const express=require("express")
const { registerUser } = require("../controller/user")
const Router = express.Router()





Router.route("/registration").post(registerUser)



module.exports=Router