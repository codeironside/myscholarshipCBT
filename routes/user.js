const express=require("express")
const { registerUser } = require("../controller/user")
const Router = express.Router()





Router.route("/registeration").post(registerUser)



module.exports=Router