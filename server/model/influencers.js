const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Influencers_schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "is required"],
  },
  no_of_followers: {
    type: String,
    trim: true,
  },
  instagram_username: {
    type: String,
    trim: true,
    unique: true,
  },
  whatsappnumber: {
    type: Number,
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
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
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
  activated_date: {
    type: Date,
    default: Date.now,
  },
  subscription_days_left: {
    type: Number,
    default: 0,
  },
  expiry_date: {
    type: Date,
  },
  selected_plan: {
    type: String,
    enum: ["month", "year", "six-months","no-plan"],
    default:"month",
  },

  freetrail_status: {
    type: Boolean,
    default: false,
  },
  review:{
    type: [Number],
    
  },keywords:{
    type:[String],

  },
  Description:{
    type:String,
  },
});

module.exports = mongoose.model("Influencers", Influencers_schema);
