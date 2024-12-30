const axios = require('axios');


const apiKey = "wsIDiWuSuKaFZpGEyrMcbiAEy0aMaaxPJS54Ci6wc8Da0kdJ9F6ZvtySrXeF"


const sendOTPSMS = async (indianPhoneNumber, generatedOTP) => {
  try {
 
    const message = `Your OTP to log in into Startsync Influencer account is ${generatedOTP}. Please use it to verify your account, Do not share it with anyone it is Confidential🤘🏻`;

    const response = await axios.get(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'otp',
        message,
        indianPhoneNumber,
 
      },
      {
        headers: {
          authorization: apiKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send OTP SMS');
  }
};

module.exports = { sendOTPSMS };
