import React from "react";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landingContent}>
      <div className={styles.innerCard}>
        <img
          src="/icons/InfoSecLogo.png"
          alt="Information Security Department"
          className={styles.landingLogo}
        />

        <h1 className={styles.title}>Information Security Department</h1>

        <p className={styles.landingSubtext}>
          Welcome to the Information Security portal.
        </p>

        <p className={styles.description}>
          Access policies, standards, procedures, and other security-related
          resources for the organization.
        </p>

        <div className={styles.noticeBox}>
          <p className={styles.noticeTitle}>Getting Started</p>
          <p className={styles.noticeText}>
            Click a module on the left to display its corresponding content and
            available actions.
          </p>
        </div>
      </div>
    </div>
  );
}