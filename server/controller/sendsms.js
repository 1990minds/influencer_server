const axios = require('axios');

// Function to send SMS
const sendSMS = async (req, res) => {
    const { message } = req.body; // Accept numbers and message from the request body

    // Replace with your actual Fast2SMS API key
    const apiKey = 'wsIDiWuSuKaFZpGEyrMcbiAEy0aMaaxPJS54Ci6wc8Da0kdJ9F6ZvtySrXeF';

    // Payload for Fast2SMS API
    const payload = {
        sender_id: "FSTSMS",
        message: "226633",
        language: "english",
        route: "otp",
        numbers: "9703327719", // Comma-separated mobile numbers
    };
    console.log(payload)

    try {
        // Send request to Fast2SMS
        const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', payload, {
            headers: {
                authorization: apiKey,
                'Content-Type': 'application/json',
            },
        });

        // Respond with Fast2SMS API response
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    sendSMS,
};