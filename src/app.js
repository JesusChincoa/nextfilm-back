const express = require("express");
const mongoose = require("mongoose");
const films = require("./routes/film_routes");
const seed = require("./routes/seed_route");
const users = require("./routes/user_routes");
const alt_films = require("./routes/film_alternative_routes")
const rentals = require("./routes/rental_routes");
const morgan = require("morgan");
const config = require("config");

const cors = require("cors");


mongoose
  .connect(config.get('configDB.HOST'))
  .then(() => console.log("Connecting to MongoDB"))
  .catch((err) => console.error("error connecting MongoDB", err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'))
    console.log('Morgan está habilitado')
}

app.use(
  cors()
);
app.use("/api", alt_films);
app.use("/api/auth", users);
app.use("/api", films);
app.use("/api/database", seed);
app.use("/api/rental", rentals)

app.listen(3000, () => {
  console.log("API Express Listening...");
});
