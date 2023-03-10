const express = require("express");
const {
  registerUser,
  recoverPassword,
  verifycode,
  loginUser,
  authenticatelogin,
  changepassword,
  home,
} = require("../controller/user");
const Router = express.Router();


//home 
Router.route("").get(home)
//registeration
Router.route("/registration").post(registerUser);
//login user
Router.route("/login").post(loginUser);

//authenticate user login
Router.route("/authenticate").post(authenticatelogin);

//recover password
Router.route("/recoverpassword").post(recoverPassword);

//verify code
Router.route("/verify").post(verifycode);

//change password
Router.route("/changePassword").post(changepassword);

module.exports = Router;
