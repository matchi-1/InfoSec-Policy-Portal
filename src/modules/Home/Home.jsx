import React from "react";
import styles from "./styles/Home.module.css";

const BodyContent = () => {
    return (
        <div className={styles.home}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.homeHeader}>
                    <p className={styles.homeEyebrow}>InfoSec Department Portal</p>
                    <h1>Welcome to the Information Security Portal</h1>

                    {/* EDIT THIS: Replace this placeholder description with the real purpose/description of the app. */}
                    <p className={styles.homeDescription}>
                        This portal serves as a centralized space for viewing, managing, and
                        maintaining information security policies, documents, updates, and
                        department-related resources.
                    </p>
                </div>

                <div className={styles.homeInfoGrid}>
                    <div className={`${styles.homeCard} ${styles.homeCardWide}`}>
                        <p className={styles.homeCardLabel}>Company Mission</p>

                        {/* EDIT THIS: Replace this with the real company mission statement. */}
                        <p className={styles.homeCardText}>
                            To provide secure, reliable, and accessible information systems
                            that support the organization&apos;s goals while protecting its
                            people, data, and digital assets.
                        </p>
                    </div>

                    <div className={`${styles.homeCard} ${styles.homeCardWide}`}>
                        <p className={styles.homeCardLabel}>Company Vision</p>

                        {/* EDIT THIS: Replace this with the real company vision statement. */}
                        <p className={styles.homeCardText}>
                            To become a trusted and security-conscious organization where
                            information protection is embedded in every process, system, and
                            decision.
                        </p>
                    </div>

                    <div className={styles.homeCard}>
                        <p className={styles.homeCardLabel}>Core Values</p>

                        {/* EDIT THIS: Replace these placeholder values with the real company core values. */}
                        <div className={styles.homeValuesList}>
                            <span>Integrity</span>
                            <span>Accountability</span>
                            <span>Confidentiality</span>
                            <span>Security Awareness</span>
                        </div>
                    </div>

                    <div className={styles.homeCard}>
                        <p className={styles.homeCardLabel}>About This App</p>

                        {/* EDIT THIS: Replace this with a more specific description of the portal once finalized. */}
                        <p className={styles.homeCardText}>
                            Users can access approved InfoSec documents, review recent
                            department announcements, and manage policy-related content based
                            on their assigned permissions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;