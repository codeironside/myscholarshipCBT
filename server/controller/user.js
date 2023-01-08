const os = require("os");
const fs = require("fs");
const url = require("url");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const userlogger = require("../utils/userloger")
const speakeasy = require("speakeasy");
const USER = require("../models/user");
const nodemailer = require("nodemailer");
const UserAgent = require("user-agents");
const BigInteger = require("big-integer");
const bodyParser = require("body-parser");
const asyncHandler = require("express-async-handler");


// Read the image file into a Buffer

// const user = require("../models/user");
// const student = require('../models/student')

//@desc register new staff
//@routes POST/api/staff
//@access Public
//updating mongoose with javascript?
const registerUser = asyncHandler(async (req, res) => {
  
  const {
    Surname,
    FirstName,
    middleName,
    email,
    Nationality,
    SOG,
    school,
    level,
    status,
    essay,
    password,
    hearAbout,
    gender,
    phonenumber,
  } = req.body;
  // console.log(req.body);
  if (!FirstName || !password || !email || !Surname) {
    res.status(400);
    throw new Error("please add all fields");

  }
  //check if user exist
  const userExists = await USER.findOne({ email });
  if (userExists) {
    res.status(400)
    throw new Error("user already exist");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const html = `
  <!DOCTYPE html>
<html>
<head>
  <style>
    /* Set the body background to the image */
    body {
      background-image:url('https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-open-book-education-day_23-2149241017.jpg?w=740&t=st=1672839251~exp=1672839851~hmac=250a8619cf050e204e19f685163952c48a928f250756df0e7e70c93e889369da') ;
      background-size: cover;
      background-repeat: no-repeat;
      font-family: sans-serif;
      color: white;
      text-align: center;
      padding: 50px;
    }

    /* Style the header */
    h1 {
        color:red;
      font-size: 48px;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    /* Style the message */
    p {
      font-size: 18px;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    /* Style the button */
    .button {
      display: inline-block;
      background-color: #3498db;
      color: white;
      padding: 15px 30px;
      border-radius: 5px;
      text-decoration: none;
      font-size: 18px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  </style>
</head>
<body>
  <h1>Welcome to My MyscholarshipNG!</h1>
  <p>hey ${FirstName} Thank you for signing up. We hope you enjoy using our app.</p>
  <a class="button" href="#">Explore the App</a>
</body>
</html>
`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "hurray you have signed up for the software",
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400)
      console.log(error);
      throw new Error("email not sent")
    } else {
      console.log("Email sent: " + info.response);
      userlogger.info(`Email sent :202 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}-${info.response}`)
    }
  });

  //send a welelcome email
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
 
  // //create user
  const User = await USER.create({
    Surname,
    FirstName,
    middleName,
    email,
    Nationality,
    SOG,
    school,
    level,
    status,
    essay,
    password: hashedPassword,
    hearAbout,
    gender,
    phonenumber,
  });
  if (User) {
    res.status(201).json({
      id: User.id,
      name: User.name,
      email: User.email,
      token: generateToken(User._id),

      // message: "email sent",
    });
    userlogger.info(`user created :202 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  } else {
    res.status(400);
    throw new Error("invalid data");

  }
});

//@desc authenticate a User
//@routes GET/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for staff number
  time="60s"
  const User = await USER.findOne({ email: email });
  
  if (User && bcrypt.compare(password, User.password)) {
    const secret = speakeasy.generateSecret({
      length: 20,
      issuer: "MyscholarshipNG",
      name: "fury25423@gmail.com",
      expires: time,
    });

    const b32 = secret.base32;
    //conversts to base10
    const base10 = parseInt(b32, 32);
    console.log(base10);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      }, //jhbhbvjgvchchc
    });
    const userAgent = new UserAgent();
    
   
    const currentDate = new Date();
    const gmtDate = currentDate.toGMTString();
    const html = ` <!DOCTYPE html>

  <html>
  <head>
    <style>
      /* Set the body background to the image */
      body {
        background-image:url('https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-open-book-education-day_23-2149241017.jpg?w=740&t=st=1672839251~exp=1672839851~hmac=250a8619cf050e204e19f685163952c48a928f250756df0e7e70c93e889369da') ;
        background-size: cover;
        background-repeat: no-repeat;
        font-family: sans-serif;
        color: white;
        text-align: center;
        padding: 50px;
      }
  
      /* Style the header */
      h1 {
          color:red;
        font-size: 48px;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
      h1 {
        color:black;
      font-size: 30px;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  
      /* Style the message */
      p {
        font-size: 18px;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
  
      /* Style the button */
      .button {
        display: inline-block;
        background-color: #3498db;
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 18px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
    </style>
  </head>
  <body>
    <h1>ALERT</h1>
    <p>Hi ${User.FirstName}</p> ,
        

    We are sending this email to confirm that you are the owner of the account associated with this email address. </br>
    To complete the 2FA verification process, please enter the following code on the verification page:</br>

      ${base10}

    If you did not request 2FA verification or have any issues with the process, please contact our support team for assistance.

          Thank you,


    
    The myscholarship Team<br/>
    
    When and where this happened<br/>
    Date:<br/>
    ${gmtDate}}<br/>
    Operating System:<br/>
    
    ${os.type()}<br/>
    
    Browser:<br/>
    
    ${userAgent.appName}<br/>
    
    Approximate Location:<br/>
    
    Abuja, Abuja (fct), Nigeria<br/>
    
    Didn't do this? Be sure to change your password right away.<br/>
    
    This email was intended for ${User.FirstName} ${User.Surname}<br/>
    </p>
    
  </body>
  </html>
  `;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${User.Surname}, here's your PIN`,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error(error)
      } else {
        console.log("Email sent: " + info.response);
        res.status(202).json({message:"please check your email for your code"})
        userlogger.info(`202 - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}-${info.response}`)
      }
    });
  } else {
    res.status(400);
    throw new Error("invalid data");
  }
});
//@desc authenticate login
//@routes GET/user/verifycode
//@access public
const authenticatelogin =asyncHandler(async(req,res)=>{

  const {code}= req.body
  const base32 = BigInteger(code).toString(32);
    console.log(base32); // Outputs: "9ix"

    const verified = speakeasy.verify({
      secret: secret.base32,
      encoding: "base32",
      token: base32,
  
    })
    if (verified) {
      res.status(200).json({
        message: "verified",
      });
      userlogger.info("user verified" + `202 - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
    } else {
      res.status(401)
      throw new Error("invalid code")
    }

  
      
})



const recoverPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
 
    const User = await USER.findOne({email:email})
    const time = "90s";
    if(!User){
      res.status(404)
      throw new Error("invalid user")
    }
    const secret = speakeasy.generateSecret({
      length: 20,
      issuer: "MyscholarshipNG",
      name: "fury25423@gmail.com",
      expires: time,
    });

    const b32 = secret.base32;
    //conversts to base10
    const base10 = parseInt(b32, 32);
    console.log(base10);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      }, //jhbhbvjgvchchc
    });
    const userAgent = new UserAgent();
    const rowser = JSON.stringify(userAgent.data, null, 1);
   
    const currentDate = new Date();
    const gmtDate = currentDate.toGMTString();
    const html = ` <!DOCTYPE html>

  <html>
  <head>
    <style>
      /* Set the body background to the image */
      body {
        background-image:url('https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-open-book-education-day_23-2149241017.jpg?w=740&t=st=1672839251~exp=1672839851~hmac=250a8619cf050e204e19f685163952c48a928f250756df0e7e70c93e889369da') ;
        background-size: cover;
        background-repeat: no-repeat;
        font-family: sans-serif;
        color: white;
        text-align: center;
        padding: 50px;
      }
  
      /* Style the header */
      h1 {
          color:red;
        font-size: 48px;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
      h1 {
        color:black;
      font-size: 30px;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  
      /* Style the message */
      p {
        font-size: 18px;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
  
      /* Style the button */
      .button {
        display: inline-block;
        background-color: #3498db;
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 18px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
    </style>
  </head>
  <body>
    <h1>ALERT</h1>
    <p>Hi ,
    We received a request to reset the password on your myscholarship Account.<br/>
    
    <h2>${base10}</h2>
    Enter this code to complete the reset.<br/>
    
    Thanks for helping us keep your account secure.<br/>
    
    The myscholarship Team<br/>
    
    When and where this happened<br/>
    Date:<br/>
    ${gmtDate}}<br/>
    Operating System:<br/>
    
    ${os.type()}<br/>
    
    Browser:<br/>
    
    ${userAgent.appName}<br/>
    
    Approximate Location:<br/>
    
    Abuja, Abuja (fct), Nigeria<br/>
    
    Didn't do this? Be sure to change your password right away.<br/>
    
    This email was intended for ${User.FirstName} ${User.middleName}<br/>
    </p>
    
  </body>
  </html>
  `;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${User.Surname}, here's your PIN`,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(202).json({message:"please check your email for your code"})
        console.log(req.originalUrl)
        userlogger.info(`email sent :202 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      }
    });
  
 
    
  }
);
const verifycode=asyncHandler(async(req,res)=>{
  const {code}= req.body
  const base32 = BigInteger(code).toString(32);
    console.log(base32); // Outputs: "9ix"

    const verified = speakeasy.verify({
      secret: secret.base32,
      encoding: "base32",
      token: base32,
  
    })
    if (verified) {
      res.status(200).json({
        message: "verified",
      });
      userlogger("2fa code verified")
    } else {
      res.status(401)
      throw new Error("invalid code")
    }
})



const generateToken = (id) => {
  return jwt.sign({ id}, process.env.JWT_SECRET, { expiresIn: "1d" });
};
module.exports = {
  registerUser,
  loginUser,
  recoverPassword,
  verifycode,
  authenticatelogin
};
