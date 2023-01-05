const fs = require("fs");
const url = require("url");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
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
    MiddleName,
    email,
    Nationality,
    SOG,
    SCHOOL,
    level,
    status,
    essay,
    password,
    hearAbout,
    gender,
  } = req.body;
  // console.log(req.body);
  if (!FirstName || !password || !email || !Surname) {
    res.status(400);
    throw new Error("please add all fields");
  }
  //check if user exist
  //   const userExists = await User.findOne({ emaill:email });
  //   if (userExists) {
  //     res.status(400);
  //     throw new Error("user already exist");
  //   }
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
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(201).json({
    message: "email sent",
  });
  //send a welelcome email
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const user = {
  //   id: staff.id,
  //   username: staff.role,

  // }
  // //creat user
  // const User = await user.create({
  //   firstname,
  //   lastname,
  //   phoneNumber,
  //   gender,
  //   email,
  //   password: hashedPassword,
  // });
  //   if (user) {
  //     res.status(201).json({
  //       id: User.id,
  //       name: User.name,
  //       email: User.email,
  //       role:User.email,
  //       token: generateToken(User._id),
  //     });
  //   } else {
  //     res.status(400);
  //     throw new Error("invalid data");
  //   }
});

//@desc authenticate a User
//@routes GET/api/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for staff number
  const User = await user.findOne({ email: email });
  if (User && bcrypt.compare(password, User.password)) {
    res.status(201).json({
      id: User.id,
      name: User.name,
      email: User.email,
      token: generateToken(User.id),
      email: User.email,
    });
  } else {
    res.status(400);
    throw new Error("invalid data");
  }
});

const time = "90s"

const recoverPassword = asyncHandler(async (req, res) => {
  const {code,email}=req.body
  if (email && !code){
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
      },
    });
   const html=` <!DOCTYPE html>
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
    <p>Hi [USER],
  
    Your 2FA code is: <h2>${base10}</h2>
    
    This code will expire in ${time}.
    
    Please enter this code to verify your identity and access your account.
    
    
    If you did not request this code, please contact us immediately.
    
    Best,
    [YOUR NAME]
    </p>
    
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
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    
    
  }
  //verify the code
  if(code && !email){
    
    //verify the 2FA
    const base32 = BigInteger(base10).toString(32);
    console.log(base32); // Outputs: "9ix"

  const verified = speakeasy.verify({
    secret: secret.base32,
    encoding: "base32",
    token: code,
  });

  if (verified) {
    res.status(200).json({
      message:"verified"
    })
  } else {
    res.status(401).json({
      message:"invalid code"
    })
  }
  }
});

module.exports = {
  registerUser,
  loginUser,
  recoverPassword,
};
