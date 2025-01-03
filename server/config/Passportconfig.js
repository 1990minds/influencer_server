const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const hotel = require("./server/router/hotel");
const influencer = require("./server/router/influencers")
const assignments = require("./server/router/assignment");

dotenv.config();
const PORT = process.env.PORT || 6000;


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: "500" })
);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKEY_KEY],
  })
);

app.use(
  session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  })
  );


app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy (
  {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
  }
  )
  );
passport.serializeUser((user, done) => done (null, user));
passport.deserializeUser((user, done) => done (null, user));


mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connected sucessfully");


    app.use("/api",hotel);
    app.use("/api",influencer);
    app.use("/api",assignments);
    
    const server = app.listen(PORT);
    console.log("Server is running oon ", PORT)

   
  })
  .catch((err) => console.log(err));
