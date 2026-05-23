import React from "react";
import styles from "./styles/RecentNews.module.css";

const BodyContent = () => {
    // BACKEND TODO:
    // Replace this later with a fetch from your portal content endpoint.
    // Example: GET /api/portal-content/
    // This should be the one current pinned message shown to users.
    const pinnedNotice = {
        category: "Security Notice",
        updatedAt: "Jan 20, 2026",
        updatedBy: "InfoSec Department",
        title: "Quarterly Security Awareness Campaign",
        message:
            "The InfoSec Department will conduct a quarterly security awareness campaign covering phishing prevention, data handling, and safe access practices.",
    };

    // BACKEND TODO:
    // Replace this later with your existing notifications table/API.
    // Example: GET /api/notifications/
    // These should mirror recent system updates like edited documents, new policies, or module changes.
    const latestUpdates = [
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
                        View current InfoSec notices and recent system updates related to
                        policies, documents, advisories, and department activities.
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <section className={styles.pinnedNoticeCard}>
                        <div className={styles.cardHeader}>
                            <p>Pinned Notice</p>
                        </div>

                        <div className={styles.pinnedNoticeContent}>
                            <div>
                                <p className={styles.noticeMeta}>
                                    {pinnedNotice.category} • {pinnedNotice.updatedAt}
                                </p>

                                {/* BACKEND TODO: Map this to pinnedNotice.title */}
                                <h2>{pinnedNotice.title}</h2>

                                {/* BACKEND TODO: Map this to pinnedNotice.message */}
                                <p>{pinnedNotice.message}</p>
                            </div>

                            <div className={styles.noticeFooter}>
                                <span>Posted by</span>
                                <p>{pinnedNotice.updatedBy}</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.updatesCard}>
                        <div className={styles.cardHeader}>
                            <p>Latest Updates</p>
                        </div>

                        <div className={styles.updatesList}>
                            {/* BACKEND TODO: Replace latestUpdates with notifications fetched from the backend. */}
                            {latestUpdates.map((item, index) => (
                                <article key={index} className={styles.updateItem}>
                                    <div className={styles.updateItemTop}>
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