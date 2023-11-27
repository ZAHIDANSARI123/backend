const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/test";

const databaseconnect = () => {
  mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((conn) => {
      console.log(`Connected to DB: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Error connecting to DB: ${err.message}`);
    });
};

module.exports = databaseconnect;
