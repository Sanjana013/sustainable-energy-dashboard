// const express = require("express");
// const axios = require("axios");
// const { checkForAlert } = require("../agents/alertAgent");
// const { suggestOptimization } = require("../agents/optimizationAgent");
// const router = express.Router();
// const path = require("path");
// const dotenv = require("dotenv");
// dotenv.config({
//   path: path.resolve(__dirname, "../.env"),
// });

// let lastResult = {};

// router.post("/", (req, res) => {
//   //   const incoming = req.body;
//   const { predicted_energy, threshold, input } = req.body;

//   //   const actualConsumption = input.ActualConsumption || null;
//   //   const actualConsumption = input.ActualConsumption ?? null;
//   const actualConsumption = input.ActualConsumption;

//   console.log("Actual Energy from backend:", actualConsumption);

//   const alert = checkForAlert(predicted_energy, threshold);
//   const optimization = suggestOptimization(predicted_energy, threshold);

//   console.log("Received simulated data:", input);

//   lastResult = {
//     timestamp: new Date().toLocaleString(),
//     ...input,
//     ActualEnergyConsumption: actualConsumption,
//     predictedPower: predicted_energy,
//     alert,
//     optimization,
//   };

//   if (alert.includes("High Usage")) {
//     try {
//       axios.post(process.env.RELAY_WEBHOOK, {
//         email: "shotglassmist@gmail.com",
//         subject: "⚠️ Energy Alert: High Power Usage",
//         body: `🚨 Alert from Smart Energy Dashboard 🚨\n\n${alert}\n\n⏱ Timestamp: ${lastResult.timestamp}\n⚡ Predicted Power: ${predicted_energy} kW`,
//       });

//       console.log("Relay alert sent ");
//     } catch (err) {
//       console.error("Relay alert failed ", err.message);
//     }
//   }

//   res.status(200).json({ message: "Prediction received!" });
// });

// router.get("/latest", (req, res) => {
//   res.json(lastResult);
// });

// module.exports = router;

const express = require("express");
const axios = require("axios");
const { checkForAlert } = require("../agents/alertAgent");
const { suggestOptimization } = require("../agents/optimizationAgent");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const router = express.Router();

let lastResult = {};

router.post("/", async (req, res) => {
  const { type, input, predicted_energy, threshold } = req.body;

  console.log(`🔍 Incoming type: ${type}`);
  console.log(
    `📥 Received ${type === "actual" ? "ACTUAL" : "PREDICTED"} data:`,
    input
  );

  if (type === "actual") {
    lastResult.ActualEnergyConsumption = input.ActualConsumption;
    return res.status(200).json({ message: "Actual data received!" });
  }

  if (type === "predicted") {
    const alert = checkForAlert(predicted_energy, threshold);
    const optimization = suggestOptimization(predicted_energy, threshold);

    lastResult = {
      timestamp: new Date().toLocaleString(),
      ...input,
      predictedPower: predicted_energy,
      alert,
      optimization,
      ActualEnergyConsumption: lastResult.ActualEnergyConsumption || null, // preserve last actual value
    };

    if (alert.includes("High Usage")) {
      try {
        await axios.post(process.env.RELAY_WEBHOOK, {
          email: "shotglassmist@gmail.com",
          subject: "⚠️ Energy Alert: High Power Usage",
          body: `🚨 Alert from Smart Energy Dashboard 🚨\n\n${alert}\n\n⏱ Timestamp: ${lastResult.timestamp}\n⚡ Predicted Power: ${predicted_energy} kW`,
        });
        console.log("📧 Relay alert sent");
      } catch (err) {
        console.error("❌ Relay alert failed:", err.message);
      }
    }

    return res.status(200).json({ message: "Data received!" });
  }

  res.status(400).json({ message: "Invalid data type" });
});

router.get("/latest", (req, res) => {
  res.json(lastResult);
});

module.exports = router;
