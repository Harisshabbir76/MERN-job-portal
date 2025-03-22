const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  role: {
    type: String,
    enum: ["Looking for job", "Hiring job"], // Ensure only valid roles
    required: true,
  },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Jobs user applied to
  postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Jobs user has posted
  skills: [String], 
  linkedin: String, 
  portfolio: String, 
  phone: String, 
  education: {
    institution: String, 
    degree: String, 
    year: Number, 
  },
});

module.exports = mongoose.model("User", UserSchema);
