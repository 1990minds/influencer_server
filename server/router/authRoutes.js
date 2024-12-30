const router = require("express").Router();
const passport = require("passport");

// Login success handler
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user, // Send the full user data from Google profile
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

// Login failure handler
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

// Google login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_SUCCESS_URL || "http://localhost:3000/postloginhome", 
    failureRedirect: process.env.CLIENT_FAILURE_URL || "/login/failed", 
  })
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    console.log(res)
    res.send("http://localhost:3000"); 
  });
});

router.get("/user", (req, res) => {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: "User found",
        user: req.user,  // Send the user data to the client
      });
    } else {
      res.status(401).json({
        error: true,
        message: "Not authorized",
      });
    }
  });

  

  router.get("/check-auth", (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({
        authenticated: true,
        user: req.user, // You can return the user details here
      });
    } else {
      res.status(403).json({
        authenticated: false,
        message: "Not authenticated",
      });
    }
  });
module.exports = router;
