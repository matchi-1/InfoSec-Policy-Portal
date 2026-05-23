import React from "react";
import styles from "./styles/Home.module.css";

const BodyContent = () => {
    return (
        <div className={styles.home}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.headerSection}>
                    <p className={styles.pageLabel}>Home</p>
                    <h1>Information Security Portal</h1>

                    {/* EDIT THIS: Replace this placeholder description with the real purpose/description of the app. */}
                    <p className={styles.pageDescription}>
                        This portal provides a centralized space for viewing information
                        security documents, managing policy-related content, and accessing
                        department updates based on assigned user permissions.
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <section className={styles.infoCard}>
                        <div className={styles.cardHeader}>
                            <p>Company Mission</p>
                        </div>

                        {/* EDIT THIS: Replace this with the real company mission statement. */}
                        <p className={styles.cardText}>
                            To protect organizational information assets by promoting secure,
                            reliable, and responsible use of technology across all departments.
                        </p>
                    </section>

                    <section className={styles.infoCard}>
                        <div className={styles.cardHeader}>
                            <p>Company Vision</p>
                        </div>

                        {/* EDIT THIS: Replace this with the real company vision statement. */}
                        <p className={styles.cardText}>
                            To build a security-conscious organization where information
                            protection is embedded in every system, process, and decision.
                        </p>
                    </section>

                    <section className={`${styles.infoCard} ${styles.valuesCard}`}>
                        <div className={styles.cardHeader}>
                            <p>Core Values</p>
                        </div>

                        {/* EDIT THIS: Replace these placeholder values with the real company core values. */}
                        <div className={styles.valuesList}>
                            <div className={styles.valueItem}>
                                <span>01</span>
                                <p>Integrity</p>
                            </div>

                            <div className={styles.valueItem}>
                                <span>02</span>
                                <p>Accountability</p>
                            </div>

                            <div className={styles.valueItem}>
                                <span>03</span>
                                <p>Confidentiality</p>
                            </div>

                            <div className={styles.valueItem}>
                                <span>04</span>
                                <p>Security Awareness</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;