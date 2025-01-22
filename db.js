const mongoose = require("mongoose");

const DB_HOST = "mongodb+srv://alicjaszamraj:Polonia1@hw03-mongodb.o6y3p.mongodb.net/";

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
