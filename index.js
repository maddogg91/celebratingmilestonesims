const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");


app.set("views", path.join(__dirname, "templates"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "templates/index.html"));
});

app.get("/about", function(req, res) {
  res.sendFile(path.join(__dirname, "templates/about.html"));
});

app.get("/media", function(req, res) {
  res.sendFile(path.join(__dirname, "templates/media.html"));
});

const port = 8000;

app.listen(port, () => {
  // Code.....
})
