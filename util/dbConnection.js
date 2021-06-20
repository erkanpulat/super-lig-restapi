const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/football_api", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((_) => {
    console.log("Connection to database successful.");
  })
  .catch((err) => {
    console.log("Connection to database failed. Error: " + err);
  });
