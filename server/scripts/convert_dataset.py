import pandas as pd
import os


script_dir = os.path.dirname(os.path.abspath(__file__))
predict_script = os.path.join(script_dir, "predict.py")
dataset_path = os.path.join(script_dir, "../models/clean_power_data.csv")

df = pd.read_csv(dataset_path)

df1 = df.groupby('Date')['Global_active_power'].sum()

df2 = df.groupby('Date')['Global_active_power'].mean()

df3 = df.groupby('Date')['Global_active_power'].sum() / 24
df3 = df3.reset_index(name='Average_Global_Active_Power')

df3.to_csv('average_global_active_power_per_day.csv', index=False)