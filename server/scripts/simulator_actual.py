import pandas as pd
import time
import json
import subprocess
import requests
import os

print("Simulator (Actual) started...", flush=True)

# Paths
script_dir = os.path.dirname(os.path.abspath(__file__))
predict_script = os.path.join(script_dir, "predict.py")
data_path = os.path.join(script_dir, "../models/average_global_active_power_per_day.csv")

# Load pre-aggregated actual consumption data
df = pd.read_csv(data_path)

# Ensure date format is correct
# df['Date'] = pd.to_datetime(df['Date']).dt.date

# Loop through each day's record and send it to backend
for _, row in df.iterrows():
    input_data = {
        # "Date": str(row["Date"]),
        "ActualConsumption": round(row["Average_Global_Active_Power"], 2)
    }

    print("Sending Actual:", input_data)

    try:
        process = subprocess.run(
            ["python", predict_script, json.dumps(input_data)],
            capture_output=True,
            text=True,
            check=True
        )

        result = json.loads(process.stdout.strip())

        payload = {
            "type": "actual",
            "input": input_data,
            # "predicted_energy": result["predicted_energy"],
            # "threshold": result["threshold"]
        }

        res = requests.post("https://sustainable-energy-dashboard.onrender.com/api/stream", json=payload)
        print("[Actual] Sent:", res.status_code, res.text)

    except subprocess.CalledProcessError as e:
        print("Error running predict.py:", e.stderr)
    except Exception as ex:
        print("Error sending data:", str(ex))

    time.sleep(5)

print("Simulation complete.")
