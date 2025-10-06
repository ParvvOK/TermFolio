const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { User, Portfolio } = require("../db/schema");

router.get("/get", authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/portfolio", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    let {
      name,
      imageUrl,
      age,
      gender,
      role,
      description,
      socialLinks,
      locationPreference,
      availability,
      miscellaneous,
      hobbies,
      phone,
      project,
      qualifications,
    } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Portfolio name is required" });
    }

    hobbies = Array.isArray(hobbies)
      ? hobbies
      : typeof hobbies === "string"
      ? hobbies
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean)
      : [];

    qualifications = Array.isArray(qualifications)
      ? qualifications
      : typeof qualifications === "string"
      ? qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean)
      : [];

    socialLinks = Array.isArray(socialLinks)
      ? socialLinks
      : typeof socialLinks === "string"
      ? socialLinks
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    let projects = [];
    if (project && project.name && project.name.trim() !== "") {
      projects.push(project);
    }

    let portfolio = await Portfolio.findOne({ owner: userId });

    if (portfolio) {
      portfolio.name = name;
      portfolio.imageUrl = imageUrl;
      portfolio.age = Number(age);
      portfolio.gender = gender;
      portfolio.role = role;
      portfolio.description = description;
      portfolio.socialLinks = socialLinks;
      portfolio.locationPreference = locationPreference;
      portfolio.availability = availability;
      portfolio.miscellaneous = miscellaneous;
      portfolio.hobbies = hobbies;
      portfolio.qualifications = qualifications;
      portfolio.phone = phone;
      portfolio.projects = projects;
      portfolio.updatedAt = Date.now();

      await portfolio.save();
      return res.json({ message: "Portfolio updated", portfolio });
    } else {
      portfolio = new Portfolio({
        owner: userId,
        name,
        imageUrl,
        age: Number(age),
        gender,
        role,
        description,
        socialLinks,
        locationPreference,
        availability,
        miscellaneous,
        hobbies,
        qualifications,
        phone,
        projects,
      });

      await portfolio.save();
      await User.findByIdAndUpdate(userId, { portfolio: portfolio._id });

      return res.json({ message: "Portfolio created", portfolio });
    }
  } catch (err) {
    console.error("Portfolio save error:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

router.get("/portfolio", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolio = await Portfolio.findOne({ owner: userId });
    if (!portfolio)
      return res.status(404).json({ error: "Portfolio not found" });

    return res.json({ portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
