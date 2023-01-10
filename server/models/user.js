const mongoose = require("mongoose");
const USER = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: [true, "please insert a firstname"],
    },
    middleName: {
      type: String,
    },
    Surname: {
      type: String,
      required: [true, "please insert a surname"],
    },
    gender: {
      type: String,
      required: [true, "please specify a gender "],
    },
    email: {
      type: String,
      required: [true, "specify an email"],
      unique:true
    },
    phonenumber: {
      type: String,
      required: [true, "specify include phonenumber"],
    },
    password: {
      type:String,
      required: [true, "please insert password"],
    },
    essay: {
      type:String,
      required: [true, "please insert an essay"],
    },
    SOG: {
      type:String,
      required: [true, "please insert an SOG"],
    },
    level: {
      type:String,
      required: [true, "please include level"],
    },
    status: {
      type:String,
      required: [true, "please state a staus"],
    },
    Nationality: {
      type:String,
      required: [true, "please indicate a nationality"],
    },
    hearAbout: {
      type:String,
      required: [true, "please pick one"],
    },
    school: {
      type:String,
      required: [true, "please insert a school"],
    },
    score: {
      type:String
    },
  },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("USER", USER);
