const Influencer_db = require("../model/influencers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  };

// ----------------------Create Influencer--------------------------------

exports.createinfluencer = async(req,res)=>{
    console.log("Influencer creating function Triggered");
    const { 
        name, 
        no_of_followers, 
        instagram_username, 
        whatsappnumber, 
        location, 
        askamount, 
        email, 
        password, 
        target_Audience, 
        niche, 
        activated_date,   
        subscription_days_left,  
        expiry_date,
        selected_plan,
        freetrail_status,
        review,keywords,Description
} = req.body;


    try{
        const existingInfluencer = await Influencer_db.findOne({ email: email.toLowerCase() });
    if (existingInfluencer) {
      return res.status(409).json({ msg: "Email already exists!" });
    }
        
        let daysLeft = 0;
        if (freetrail_status) {
            daysLeft = 14;  // Free trial has 14 days
          } else {
            switch (selected_plan) {
              case "month":
                daysLeft = 30;  // 1 month plan
                break;
              case "six-months":
                daysLeft = 180;  // 6 months plan
                break;
              case "year":
                daysLeft = 365;  // 1 year plan
                break;
            case "no-plan":
                daysLeft = 0;  // 1 year plan
                break;
              default:
                daysLeft = 0;  // Default to 0 if no valid plan is selected
                break;
            }
          }  
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + daysLeft);
          const new_influencer = new Influencer_db({name, 
            no_of_followers, 
            instagram_username, 
            whatsappnumber, 
            location, 
            askamount, 
            email:email.toLowerCase(), 
            password, 
            target_Audience, 
            niche, 
            activated_date : activated_date ? new Date(activated_date) : null,   
            subscription_days_left: daysLeft,  
            expiry_date: expiryDate,
            selected_plan,
            freetrail_status,
            review,
            keywords,
            Description

          })


          

          const salt = await bcrypt.genSalt(10);
          new_influencer.password = await bcrypt.hash(password, salt);

        await new_influencer.save();
        const token = createToken(new_influencer._id);

    // Respond with success message, hotel details, and token
    res.status(201).json({ msg: "Hotel registered successfully", new_influencer, token });



    }
    catch(error){
        console.log(error)
        res.status(401).json({ err: "Somthing Went Wrong !", error });

    }
}

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