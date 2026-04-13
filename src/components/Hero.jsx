import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          AI-Powered Predictions
        </div>
        <h1 className={styles.title}>
          Predict Train Delays<br />
          <span className={styles.titleAccent}>Before They Happen</span>
        </h1>
        <p className={styles.subtitle}>
          Enter your journey details and our Random Forest model will estimate your delay
          based on historical patterns, route distance, and peak-hour traffic.
        </p>
        <a href="#predictor" className={styles.cta}>
          Try the Predictor
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>200</span>
          <span className={styles.statLabel}>Decision Trees</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>6</span>
          <span className={styles.statLabel}>Input Features</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>5k+</span>
          <span className={styles.statLabel}>Training Samples</span>
        </div>
      </div>
    </section>
  );
}
