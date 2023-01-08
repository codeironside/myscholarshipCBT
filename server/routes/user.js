const express = require("express")
const { registerUser, recoverPassword, verifycode, loginUser, authenticatelogin } = require("../controller/user")
const Router = express.Router()

//registeration
Router.route("/registration").post(registerUser)
//login user
Router.route("/login").post(loginUser)

//authenticate user login
Router.route("/authenticate").post(authenticatelogin)

//recover password
Router.route("/recoverpassword").post(recoverPassword)

//verify code 
Router.route("/verify").post(verifycode)

module.exports = Router