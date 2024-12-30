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
const bodyParser = require("body-parser") 

const hotel = require("./server/router/hotel");
const influencer = require("./server/router/influencers")
const assignments = require("./server/router/assignment");
const authRoutes = require("./server/router/authRoutes");
const otpstuff = require("./server/router/sendsms")

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

// app.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.COOKEY_KEY],
//   })
// );
// app.use(
// 	cors({
// 		origin: "https://starsync-fc893.web.app",
// 		methods: "GET,POST,PUT,DELETE",
// 		credentials: true,
// 	})
// );

// const allowedOrigins = [
//   "http://localhost:3001",
//   "https://starsync-fc893.web.app/",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true); // Allow the request
//       } else {
//         callback(new Error("Not allowed by CORS")); // Reject the request
//       }
//     },
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );


app.use(bodyParser.json())
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
  callbackURL: "http://localhost:5000/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
  }
  )
  );
passport.serializeUser((user, done) => done (null, user));
passport.deserializeUser((user, done) => done (null, user));

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

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
    app.use("/auth", authRoutes);
    app.use("/api", otpstuff);
    
    const server = app.listen(PORT);
    console.log("Server is running on ", PORT)

   
  })
  .catch((err) => console.log(err));
