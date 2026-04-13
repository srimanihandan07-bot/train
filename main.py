from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os

app = FastAPI(title="Train Delay Predictor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
MODEL_PATH = "model/train_delay_model.pkl"
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print("WARNING: No model file found. Run train_model.py first.")


class DelayRequest(BaseModel):
    scheduled_hour: int = Field(..., ge=0, le=23, description="Scheduled departure hour (0-23)")
    day_of_week: int = Field(..., ge=0, le=6, description="Day of week (0=Mon, 6=Sun)")
    distance_km: float = Field(..., gt=0, description="Route distance in km")
    previous_delay_min: float = Field(..., ge=0, description="Previous train's delay in minutes")


class DelayResponse(BaseModel):
    predicted_delay_min: float
    is_peak_hour: bool
    confidence_note: str


def is_peak_hour(hour: int) -> bool:
    return hour in range(7, 10) or hour in range(17, 20)


def engineer_features(req: DelayRequest) -> np.ndarray:
    peak = int(is_peak_hour(req.scheduled_hour))
    is_weekend = int(req.day_of_week >= 5)
    # Feature order: previous_delay, distance_km, scheduled_hour, day_of_week, is_peak_hour, is_weekend
    return np.array([[
        req.previous_delay_min,
        req.distance_km,
        req.scheduled_hour,
        req.day_of_week,
        peak,
        is_weekend,
    ]])


@app.get("/")
def root():
    return {"message": "Train Delay Predictor API is running."}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict-delay", response_model=DelayResponse)
def predict_delay(req: DelayRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train the model first.")

    features = engineer_features(req)
    prediction = model.predict(features)[0]
    predicted_delay = max(0.0, round(float(prediction), 1))

    peak = is_peak_hour(req.scheduled_hour)
    note = "High confidence" if req.previous_delay_min > 0 else "Based on route & time patterns"

    return DelayResponse(
        predicted_delay_min=predicted_delay,
        is_peak_hour=peak,
        confidence_note=note,
    )
