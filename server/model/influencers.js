const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Influencers_schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "is required"],
  },
  phone_number: {
    type: Number,
    trim: true,
    required:[true,"is required"]
  },
  email: {
    type: String,
    trim: true,
    
  },
  otp:{
    type:Number,
    trim:true,
    
  },
  instagram_username: {
    type: String,
    trim: true,
    
  },
  no_of_followers: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  askamount: {
    type: Number,
    trim: true,
  },
  target_Audience: {
    type: String,
    trim: true,
  },
  niche: {
    type: String,
    trim: true,
  }, 
  review:{
    type: [Number],
    
  },
  keywords:{
    type:[String],

  },
  Description:{
    type:String,
  },
});

module.exports = mongoose.model("Influencers", Influencers_schema);
