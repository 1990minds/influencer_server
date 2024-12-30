exports.loginSuccess = (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: req.user,
      });
    } else {
      res.status(403).json({ success: false, message: "Not authenticated" });
    }
  };
  
  exports.logout = (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  };
  