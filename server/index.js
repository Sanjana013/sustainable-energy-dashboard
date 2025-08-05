const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
app.use(cors());
app.use(express.json());

const streamRoute = require("./routes/stream");
app.use("/api/stream", streamRoute);

const geminiRoute = require("./routes/ai");
app.use("/api/ai", geminiRoute);

const simulationRoutes = require("./routes/simulation");
app.use("/api/simulation", simulationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
