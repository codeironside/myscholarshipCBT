
const bodyParser = require('body-parser')
const url = require("url");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
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
  //check if staff exist
//   const userExists = await Staff.findOne({ StaffNumber });
//   if (userExists) {
//     res.status(400);
//     throw new Error("user already exist");
//   }
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const user = {
  //   id: staff.id, 
  //   username: staff.role,
   
  // }
  //creat staff
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
//       token: generateToken(staff._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("invalid data");
//   }
 
});


//@desc authenticate a staff
//@routes GET/api/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { StaffNumber, password } = req.body;
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
