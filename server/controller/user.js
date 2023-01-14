const os = require("os");
const fs = require("fs");
const url = require("url");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const USER = require("../models/user");
const nodemailer = require("nodemailer");
const UserAgent = require("user-agents");
const BigInteger = require("big-integer");
const bodyParser = require("body-parser");
const { IPinfoWrapper } = require("node-ipinfo");
const userlogger = require("../utils/userloger");
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
  const secret = speakeasy.generateSecret({
    length: 20,
    issuer: "MyscholarshipNG",
    name: email,
  });

  // console.log(req.body);
  if (!FirstName || !password || !email || !Surname) {
    res.status(400);
    throw new Error("please add all fields");
  }
  //check if user exist
  const userExists = await USER.findOne({ email });
  if (userExists) {
    res.status(400);
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
      res.status(400);
      console.log(error);
      throw new Error("email not sent");
    } else {
      console.log("Email sent: " + info.response);
      userlogger.info(
        `Email sent : to ${email}  250 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}-${info.response}`
      );
    }
  });

  //send a welelcome email
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
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
    secret: secret.base32,
  });
  if (User) {
    res.status(201).json({
      id: User.id,
      name: User.name,
      email: User.email,
      token: generateToken(User._id),

      // message: "email sent",
    });
    userlogger.info(
      `user created :202 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } else {
    res.status(400);
    throw new Error("invalid data");
  }
});

//@desc authenticate a User
//@routes GET/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  if (req.session.userid) {
    res.redirect("user/exams");
  }
  const { email, password } = req.body;
  //check for staff number

  const User = await USER.findOne({ email: email });
  const secret = User.secret;
  console.log(secret);
  if (User && bcrypt.compare(password, User.password)) {
    var token = speakeasy.totp({
      secret: secret,
      encoding: "base32",
    });
    console.log(token);

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
      h2 {
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
        

    We are sending this email to confirm that you are the owner of the account associated with this email address.</br>
    
    
    </br>
    To complete the 2FA verification process, please enter the following code on the verification page:</br>

     <h2> ${token}</h2>

    If you did not request 2FA verification or have any issues with the process, please contact our support team for assistance.

          Thank you,


    
    The myscholarship Team<br/>
    
    When and where this happened<br/>
    Date:<br/>
    ${gmtDate}}br/>
    
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
        throw new Error(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(202).json({
          message: "please check your email for your code",
          token: generateToken(User._id),
        });
        const userloc = req.ipInfo;
        const ipinfo = new IPinfoWrapper(process.env.ipsecret);

         console.log(ipinfo.lookupIp(userloc).then((data) => {
          return data
        }));

       
        console.log(`User IP: ${userloc}`);

        userlogger.info(
          `email sent: to ${email} 202 - ${res.statusMessage} - ${
            req.originalUrl
          } - ${req.method} - ${req.ip}-${
            info.response
          }-- request made from os:${os.type()}, browser: ${userAgent.appName}`
        );
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
const authenticatelogin = asyncHandler(async (req, res) => {
  const { code, email } = req.body;
  const User = await USER.findOne({ email: email });
  var verified = speakeasy.totp.verify({
    secret: User.secret,
    encoding: "base32",
    token: code,
    window: 6,
  }); // Outputs: "9ix"
  console.log(verified);
  if (verified) {
    res.status(200).json({
      verify: "verified",
    });
    userlogger.info(
      `user verified :202 - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } else {
    res.status(401);
    throw new Error("invalid code");
  }
});
//@desc recover password
//@routes POST /user/recoverPassword
//@access public
const recoverPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const User = await USER.findOne({ email: email });
  if (!User) {
    res.status(404);
    throw new Error("invalid user");
  }
  var token = speakeasy.totp({
    secret: User.secret,
    encoding: "base32",
  });
  console.log(token);

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
      h2 {
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
    
    <h2>${token}</h2>
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
      res
        .status(202)
        .json({ message: "please check your email for your code" });
      console.log(req.originalUrl);
      userlogger.info(
        `email sent :202 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
    }
  });
});

//@desc verify code for recover password
//@routes POST/user/verifycode
//@access public
const verifycode = asyncHandler(async (req, res) => {
  const { code, email } = req.body;
  const User = await USER.findOne({ email: email });
  var verified = speakeasy.totp.verify({
    secret: User.secret,
    encoding: "base32",
    token: code,
    window: 6,
  }); // Outputs: "9ix"
  console.log(verified);
  // put with mongoose ?
  if (verified) {
    res.status(200).json({
      verify: "verified",
    });
    userlogger.info(
      `user verified :202 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } else {
    res.status(401);
    throw new Error("invalid code");
  }
});

//@descchange password
//@routes POST/user/changepassword
//@access public

const changepassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const id = await USER.findOne({ email: email });
  const change = await USER.findByIdAndUpdate(
    id._id,
    { password: hashedPassword },
    { new: true }
  );
  console.log(change);

  if (change) {
    res.status(202).json({
      password: "changed",
    });
    userlogger.info(
      `password changed :202 - ${res.statusMessage}  - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } else {
    res.status(401);
    throw new Error("unable to change password");
  }
});
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const Location = (userloc) => {
  const ipinfo = new IPinfoWrapper(process.env.ipsecret);

  ipinfo.lookupIp(userIp).then((response) => {
    return console.log(response);
  });
};
module.exports = {
  registerUser,
  loginUser,
  recoverPassword,
  verifycode,
  authenticatelogin,
  changepassword,
};
