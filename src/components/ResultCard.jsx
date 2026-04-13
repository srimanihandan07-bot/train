import styles from "./ResultCard.module.css";

function DelayMeter({ delay }) {
  const max = 60;
  const clamped = Math.min(delay, max);
  const pct = (clamped / max) * 100;

  let color = "var(--color-success)";
  let label = "On Time";
  if (delay >= 5 && delay < 15) { color = "var(--color-warning)"; label = "Minor Delay"; }
  else if (delay >= 15 && delay < 30) { color = "#f97316"; label = "Moderate Delay"; }
  else if (delay >= 30) { color = "var(--color-error)"; label = "Major Delay"; }

  return { pct, color, label };
}

export default function ResultCard({ result }) {
  const { predicted_delay_min, is_peak_hour, confidence_note } = result;
  const { pct, color, label } = DelayMeter({ delay: predicted_delay_min });

  return (
    <div className={styles.card} style={{ "--delay-color": color }}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Prediction Result</span>
        <span className={styles.badge} style={{ color, background: `${color}1a`, borderColor: `${color}33` }}>
          {label}
        </span>
      </div>

      <div className={styles.delayDisplay}>
        <span className={styles.delayValue} style={{ color }}>
          {predicted_delay_min.toFixed(1)}
        </span>
        <span className={styles.delayUnit}>minutes</span>
      </div>

      <div className={styles.meterWrap}>
        <div className={styles.meterTrack}>
          <div
            className={styles.meterFill}
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <div className={styles.meterLabels}>
          <span>0</span>
          <span>15</span>
          <span>30</span>
          <span>45</span>
          <span>60+</span>
        </div>
      </div>

      <div className={styles.facts}>
        <div className={styles.fact}>
          <span className={styles.factIcon} data-peak={is_peak_hour ? "true" : "false"}>
            {is_peak_hour ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 10A6 6 0 013.5 4.5 6 6 0 1013 10z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <div>
            <span className={styles.factLabel}>Time Period</span>
            <span className={styles.factValue}>{is_peak_hour ? "Peak Hour" : "Off-Peak"}</span>
          </div>
        </div>

        <div className={styles.fact}>
          <span className={styles.factIcon} data-confidence="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2l1.5 3.5 3.5.5-2.5 2.5.5 3.5L8 10.5 5 12l.5-3.5L3 6l3.5-.5L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <span className={styles.factLabel}>Model Note</span>
            <span className={styles.factValue}>{confidence_note}</span>
          </div>
        </div>
      </div>

      <p className={styles.disclaimer}>
        Estimate based on Random Forest model trained on historical and synthetic data.
      </p>
    </div>
  );
}
