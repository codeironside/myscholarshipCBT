require("dotenv").config();
const mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI;

module.exports = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('you have successfully connected to mongodb database')).catch(()=> console.log('failed to connect to database'))
