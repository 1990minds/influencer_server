const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelschema = new Schema({
  cafename: {
    type: String,
    trim: true,
    required: [true, "is required"],
  },
  phonenumber: {
    type: Number,
    trim: true,
  },

  location: {
    type: String,
    trim: true,
  },
  instagram_id: {
    type: String,
    trim: true,
  },
  followers: {
    type: Number,
    trim: true,
  },
  budget: {
    type: Number,
    trim: true,
  },
  requirements: {
    type: String,
    trim: true,
  },
  TandC:{
        type: String,
        trim:true

  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "is required"],
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
    enum: ["month","year","six-months",""],

  },
  selected_plan_type: {
    type: String,
    enum: ["Basic", "premium", "free-trail"],
    
  },

  freetrail_status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Hotel", hotelschema);
