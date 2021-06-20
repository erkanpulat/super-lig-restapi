// packages
const express = require("express");
// db connection
require("./util/dbConnection");
const getData = require("./util/getData").getData;
const errorMiddleware = require("./middlewares/errorMiddleware");
// routes
const teamRouter = require("./routes/teamRouter");
const matchRouter = require("./routes/matchRouter");

// app
const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the Turkish Super League 2020-2021 API!" });
});

app.use("/team", teamRouter);

app.use("/match", matchRouter);

app.use((req, res, next) => {
  next({ statusCode: 404, message: "Page not found!" });
});

app.use(errorMiddleware);

// Verileri çeker ve veritabanına kaydetme isteği yollar. 1 kere çalıştırılması yeterlidir.
// getData();

app.listen(port, hostname, () => {
  console.log(`App listening at http://${hostname}:${port} 🚀`);
});
