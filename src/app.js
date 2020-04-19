const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { geocode } = require("./utils/geocode");
const { forecast } = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs"); // start hbs
app.set("views", viewsPath); // changing hbs default views folder to another directory
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Setup to use bootstrap
app.use(
  "/jquery/js",
  express.static(path.join(__dirname + "../../node_modules/jquery/dist"))
);
app.use(
  "/bootstrap/css",
  express.static(path.join(__dirname + "../../node_modules/bootstrap/dist/css"))
);
app.use(
  "/bootstrap/js",
  express.static(path.join(__dirname + "../../node_modules/bootstrap/dist/js"))
);

app.get("/", (req, res) => {
  res.render("index", { title: "WakeyCast", name: "Zguang" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "WakeyCast", name: "Zguang" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "WakeyCast",
    name: "Zguang",
    helpText: "This is a helpful text.",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address.",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "Search term is required",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: 404,
    name: " Zguang",
    errorMessage: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: 404,
    name: " Zguang",
    errorMessage: "Page not found.",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
