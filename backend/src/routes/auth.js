const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../db/schema");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

router.post(
  "/auth",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be 8+ chars"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, {
          expiresIn: "180d",
        });
        return res.json({ message: "Logged in", token, user });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, SECRET_KEY, {
          expiresIn: "180d",
        });
        return res.json({ message: "Registered and logged in", token, user });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
