import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    title: "Enter Journey Details",
    description: "Provide your scheduled departure hour, day of the week, total route distance, and any known delay from the preceding train.",
  },
  {
    number: "02",
    title: "Feature Engineering",
    description: "The app automatically derives peak-hour and weekend flags from your inputs before sending them to the model.",
  },
  {
    number: "03",
    title: "Random Forest Inference",
    description: "200 decision trees vote on the most likely delay based on patterns learned from thousands of historical journeys.",
  },
  {
    number: "04",
    title: "Receive Your Prediction",
    description: "Get an estimated delay in minutes along with a severity rating and confidence note, displayed in real-time.",
  },
];

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    label: "previous_delay_min",
    desc: "Preceding train delay",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 10h14M10 3a10 10 0 010 14M10 3a10 10 0 000 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    label: "distance_km",
    desc: "Route length",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    label: "scheduled_hour",
    desc: "Departure time",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 2v3M13 2v3M3 8.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    label: "day_of_week",
    desc: "Weekday vs weekend",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
    label: "is_peak_hour",
    desc: "7–9am or 5–7pm flag",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 7v3l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    label: "is_weekend",
    desc: "Weekend indicator",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2 className={styles.title}>How It Works</h2>
          <p className={styles.subtitle}>
            A four-step pipeline from input to prediction, powered by an ensemble ML model.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.featuresWrap}>
          <h3 className={styles.featuresTitle}>Model Features</h3>
          <div className={styles.features}>
            {features.map((f) => (
              <div key={f.label} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <code className={styles.featureLabel}>{f.label}</code>
                <span className={styles.featureDesc}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
