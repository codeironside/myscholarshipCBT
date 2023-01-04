
const bodyParser = require('body-parser')
const url = require("url");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const e = require('express');
// const user = require("../models/user");
// const student = require('../models/student')

//@desc register new staff
//@routes POST/api/staff
//@access Public
//updating mongoose with javascript?
const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    firstname,
    phoneNumber,
    gender,
    lastname,
    password,
  } = req.body;
  console.log(req.body);
  if (
    !firstname ||
    !password 
    ||!email||!lastname
  ) {
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
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});
const mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: 'hurray you have signed up for the software',
  text: 'Thank you for signing up! We hope you join'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


//send a welelcome email
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const user = {
  //   id: staff.id, 
  //   username: staff.role,
   
  // }
  //creat user
  const User = await user.create({
    firstname,
    lastname,
    phoneNumber,
    gender,
    email,
    password: hashedPassword
  });
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
  const User= await user.findOne({ email: email });
  if (User && bcrypt.compare(password, User.password)) {
    res.status(201).json({
      id: User.id,
      name: User.name,
      email: User.email,
      token: generateToken(User.id),
      email:User.email, 
    });
  } else {
    res.status(400)
    throw new Error("invalid data"); 
  }
  
});


module.exports = {
  registerUser,
  loginUser
};
