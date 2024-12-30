const express = require('express');
const { sendSMS } = require('../controller/sendsms'); // Import the controller

const router = express.Router();

// POST route to send SMS
router.get('/send-sms', sendSMS);

module.exports = router;