function suggestOptimization(predictedPower, threshold) {
  if (predictedPower >= threshold + 15) {
    return "Critical usage detected. Consider turning off high-power devices like HVAC or washing machines. Schedule them during off-peak hours (10PM–6AM)!";
  } else if (predictedPower >= threshold + 5) {
    return "High usage. Use energy-saving modes on appliances. Avoid running multiple heavy appliances together.";
  } else if (predictedPower >= threshold) {
    return "Slightly above optimal. Try unplugging idle chargers and reducing lighting intensity.";
  } else if (predictedPower >= threshold - 5) {
    return "Good job! You're consuming energy efficiently. Keep up the balanced usage.";
  } else {
    return "Excellent! Your usage is well below average. You might want to explore using your renewable sources more effectively!";
  }
}

module.exports = {
  suggestOptimization,
};
