const Influencer_db = require("../model/influencers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fast2sms = require("fast-two-sms");


const maxAge = 300 * 24 * 60 * 60;


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
// ----------------------Create Influencer--------------------------------

// exports.createinfluencer = async(req,res)=>{
//     console.log("Influencer creating function Triggered");
//     const { 
//         name, 
//         no_of_followers, 
//         instagram_username, 
//         whatsappnumber, 
//         location, 
//         askamount, 
//         email, 
//         password, 
//         target_Audience, 
//         niche, 
//         activated_date,   
//         subscription_days_left,  
//         expiry_date,
//         selected_plan,
//         freetrail_status,
//         review,keywords,Description
// } = req.body;


//     try{
//         const existingInfluencer = await Influencer_db.findOne({ email: email.toLowerCase() });
//     if (existingInfluencer) {
//       return res.status(409).json({ msg: "Email already exists!" });
//     }
        
//         let daysLeft = 0;
//         if (freetrail_status) {
//             daysLeft = 14;  // Free trial has 14 days
//           } else {
//             switch (selected_plan) {
//               case "month":
//                 daysLeft = 30;  // 1 month plan
//                 break;
//               case "six-months":
//                 daysLeft = 180;  // 6 months plan
//                 break;
//               case "year":
//                 daysLeft = 365;  // 1 year plan
//                 break;
//             case "no-plan":
//                 daysLeft = 0;  // 1 year plan
//                 break;
//               default:
//                 daysLeft = 0;  // Default to 0 if no valid plan is selected
//                 break;
//             }
//           }  
//           const expiryDate = new Date();
//           expiryDate.setDate(expiryDate.getDate() + daysLeft);
//           const new_influencer = new Influencer_db({name, 
//             no_of_followers, 
//             instagram_username, 
//             whatsappnumber, 
//             location, 
//             askamount, 
//             email:email.toLowerCase(), 
//             password, 
//             target_Audience, 
//             niche, 
//             activated_date : activated_date ? new Date(activated_date) : null,   
//             subscription_days_left: daysLeft,  
//             expiry_date: expiryDate,
//             selected_plan,
//             freetrail_status,
//             review,
//             keywords,
//             Description

//           })


          

//           const salt = await bcrypt.genSalt(10);
//           new_influencer.password = await bcrypt.hash(password, salt);

//         await new_influencer.save();
//         const token = createToken(new_influencer._id);

//     // Respond with success message, hotel details, and token
//     res.status(201).json({ msg: "Hotel registered successfully", new_influencer, token });



//     }
//     catch(error){
//         console.log(error)
//         res.status(401).json({ err: "Somthing Went Wrong !", error });

//     }
// }


exports.createinfluencer = async(req,res)=>{
    console.log("Here creating Influencer With Below Details",req.body);
    try{
        const new_influencer = new Influencer_db(req.body);
        await new_influencer.save();
        res.status(201).json({ msg: "Influencer created successfully, Please Login to Continue" });

    }
    catch(error){
        console.log(error);
        res.status(401).json({ err: "Somthing Went Wrong !", error });
    }
};


// ---------------------- Update Influencer--------------------------------

exports.updateinfluencer= async(req,res)=>{
    console.log("Influencer updating function Triggered");
    try{
        const influencer = await Influencer_db.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        if(!influencer){
            return res.status(404).json({message:"Influencer not found"});
        }
        res.status(200).json({message:"Influencer updated successfully"});

    }
    catch(error){
        console.log(error);
        res.status(401).json({ err: "Somthing Terrible hapened !", error });
    }
}



exports.updatedaysleft= async (req,res)=>{
    console.log("Days left Updating function triggered");
    
}


// ----------------------Get Specific Influencer--------------------------------


exports.getone_influencer_details = async (req,res)=>{
    console.log("Influencer getting function Triggered");
    try{
        const influencer_details = await Influencer_db.findById({_id:req.params.id});
        if(!influencer_details){
            return res.status(404).json({message:"Influencer not found"});
        }
        res.status(200).json(influencer_details);
        
    }
    catch(err){
        console.log(err);
        res.status(401).json({ err: "Somthing Went Wrong !", err });
    }
}


// ----------------------Get All Influencer--------------------------------


exports.get_all_influencers_details = async(req,res)=>{
    console.log("All Influencers Details getting function Triggered");
    try{
        const influencers = await Influencer_db.find();
        res.status(200).json(influencers);

    }
    catch(error){
        console.log(error);
        res.status(500).json({ msg: "Something Went Wrong!" });
    
    }
}


//   -----------------------------Influencer  Delete section-------------------------------------
exports.deleteinfluencer = async (req, res) => {
    console.log("Delete influencer Function Triggered");
    try {
        const influencer = await Influencer_db.findByIdAndDelete(req.params.id);
        if (!influencer) {
            return res.status(404).json({ msg: "Influencer not found" });
        }
        res.status(200).json({
            msg: "influencer data deleted successfully",
            deleted_influencer: influencer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something Went Wrong!" });
    }
};




let generatedOTP = "";



// Function to generate OTP
function generateOTP() {
  const length = 6;
  const charset = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    otp += charset[randomIndex];
  }
  return otp;
}



exports.addReviewForInfluencer = async (req, res) => {
  const { review } = req.body;  
  const { id } = req.params;     

  try {
    console.log("Request body:", req.body);
    console.log("Influencer ID:", id);

  
    if (typeof review !== 'number' || review < 1 || review > 5) {
      return res.status(400).json({ err: "Review must be a number between 1 and 5." });
    }

    
    const influencer = await Influencer_db.findById(req.params.id);

    if (!influencer) {
      return res.status(404).json({ err: "Influencer not found" });
    }

    
    influencer.review.push(review);
    await influencer.save();
    return res.status(200).json({ message: "Review added successfully", influencer });

  } catch (error) {
    console.error("Error in addReviewForInfluencer:", error);
    return res.status(500).json({ err: "Something went wrong!!", details: error.message });
  }
};




exports.getOneInfluencerFromEmail = async (req, res) => {
  const email = req?.body?.email;

  try {
    console.log("Request body:", req.body);

    // Fetch influencer by email address
    const influencer = await Influencer_db.findOne({ email: email });
    const token = createToken(influencer?._id);

    if (!influencer) {
      return res.status(404).json({ err: "Email not registered" });
    }

    // If influencer found, return their data
    return res.status(200).json({ influencer,token });
    
  } catch (error) {
    console.error("Error in getOneInfluencerFromEmail:", error);
    return res.status(500).json({ err: "Something went wrong!!", details: error.message });
  }
};


exports.getOneInfluencerFromPhone = async (req, res) => {
  const phone = req?.body?.phone;

  try {
    console.log("Request body:", req.body);

    // Fetch influencer by email address
    const influencer = await Influencer_db.findOne({ phone_number: phone  });
    const token = createToken(influencer?._id);

    if (!influencer) {
      return res.status(404).json({ err: "Phone not registered" });
    }

    // If influencer found, return their data
    return res.status(200).json({ influencer,token });
    
  } catch (error) {
    console.error("Error in getOneInfluencerFromEmail:", error);
    return res.status(500).json({ err: "Something went wrong!!", details: error.message });
  }
};


exports.getOneInfluencerForOTP = async (req, res) => {
  const number = req?.body?.phone_no;
  const generatedOTP = generateOTP();


  try {
    console.log("Request body:", req.body);

    // Fetch influencer by phone number
    const influencer = await Influencer_db.findOne({ phone_number: number });
    // const updateotp = await Influencer_db.findOneAndUpdate({ phone_number: number }, {$set:{otp:generatedOTP}},{new:true})

    if (!influencer) {
      return res.status(404).json({ err: "Phone number not registered" });
    }

    const indianPhoneNumber = influencer?.phone_number;

    // Generate OTP
    console.log("Generated OTP:", generatedOTP);


    await Influencer_db.findOneAndUpdate(
      { phone_number: number },
      { $set: { otp: generatedOTP } },
      { new: true }
    );

    // Sending OTP using fast-two-sms
    const options = {
      authorization: "WEVsdhUKp6Juo1U2iHl4dsKulNuLnXH8TQJQnNkx0uxnenGWTWM7oInTLaF7", // Your Fast2SMS API Key
      message: `Hi Influencer, this OTP is sent by Starsync. Your OTP is ${generatedOTP} and it will be valid for 2 minutes.`,
      numbers: [indianPhoneNumber],
    };

    const response = await fast2sms.sendMessage(options);

    // Handling response
    console.log("Fast2SMS Response:", response);

    if (response?.return === true) {
      return res.status(200).json({ message: "OTP sent successfully", otp: generatedOTP });
    } else {
      return res.status(500).json({ err: "Failed to send OTP. Unexpected response from Fast2SMS.", details: response });
    }
  } catch (error) {
    console.error("Error in getOneInfluencerForOTP:", error);
    return res.status(500).json({ err: "Something went wrong!!", details: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
    try {
   
      const { enteredOTP } = req.body;
      const number = req?.body?.phone_number;
      const influencer = await Influencer_db.findOne({ phone_number: number });
      console.log(number,"and",enteredOTP,"and ---<>",influencer)
      const enteredotpnumber = Number(enteredOTP)
  
      if (enteredotpnumber === influencer?.otp) {
        await Influencer_db.findOneAndUpdate(
          { phone_number: number },
          { $set: { otp: 0 } },
          { new: true }
        );     
         
        const token = createToken(influencer?._id);
  

        res.status(201).json({ msg: "Login Successfully", token, influencer });
      } else {
        // OTcP is incorrect
        console.log(res)
  
        return res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      // Handle any errors

      return res
        .status(500)
        .json({ error: "Something went wrong", details: error.message });
    }
  };
// ---------------------------------Authenticate process----------------------------------------------------



  // exports.isAuthenticate = async (req, res, next) => {
  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith("Bearer")
  //   ) {
  //     try {
  //       let token = req.headers.authorization.split(" ")[1];
  //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //       req.dealer = await Dealer.findById(decoded.id).select("-password");
  //       next();
  //     } catch (error) {
  //       res.status(401).json({ error: error.message });
  //     }
  //   } else {
  //     res.status(500).json({ msg: "UnAutherized Access" });
  //   }
  // };

  exports.combinedAuth = async (req, res, next) => {
    try {
      
      // For session-based authentication
      if (req.isAuthenticated && req.isAuthenticated()) {
        return next(); // User is authenticated via session
      }
  
      // For token-based authentication
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Attach user (dealer) to request
        req.dealer = await Dealer.findById(decoded.id).select("-password");
        if (!req.dealer) {
          return res.status(404).json({ msg: "Dealer not found" });
        }
  
        return next(); // User is authenticated via token
      }
  
      // If neither method works
      res.status(403).json({ msg: "Not authenticated" });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
  
  
  