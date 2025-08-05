const express = require("express");
const { askGemini } = require("../agents/aiAgent");
const router = express.Router();

router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const response = await askGemini(query);
    res.json({ answer: response });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Gemini failed" });
  }
});

module.exports = router;
