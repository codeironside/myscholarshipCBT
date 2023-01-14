const sessions = require("express-session");
const express=require("express")
const app =express()
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
const session = sessions({
  secret: process.env.secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, //12 houares
  },
  resave: true,
  saveUninitialized: false,
});

module.exports=session