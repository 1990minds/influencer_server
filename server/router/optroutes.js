const express = require("express");
const admin = require("../config/firebaseConfig");
const User = require("../models/User");
const router = express.Router();


router.post("/verify-login", async (req, res) => {
  const { idToken } = req.body; 

  try {
   
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number, email, name, picture } = decodedToken;

    
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        phone: phone_number,
        email,
        displayName: name,
        photoURL: picture,
      });
    }
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Error verifying OTP or user:", error);
    res.status(401).json({
      error: "Authentication failed. Please try again.",
    });
  }
});

module.exports = router;
