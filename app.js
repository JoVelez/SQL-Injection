const sqlite3 = require("sqlite3").verbose();
const http = require("http"),
 path = require("path"),
express = require("express"),
bodyParser = require("body-parser");
const app = express();
app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");
db.serialize(function () {
  db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
  db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

//GET method route to '/' that will send our HTML file to the browser

app.get("/", function (req, res) {
  res.sendFile("index.html");
});

// Declare a variable query and set it equal to a SQL query that utilizes the username and password we collected from the request object.
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let query =
    "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";

//go ahead and separately console.log() the username, password, and the SQL query string.
    console.log(username);
    console.log(password);
    console.log(query);

// let's run a sqlite method db.get() in order to verify our log in and handle errors in the event of invalid log in:
  db.get(query, function (err, row) {
    if (err) {
      console.log("ERROR", err);
      res.redirect("/index.html#error");
    } else if (!row) {
      res.redirect("/index.html#unauthorized");
    } else {
      res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
    }
  });
});

//Our last step is to call app.listen(), passing in a port of our choosing.
app.listen(3000);

