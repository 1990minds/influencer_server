const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  visit_status: {
    type: Boolean,
    default: false,
  },
  video_upload_status: {
    type: Boolean,
    default: false,
  },
  review_status: {
    type: Boolean,
    default: false,
  },
});

const AssignmentSchema = new Schema({
  cafe: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  influencer: {
    type: Schema.Types.ObjectId,
    ref: "Influencers",
    required: true,
  },
  assigned_date: {
    type: Date,
    default: Date.now,
  },
  visit_date: {
    type: Date,
  },
  all_status: {
    type: StatusSchema,
    default: () => ({}),
  },
  deal_amount_for_collab: {
    type: Number,
    default: 0,
  },
  amount_paid_status: {
    type: Boolean,
    default: false,
  },
  post_collab_comments: {
    type: String,
    required: false,
  },
},{timestamps:true,createdAt: 'createdAt', updatedAt: 'updatedAt'});

module.exports = mongoose.model("Assignment", AssignmentSchema);
