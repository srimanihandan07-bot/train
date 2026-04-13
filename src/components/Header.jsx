import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 6V4a1 1 0 011-1h10a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="15" r="1.5" fill="currentColor" />
              <circle cx="17" cy="15" r="1.5" fill="currentColor" />
              <path d="M2 11h20" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 18v2M15 18v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className={styles.logoText}>RailPredict</span>
        </div>
        <nav className={styles.nav}>
          <a href="#predictor" className={styles.navLink}>Predictor</a>
          <a href="#how-it-works" className={styles.navLink}>How it Works</a>
        </nav>
      </div>
    </header>
  );
}
