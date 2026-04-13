import { useState } from "react";
import axios from "axios";
import ResultCard from "./ResultCard.jsx";
import styles from "./PredictorForm.module.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initialForm = {
  scheduled_hour: 8,
  day_of_week: 0,
  distance_km: 200,
  previous_delay_min: 0,
};

export default function PredictorForm() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await axios.post(`${API_URL}/predict-delay`, form);
      setResult(data);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Unable to connect to the prediction API. Make sure the backend is running.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  const isPeak = (h) => (h >= 7 && h <= 9) || (h >= 17 && h <= 19);

  return (
    <section id="predictor" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Delay Predictor</h2>
            <p className={styles.formSubtitle}>Fill in your journey details below</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="scheduled_hour">
                  Departure Hour
                  {isPeak(form.scheduled_hour) && (
                    <span className={styles.peakTag}>Peak Hour</span>
                  )}
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    id="scheduled_hour"
                    name="scheduled_hour"
                    type="number"
                    min="0"
                    max="23"
                    value={form.scheduled_hour}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  <span className={styles.inputSuffix}>hr</span>
                </div>
                <span className={styles.hint}>0 – 23 (24-hour format)</span>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="day_of_week">
                  Day of Week
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <select
                    id="day_of_week"
                    name="day_of_week"
                    value={form.day_of_week}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.select}`}
                    required
                  >
                    {DAY_NAMES.map((d, i) => (
                      <option key={i} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="distance_km">
                  Route Distance
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>
                  <input
                    id="distance_km"
                    name="distance_km"
                    type="number"
                    min="1"
                    max="3000"
                    step="1"
                    value={form.distance_km}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  <span className={styles.inputSuffix}>km</span>
                </div>
                <span className={styles.hint}>Total route distance</span>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="previous_delay_min">
                  Previous Train Delay
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v4l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M4 13l-2 2M12 13l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    id="previous_delay_min"
                    name="previous_delay_min"
                    type="number"
                    min="0"
                    max="300"
                    step="0.5"
                    value={form.previous_delay_min}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  <span className={styles.inputSuffix}>min</span>
                </div>
                <span className={styles.hint}>0 if no prior delay info</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Predicting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8l5 5L14 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Predict Delay
                  </>
                )}
              </button>
              {(result || error) && (
                <button type="button" className={styles.resetBtn} onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={styles.resultWrap}>
          {error && (
            <div className={styles.errorCard}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {result && <ResultCard result={result} />}
          {!result && !error && <EmptyState />}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="14" width="40" height="24" rx="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 14V10a2 2 0 012-2h20a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="15" cy="28" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="33" cy="28" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 22h40" stroke="currentColor" strokeWidth="1.5" />
          <path d="M18 36v4M30 36v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className={styles.emptyTitle}>Ready to predict</p>
      <p className={styles.emptyText}>Enter your journey details and click "Predict Delay" to see results.</p>
    </div>
  );
}
