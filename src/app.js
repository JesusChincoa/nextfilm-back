const express = require("express");
const mongoose = require("mongoose");
const films = require("./routes/film_routes");
const seed = require("./routes/seed_route");
const users = require("./routes/user_routes");
const alt_films = require("./routes/film_alternative_routes")
// const cors = require("cors");

mongoose
  .connect("mongodb://localhost:27017/nextfilm")
  .then(() => console.log("Connecting to MongoDB"))
  .catch((err) => console.error("error connecting MongoDB", err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:4200", // a modificar mas tarde
//   })
// );
app.use("/api", alt_films);
app.use("/api/auth", users);
app.use("/api", films);
app.use("/api/database", seed);

app.listen(3000, () => {
  console.log("API Express Listening...");
});
