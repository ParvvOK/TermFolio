const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth.js");
const dataRoutes = require("./src/routes/auth.js");
const exportFull = require("./src/ssr/exportFull.js");
const port = 3000;
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) =>
  console.error("MongoDB connection error:", err),
);

app.use("/api", authRoutes);
app.use("/data", dataRoutes);
app.use("/export", exportFull);

app.listen(port, () => console.log(`Server running on port ${port}`));
