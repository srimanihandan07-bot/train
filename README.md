# 🚆 Train Delay Predictor

A full-stack ML web app that predicts train delays using a **Random Forest** model.

**Stack:** React + Vite · FastAPI · scikit-learn · Deployed on Vercel + Render

---

## Project Structure

```
train-delay/
├── backend/
│   ├── main.py            # FastAPI app — /predict-delay endpoint
│   ├── train_model.py     # Train & save the Random Forest model
│   ├── scraper.py         # Data collection pipeline (CSV output)
│   ├── requirements.txt
│   └── model/             # Generated after training
│       └── train_delay_model.pkl
│
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main React component
    │   ├── App.css        # Styles
    │   └── main.jsx       # Entry point
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

---

## Quickstart

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Train model (uses synthetic data if no CSV provided)
python train_model.py

# Start API server
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 2. Frontend

```bash
cd frontend
npm install

# Copy env and set API URL
cp .env.example .env        # Edit VITE_API_URL if needed

npm run dev
# → http://localhost:5173
```

---

## API Reference

### `POST /predict-delay`

**Request body:**
```json
{
  "scheduled_hour": 8,
  "day_of_week": 0,
  "distance_km": 200,
  "previous_delay_min": 10
}
```

**Response:**
```json
{
  "predicted_delay_min": 12.4,
  "is_peak_hour": true,
  "confidence_note": "High confidence"
}
```

### `GET /health`
Returns `{ "status": "ok", "model_loaded": true }`

---

## ML Model

| Feature | Description |
|---|---|
| `previous_delay_min` | Delay of the preceding train |
| `distance_km` | Total route distance |
| `scheduled_hour` | Departure hour (0-23) |
| `day_of_week` | 0 = Monday … 6 = Sunday |
| `is_peak_hour` | Derived: 7-9am or 5-7pm |
| `is_weekend` | Derived from day_of_week |

Algorithm: **RandomForestRegressor** (200 trees, max depth 12)

---

## Data Pipeline

```
scraper.py  →  data/train_delays.csv  →  train_model.py  →  model/train_delay_model.pkl
```

Run the scraper continuously:
```bash
python scraper.py --loop --interval 3600
```

Set `RAILWAY_API_KEY` in a `.env` file to pull live data from RailwayAPI.com.

---

## Deployment

| Service | Platform | Command |
|---|---|---|
| Backend | Render | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Frontend | Vercel | `npm run build` (auto-detected) |

Set `VITE_API_URL` on Vercel to your Render backend URL.

---

## Future Improvements

- Train number lookup
- Weather data integration
- PostgreSQL database (replace CSV)
- Better UI with live maps
