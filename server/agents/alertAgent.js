function checkForAlert(predictedPower, threshold) {
  if (predictedPower >= threshold) {
    return `High Usage Detected! Predicted: ${predictedPower} kW ≥ Threshold: ${threshold} kW`;
  }
  return `Power Levels are normal!`;
}

module.exports = { checkForAlert };
