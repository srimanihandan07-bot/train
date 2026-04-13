import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>
          RailPredict — Random Forest model with 200 trees &amp; 6 features.
        </p>
        <p className={styles.subtext}>
          Estimates are for informational purposes only and may vary from actual delays.
        </p>
      </div>
    </footer>
  );
}
