const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://alicjaszamraj:Polonia1@hw03-mongodb.o6y3p.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
