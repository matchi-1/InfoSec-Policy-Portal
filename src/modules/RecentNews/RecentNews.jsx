import React from "react";
import styles from "./styles/RecentNews.module.css";

const BodyContent = () => {
    const newsItems = [
        {
            type: "Policy Update",
            date: "Jan 15, 2026",
            title: "Updated Password Management Guidelines",
            description:
                "New password requirements and account protection reminders have been added for all users.",
        },
        {
            type: "Advisory",
            date: "Jan 10, 2026",
            title: "Phishing Awareness Reminder",
            description:
                "Employees are reminded to verify email senders, links, and attachments before opening.",
        },
        {
            type: "Maintenance",
            date: "Jan 05, 2026",
            title: "Scheduled Security System Maintenance",
            description:
                "Certain InfoSec services may be temporarily unavailable during the scheduled maintenance window.",
        },
    ];

    return (
        <div className={styles.recentnews}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.headerSection}>
                    <p className={styles.pageLabel}>Recent News</p>
                    <h1>Information Security Updates</h1>

                    {/* EDIT THIS: Replace this placeholder description with the actual purpose of the Recent News module. */}
                    <p className={styles.pageDescription}>
                        View recent information security announcements, advisories, policy
                        updates, and department notices.
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <section className={styles.featuredCard}>
                        <div className={styles.cardHeader}>
                            <p>Featured Announcement</p>
                        </div>

                        <div className={styles.featuredContent}>
                            <div>
                                <p className={styles.newsMeta}>Security Advisory • Jan 20, 2026</p>

                                {/* EDIT THIS: Replace this placeholder announcement with the latest priority announcement. */}
                                <h2>Quarterly Security Awareness Campaign</h2>

                                <p>
                                    The InfoSec Department will conduct a quarterly security
                                    awareness campaign covering phishing prevention, data handling,
                                    and safe access practices.
                                </p>
                            </div>

                            <button type="button" className={styles.readButton}>
                                View Details
                            </button>
                        </div>
                    </section>

                    <section className={styles.newsListCard}>
                        <div className={styles.cardHeader}>
                            <p>Latest Updates</p>
                        </div>

                        <div className={styles.newsList}>
                            {/* EDIT THIS: Replace these placeholder news items with real data from the backend later. */}
                            {newsItems.map((item, index) => (
                                <article key={index} className={styles.newsItem}>
                                    <div className={styles.newsItemTop}>
                                        <span>{item.type}</span>
                                        <p>{item.date}</p>
                                    </div>

                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;