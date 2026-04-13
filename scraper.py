"""
scraper.py — Collect train delay data and append to a CSV.

Adapt the `scrape_once()` function to your actual data source.
This scaffold supports:
  - IRCTC / NTES-style HTML pages
  - Any REST endpoint returning JSON
  - RailwayAPI.com (requires API key in .env)

Run once:    python scraper.py
Run in loop: python scraper.py --loop --interval 3600
"""

import argparse
import csv
import os
import time
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

OUTPUT_CSV = "data/train_delays.csv"
FIELDNAMES = [
    "timestamp",
    "train_number",
    "scheduled_hour",
    "day_of_week",
    "distance_km",
    "previous_delay_min",
    "actual_delay_min",
]

# Optional: RailwayAPI.com
RAILWAY_API_KEY = os.getenv("RAILWAY_API_KEY", "")
RAILWAY_API_URL = "https://api.railwayapi.com/v2/live-train/train/{train_no}/?apikey={key}"


# ---------------------------------------------------------------------------
# Adapt this function to your real data source
# ---------------------------------------------------------------------------

def scrape_once() -> list[dict]:
    """
    Return a list of row dicts matching FIELDNAMES.

    Example: fetch from RailwayAPI if key is configured, else return demo data.
    """
    rows = []
    now = datetime.now()

    if RAILWAY_API_KEY:
        # Example trains — extend as needed
        for train_no in ["12951", "22222", "12650"]:
            try:
                url = RAILWAY_API_URL.format(train_no=train_no, key=RAILWAY_API_KEY)
                resp = requests.get(url, timeout=10)
                resp.raise_for_status()
                data = resp.json()

                station = data.get("position", {})
                delay = float(station.get("delay", 0))
                rows.append({
                    "timestamp": now.isoformat(),
                    "train_number": train_no,
                    "scheduled_hour": now.hour,
                    "day_of_week": now.weekday(),
                    "distance_km": float(data.get("distance", 100)),
                    "previous_delay_min": 0.0,  # update if chaining runs
                    "actual_delay_min": delay,
                })
            except Exception as e:
                print(f"[{train_no}] Error: {e}")
    else:
        # Fallback: synthetic demo row so the pipeline always produces output
        import random
        rows.append({
            "timestamp": now.isoformat(),
            "train_number": "DEMO",
            "scheduled_hour": now.hour,
            "day_of_week": now.weekday(),
            "distance_km": round(random.uniform(50, 500), 1),
            "previous_delay_min": round(random.uniform(0, 30), 1),
            "actual_delay_min": round(random.uniform(0, 45), 1),
        })

    return rows


# ---------------------------------------------------------------------------
# CSV writer
# ---------------------------------------------------------------------------

def append_to_csv(rows: list[dict]):
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
    write_header = not os.path.exists(OUTPUT_CSV)

    with open(OUTPUT_CSV, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if write_header:
            writer.writeheader()
        writer.writerows(rows)

    print(f"Appended {len(rows)} row(s) → {OUTPUT_CSV}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--loop", action="store_true", help="Run continuously")
    parser.add_argument("--interval", type=int, default=3600, help="Seconds between runs")
    args = parser.parse_args()

    while True:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Scraping ...")
        rows = scrape_once()
        if rows:
            append_to_csv(rows)
        if not args.loop:
            break
        print(f"Sleeping {args.interval}s ...")
        time.sleep(args.interval)
