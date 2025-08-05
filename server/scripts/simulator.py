# import pandas as pd
# import time
# import json
# import subprocess
# import requests
# import os

# print("Simulator started...")

# DATASET_PATH = os.path.join(os.path.dirname(__file__), "../models/Energy_consumption_dataset.csv")
# df = pd.read_csv(DATASET_PATH)

# script_dir = os.path.dirname(os.path.abspath(__file__))
# predict_script = os.path.join(script_dir, "predict.py")

# for _, row in df.iterrows():
#     input_data = row.to_dict()

#     try:
#         process = subprocess.run(
#             ["python", predict_script, json.dumps(input_data)],
#             capture_output=True,
#             text=True,
#             check=True
#         )

#         result = json.loads(process.stdout.strip())
        
#         payload = {
#             "input": input_data,
#             "predicted_energy": result["predicted_energy"],
#             "threshold": result["threshold"]
#         }


#         res = requests.post("http://localhost:5000/api/stream", json=payload)
#         print("Sent to backend:", res.status_code, res.text)

#     except subprocess.CalledProcessError as e:
#         print("Error calling predict.py:", e.stderr)
#     except Exception as ex:
#         print("Error:", str(ex))

#     time.sleep(5)

# # input("Simulation complete. Press Enter to exit.")


import pandas as pd
import time
import json
import subprocess
import requests
import os

print("Simulator (Predicted) started...", flush=True)

script_dir = os.path.dirname(os.path.abspath(__file__))
predict_script = os.path.join(script_dir, "predict.py")
dataset_path = os.path.join(script_dir, "../models/Energy_consumption_dataset.csv")

df = pd.read_csv(dataset_path)

for _, row in df.iterrows():
    input_data = row.to_dict()

    try:
        process = subprocess.run(
            ["python", predict_script, json.dumps(input_data)],
            capture_output=True,
            text=True,
            check=True
        )

        result = json.loads(process.stdout.strip())

        payload = {
            "type": "predicted",
            "input": input_data,
            "predicted_energy": result["predicted_energy"],
            "threshold": result["threshold"]
        }

        print("Sending Predicted:", payload, flush=True)
        res = requests.post("http://localhost:5000/api/stream", json=payload)
        print("[Predicted] Sent:", res.status_code, res.text)

    except subprocess.CalledProcessError as e:
        print("Error in predict.py:", e.stderr)
    except Exception as ex:
        print("Error:", str(ex))

    time.sleep(5)

