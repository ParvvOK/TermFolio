const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  github: { type: String },
  production: { type: String },
});

const portfolioSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    gender: String,
    imageUrl: String,
    age: Number,
    role: String,
    locationPreference: String,
    availability: String,
    description: String,

    phone: String,
    email: String,
    socialLinks: [String],

    miscDescription: String,
    hobbies: [String],
    qualifications: [String],

    projects: [projectSchema],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
});

module.exports = {
  User: mongoose.model("User", userSchema),
  Portfolio: mongoose.model("Portfolio", portfolioSchema),
};
