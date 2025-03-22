const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyName: { type: String, required: true },
  companyDescription: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyLocation: { type: String, required: true },
  jobtype: { type: String, required: true },
  salary: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who posted the job
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of users who applied
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
