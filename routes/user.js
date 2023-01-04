const express=require("express")
const { registerUser, recoverPassword } = require("../controller/user")
const Router = express.Router()




//registeration
Router.route("/registration").post(registerUser)

//recover password
Router.route("/recoverpassword").post(recoverPassword)

module.exports=Router