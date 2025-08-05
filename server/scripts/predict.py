from utils import feature_conversion
import sys
import json
import pandas as pd
import joblib
import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
model = joblib.load(os.path.join(BASE_DIR, "models", "energy_model.pkl"))
training_columns = joblib.load(os.path.join(BASE_DIR, "models", "training_columns.pkl"))
# conversion = joblib.load(os.path.join(BASE_DIR, "models", "conversion.pkl"))
dataset = pd.read_csv(os.path.join(BASE_DIR, "models", "Energy_consumption_dataset.csv"))

mean = dataset["EnergyConsumption"].mean()
std = dataset["EnergyConsumption"].std()
threshold = mean + std

input_json = sys.argv[1]
input_data = json.loads(input_json)


df = pd.DataFrame([input_data])
df = pd.get_dummies(df)


for col in training_columns:
    if col not in df.columns:
        df[col] = 0
df = df[training_columns]


prediction = model.predict(df)[0]
print("DEBUG - Input received in predict.py:", input_data, file=sys.stderr)

print(json.dumps({ "predicted_energy": round(prediction, 3), "threshold": round(threshold, 3),
    "input": input_data }))
