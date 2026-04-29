import pandas as pd

def load_data():
    df = pd.read_csv("data/crop_data.csv")
    market_df = pd.read_csv("data/market_data.csv")

    # Normalize
    df["soil"] = df["soil"].str.lower()
    df["state"] = df["state"].str.lower()
    market_df["state"] = market_df["state"].str.lower()

    return df, market_df