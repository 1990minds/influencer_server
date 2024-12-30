const Hotel = require("../model/hotel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ----------------------Create Hotel--------------------------------

// exports.createhotel = async(req,res)=>{


//     console.log("Here creating Hotel With Below Details",req.body);
//     try {
//         const new_hotel = new Hotel(req.body);
//         await new_hotel.save();
//         res.status(201).json({ msg: "Hotel created successfully" });
//       }
//       catch(error){
//         console.log(error)
//         res.status(401).json({ err: "Somthing Went Wrong !", error });
//       }
// }

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};



exports.createhotel = async (req, res) => {
  console.log("hotel creating function triggered")
  const { 
    cafename, 
    phonenumber, 
    location, 
    instagram_id, 
    followers, 
    budget, 
    requirements, 
    email, 
    password, 
    activated_date, 
    freetrail_status, 
    selected_plan,   
    selected_plan_type,  
    TandC,
    locationlink,
  } = req.body;
  console.log()

  try {
    // Check if a hotel with the given email already exists
    const existingHotel = await Hotel.findOne({ email: email.toLowerCase() });
    if (existingHotel) {
      return res.status(409).json({ msg: "Email already exists!" });
    }

    // Default value for subscription_days_left if not provided
    let daysLeft = 0;
    
    // Calculate subscription days based on selected plan
    if (selected_plan_type === "free-trail") {
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
        case "":
          daysLeft = 0;
        default:
          daysLeft = 0;  // Default to 0 if no valid plan is selected
          break;
      }
    }

    // Set the expiry date based on the days left
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysLeft);

    // Create a new hotel instance with the provided data
    const hotel = new Hotel({
      cafename,
      phonenumber,
      location,
      instagram_id,
      followers,
      budget,
      requirements,

      TandC, // Store the T&C content
      email: email.toLowerCase(),
      activated_date: activated_date ? new Date(activated_date) : null,
      expiry_date: expiryDate,
      subscription_days_left: daysLeft,
      freetrail_status,
      selected_plan,         
      selected_plan_type: selected_plan_type,
      location_link: locationlink    
    });

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    hotel.password = await bcrypt.hash(password, salt);

    // Save the new hotel document to the database
    await hotel.save();

    // Generate a token for the new hotel
    const token = createToken(hotel._id);

    // Respond with success message, hotel details, and token
    res.status(201).json({ msg: "Hotel registered successfully", hotel, token });
  } catch (error) {
    console.error("Error during hotel registration:", error);
    res.status(500).json({ msg: "Something went wrong", error });
  }
};




// ----------------------Update Hotel--------------------------------

exports.updatehotel = async (req, res) => {
    console.log("Updating Hotel Here", req.body);
    try {
      
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,  
        req.body,       
        { new: true }     
      );
      if (!hotel) {
        return res.status(404).json({ msg: "Hotel not found" });
      }
      res.json({ msg: "Updated successfully", hotel });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong!", error });
    }
  };


//   -----------------------------Get One Hotel Details-------------------------------------

exports.getOnehotel= async (req, res) => {

    console.log("finding one hotel with this param", req.params.id);
    try {
      const hoteldetails = await Hotel.findById({ _id: req.params.id });
  
      res.status(201).json(hoteldetails);
    } catch (error) {
        console.log(error);
      res.status(401).json({ msg: "Somthing Went Wrong!" });
    }
  };


//   -----------------------------Get All Hotel Details-------------------------------------

  exports.getAllHotels = async (req, res) => {
    console.log("Getting all hotel Details")
    try {
      const hotels = await Hotel.find();
      res.status(200).json(hotels);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something Went Wrong!" });
    }
  };
  

//   -----------------------------Hotel Delete section-------------------------------------


exports.deletehotel = async (req, res) => {
    console.log("Delete Function Triggered");
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).json({ msg: "Hotel not found" });
        }
        res.status(200).json({
            msg: "Hotel data deleted successfully",
            deletedHotel: hotel
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something Went Wrong!" });
    }
};