import pandas as pd

def feature_conversion(df):
    # Convert categorical columns to appropriate data types
    categorical_cols = ['DayOfWeek', 'Holiday', 'HVACUsage', 'LightingUsage']
    df[categorical_cols] = df[categorical_cols].astype('category')

    # Create a new feature: TotalUsage
    df['TotalUsage'] = df['HVACUsage'].cat.codes + df['LightingUsage'].cat.codes

    # Convert categorical variables to dummy variables
    df_encoded = pd.get_dummies(df, drop_first=True)

    return df_encoded
