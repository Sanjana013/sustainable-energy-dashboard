import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import PowerChart from "./components/powerChart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [showGemini, setShowGemini] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  // const [startSimulation, stopSimulation] = useState(false);

  const handleStartSimulation = async () => {
    try {
      await axios.post(
        "https://sustainable-energy-dashboard.onrender.com/api/simulation/start"
      );
      toast.success("Sample simulation started");
      setIsRunning(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start simulation");
    }
  };

  const handleStopSimulation = async () => {
    try {
      await axios.post(
        "https://sustainable-energy-dashboard.onrender.com/api/simulation/stop"
      );
      toast.info("Simulation stopped");
      setIsRunning(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to stop simulation");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://sustainable-energy-dashboard.onrender.com/api/stream/latest"
        );
        setData(res.data);

        if (
          res.data.timestamp &&
          res.data.predictedPower &&
          res.data.EnergyConsumption
        ) {
          const time = new Date().toLocaleTimeString();
          setChartData((prev) =>
            [
              ...prev,
              {
                time,
                predicted: res.data.predictedPower,
                actual: res.data.EnergyConsumption,
              },
            ].slice(-10)
          );
        }

        if (res.data.alert?.includes("High Usage")) {
          toast.warn(`High Usage Detected, Mail Sent!`, {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };

    if (isRunning) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const askGemini = async () => {
    try {
      const res = await axios.post(
        "https://sustainable-energy-dashboard.onrender.com/api/ai",
        {
          query: userQuery,
        }
      );
      setGeminiResponse(res.data.answer);
    } catch (err) {
      setGeminiResponse("Failed to get response from Gemini.");
    }
  };

  return (
    <div className="container">
      <h1>⚡ Smart Energy Dashboard</h1>
      <div className="gemini-controls">
        {!isRunning ? (
          <button onClick={handleStartSimulation}>Run Sample Simulation</button>
        ) : (
          <button onClick={handleStopSimulation}>Stop Simulation</button>
        )}
      </div>

      <div className="main-content">
        <div className="message-box">
          <h2>Hey Sanjana 🌟</h2>
          <p>
            You're making a real impact! Your energy choices today = a greener
            planet tomorrow 🌍
          </p>
        </div>
        <button
          className="open-gemini-btn"
          onClick={() => setShowGemini(!showGemini)}
        >
          Get Free Tips
        </button>
        <div className="dashboard-grid">
          <div className="left-cards">
            <div className="card">
              <h3>Predicted Power Consumption</h3>
              <p>{data.predictedPower} kW</p>
            </div>
            <div className="card">
              <h3>Actual Power Consumption</h3>
              <p>{data.ActualEnergyConsumption} kW</p>
            </div>
            <div
              className={`card ${
                data.alert?.includes("High Usage") ? "alert-active" : ""
              }`}
            >
              <h3>Alert</h3>
              <p>{data.alert}</p>
            </div>

            <div className="card">
              <h3>Optimization</h3>
              <p>{data.optimization}</p>
            </div>
          </div>
          <div className="right-charts">
            <div className="card">
              <h3>Predicted vs Actual Power</h3>
              <PowerChart data={chartData} />
            </div>
          </div>
        </div>
      </div>

      {showGemini && (
        <div className="gemini-float">
          <span onClick={() => setShowGemini(false)} className="close-gemini">
            ×
          </span>
          <h3>Ask Gemini</h3>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="get more sustainability tips..."
          />
          <button onClick={askGemini}>Ask</button>

          {geminiResponse && (
            <div className="gemini-response">{geminiResponse}</div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
