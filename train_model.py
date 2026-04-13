"""
train_model.py — Train and save the Random Forest delay predictor.

Usage:
    python train_model.py                  # uses default dataset path
    python train_model.py --data data.csv  # custom CSV path
"""

import argparse
import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score


FEATURE_COLS = [
    "previous_delay_min",
    "distance_km",
    "scheduled_hour",
    "day_of_week",
    "is_peak_hour",
    "is_weekend",
]
TARGET_COL = "actual_delay_min"
MODEL_DIR = "model"
MODEL_PATH = os.path.join(MODEL_DIR, "train_delay_model.pkl")


def is_peak_hour(hour: int) -> int:
    return int(hour in range(7, 10) or hour in range(17, 20))


def load_and_engineer(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)

    required = {"previous_delay_min", "distance_km", "scheduled_hour", "day_of_week", TARGET_COL}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"CSV missing columns: {missing}")

    df["is_peak_hour"] = df["scheduled_hour"].apply(is_peak_hour)
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
    df[TARGET_COL] = df[TARGET_COL].clip(lower=0)

    return df


def generate_synthetic_data(n: int = 5000) -> pd.DataFrame:
    """Generate synthetic training data when no CSV is provided."""
    rng = np.random.default_rng(42)
    hours = rng.integers(0, 24, n)
    days = rng.integers(0, 7, n)
    distances = rng.uniform(10, 600, n)
    prev_delays = rng.exponential(5, n).clip(0, 120)

    peak = np.array([is_peak_hour(h) for h in hours])
    weekend = (days >= 5).astype(int)

    # Approximate real-world delay factors
    noise = rng.normal(0, 3, n)
    actual_delay = (
        0.4 * prev_delays
        + 0.01 * distances
        + 4 * peak
        - 2 * weekend
        + noise
    ).clip(0)

    return pd.DataFrame({
        "previous_delay_min": prev_delays,
        "distance_km": distances,
        "scheduled_hour": hours,
        "day_of_week": days,
        "is_peak_hour": peak,
        "is_weekend": weekend,
        TARGET_COL: actual_delay,
    })


def train(df: pd.DataFrame):
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"MAE: {mae:.2f} min | R²: {r2:.4f}")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default=None, help="Path to training CSV")
    args = parser.parse_args()

    if args.data:
        print(f"Loading dataset from {args.data} ...")
        df = load_and_engineer(args.data)
    else:
        print("No dataset provided — generating synthetic training data ...")
        df = generate_synthetic_data()

    print(f"Training on {len(df)} samples ...")
    train(df)
