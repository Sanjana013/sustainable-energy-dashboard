const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

let predictedProcess = null;
let actualProcess = null;

router.post("/start", (req, res) => {
  if (predictedProcess || actualProcess) {
    return res.status(400).json({ message: "Simulation already running" });
  }

  const predictedPath = path.resolve(__dirname, "../scripts/simulator.py");
  const actualPath = path.resolve(__dirname, "../scripts/simulator_actual.py");

  predictedProcess = spawn("python", ["-u", predictedPath]);
  predictedProcess.stdout.on("data", (data) => {
    console.log(`[Predicted Simulator]: ${data.toString().trim()}`);
  });
  predictedProcess.stderr.on("data", (data) => {
    console.error(`[Predicted Error]: ${data.toString().trim()}`);
  });
  predictedProcess.on("exit", (code) => {
    console.log(`Predicted simulator exited with code ${code}`);
    predictedProcess = null;
  });

  actualProcess = spawn("python", ["-u", actualPath]);
  actualProcess.stdout.on("data", (data) => {
    console.log(`[Actual Simulator]: ${data.toString().trim()}`);
  });
  actualProcess.stderr.on("data", (data) => {
    console.error(`[Actual Error]: ${data.toString().trim()}`);
  });
  actualProcess.on("exit", (code) => {
    console.log(`Actual simulator exited with code ${code}`);
    actualProcess = null;
  });

  res.json({ message: "Simulation started" });
});

router.post("/stop", (req, res) => {
  if (!predictedProcess && !actualProcess) {
    return res.status(400).json({ message: "No simulation running" });
  }

  if (predictedProcess) {
    predictedProcess.kill("SIGINT");
    predictedProcess = null;
  }

  if (actualProcess) {
    actualProcess.kill("SIGINT");
    actualProcess = null;
  }

  res.json({ message: "Simulation stopped" });
});

module.exports = router;
