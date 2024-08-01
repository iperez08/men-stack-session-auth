import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import methodOverride from "method-override"
import logger from "morgan"
import session from "express-session"

import authCtrl from "./controllers/auth.js"

dotenv.config();
const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000"

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(logger('dev'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }));

// GET /
app.get("/", async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user
  })
});

app.get("/vip-lounge", async (req,res) => {
  if (req.session.user) {
    res.send("Welcome to the mainframe!")
  } 
  else {
    res.redirect("/auth/sign-in")
  }
})

app.use("/auth", authCtrl)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
