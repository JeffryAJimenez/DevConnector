//mongoDB connection here in order to avoid clutter in <file>server.js</file>
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    });

    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);

    process.exit(1);
  }
};

module.exports = connectDB;