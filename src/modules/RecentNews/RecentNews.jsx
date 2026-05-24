import React, { useEffect, useState } from "react";
import styles from "./styles/RecentNews.module.css";

const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const LATEST_UPDATES_WINDOW_DAYS = 10;

const DEFAULT_PINNED_NOTICE = {
    category: "Security Notice",
    updatedAt: "Jan 20, 2026",
    updatedBy: "InfoSec Department",
    title: "Quarterly Security Awareness Campaign",
    message:
        "The InfoSec Department will conduct a quarterly security awareness campaign covering phishing prevention, data handling, and safe access practices.",
};

const normalizePinnedNotice = (content) => {
    return {
        ...DEFAULT_PINNED_NOTICE,
        ...(content?.recentNews?.pinnedNotice ?? {}),
    };
};

const loadPinnedNotice = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/portal-content/`);

        if (!response.ok) {
            throw new Error("Failed to load pinned notice.");
        }

        const data = await response.json();
        return normalizePinnedNotice(data);
    } catch (error) {
        console.error("Failed to load pinned notice:", error);
        return DEFAULT_PINNED_NOTICE;
    }
};

const formatDate = (value) => {
    if (!value) return "Unknown date";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const isWithinPastDays = (value, numberOfDays) => {
    if (!value) return false;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const now = new Date();
    const cutoffDate = new Date();

    cutoffDate.setDate(now.getDate() - numberOfDays);

    return date >= cutoffDate && date <= now;
};

const getActorName = (notification) => {
    return (
        notification.actor_name ||
        notification.actor_full_name ||
        notification.actor_email ||
        notification.actor?.full_name ||
        notification.actor?.email ||
        "System"
    );
};

const getDocumentTitle = (notification) => {
    return (
        notification.document_title ||
        notification.document?.title ||
        notification.misc_title ||
        "a document"
    );
};

const mapNotificationToUpdate = (rawNotification) => {
    /*
        This supports two possible backend shapes:

        Shape 1:
        {
            id,
            action,
            misc_title,
            created_at,
            actor_id,
            document_id
        }

        Shape 2:
        {
            id,
            read,
            notification: {
                id,
                action,
                misc_title,
                created_at,
                actor_id,
                document_id
            }
        }

        This makes the frontend safer whether your API returns direct
        notifications or user-notification wrapper records.
    */

    const notification = rawNotification.notification || rawNotification;

    const action = String(notification.action || "").toLowerCase();
    const actorName = getActorName(notification);
    const documentTitle = getDocumentTitle(notification);
    const formattedDate = formatDate(notification.created_at);

    if (
        action.includes("pin") ||
        action.includes("announcement") ||
        action.includes("notice")
    ) {
        return {
            id: rawNotification.id || notification.id,
            variant: "announcement",
            type: "Pinned Announcement",
            date: formattedDate,
            titleText: notification.misc_title || "Pinned notice",
            actionText: "was posted or updated.",
            description: `${actorName} updated the pinned notice.`,
            read: rawNotification.read ?? true,
        };
    }

    if (
        action.includes("edit") ||
        action.includes("update") ||
        action.includes("modified")
    ) {
        return {
            id: rawNotification.id || notification.id,
            variant: "update",
            type: "Document Update",
            date: formattedDate,
            titleText: documentTitle,
            actionText: "was updated.",
            description: `${actorName} edited this document.`,
            read: rawNotification.read ?? true,
        };
    }

    if (
        action.includes("upload") ||
        action.includes("create") ||
        action.includes("new")
    ) {
        return {
            id: rawNotification.id || notification.id,
            variant: "upload",
            type: "New Document",
            date: formattedDate,
            titleText: documentTitle,
            actionText: "was uploaded.",
            description: `${actorName} added a new document.`,
            read: rawNotification.read ?? true,
        };
    }

    return {
        id: rawNotification.id || notification.id,
        variant: "system",
        type: "System Update",
        date: formattedDate,
        titleText: notification.misc_title || "Information security update",
        actionText: "was updated.",
        description: `${actorName} made an update.`,
        read: rawNotification.read ?? true,
    };
};

const loadLatestUpdates = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/notifications/`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to load notifications.");
        }

        const data = await response.json();

        const notifications = Array.isArray(data) ? data : data.results || [];

        return notifications
            .filter((notification) => {
                const rawNotification = notification.notification || notification;

                return isWithinPastDays(
                    rawNotification.created_at,
                    LATEST_UPDATES_WINDOW_DAYS,
                );
            })
            .sort((a, b) => {
                const notifA = a.notification || a;
                const notifB = b.notification || b;

                return (
                    new Date(notifB.created_at).getTime() -
                    new Date(notifA.created_at).getTime()
                );
            })
            .map(mapNotificationToUpdate);
    } catch (error) {
        console.error("Failed to load latest updates:", error);
        return [];
    }
};

const getUpdateVariantClass = (variant) => {
    const variantClasses = {
        announcement: styles.updateItemAnnouncement,
        upload: styles.updateItemUpload,
        update: styles.updateItemUpdate,
        system: styles.updateItemSystem,
    };

    return variantClasses[variant] || styles.updateItemSystem;
};

const BodyContent = () => {
    const [pinnedNotice, setPinnedNotice] = useState(DEFAULT_PINNED_NOTICE);
    const [latestUpdates, setLatestUpdates] = useState([]);
    const [isLoadingPinnedNotice, setIsLoadingPinnedNotice] = useState(true);
    const [isLoadingUpdates, setIsLoadingUpdates] = useState(true);

    useEffect(() => {
        const fetchPinnedNotice = async () => {
            const notice = await loadPinnedNotice();
            setPinnedNotice(notice);
            setIsLoadingPinnedNotice(false);
        };

        const fetchLatestUpdates = async () => {
            const updates = await loadLatestUpdates();
            setLatestUpdates(updates);
            setIsLoadingUpdates(false);
        };

        fetchPinnedNotice();
        fetchLatestUpdates();

        const interval = setInterval(() => {
            fetchLatestUpdates();
        }, 30000);

        const handlePortalContentUpdated = (event) => {
            const updatedPinnedNotice = normalizePinnedNotice(event.detail);
            setPinnedNotice(updatedPinnedNotice);

            fetchLatestUpdates();
        };

        window.addEventListener(
            "portal-content-updated",
            handlePortalContentUpdated,
        );

        return () => {
            clearInterval(interval);

            window.removeEventListener(
                "portal-content-updated",
                handlePortalContentUpdated,
            );
        };
    }, []);

    return (
        <div className={styles.recentnews}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.headerSection}>
                    <p className={styles.pageLabel}>Recent News</p>
                    <h1>Information Security Updates</h1>

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
                                    {isLoadingPinnedNotice
                                        ? "Loading pinned notice..."
                                        : `${pinnedNotice.category} • ${pinnedNotice.updatedAt}`}
                                </p>

                                <h2>{pinnedNotice.title}</h2>

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

                        <div className={styles.updatesNotice}>
                            <p>
                                Showing notification updates from the past {LATEST_UPDATES_WINDOW_DAYS} days.
                            </p>
                        </div>

                        <div className={styles.updatesList}>
                            {isLoadingUpdates ? (
                                <article className={styles.updateItem}>
                                    <div className={styles.updateItemTop}>
                                        <span className={styles.updateTypePill}>Loading</span>
                                        <p>Please wait</p>
                                    </div>

                                    <div className={styles.updateHeadline}>
                                        <span className={styles.updateTitlePill}>
                                            Latest updates
                                        </span>

                                        <span className={styles.updateActionText}>
                                            are loading.
                                        </span>
                                    </div>
                                    <p>
                                        Fetching recent notifications from the information security portal.
                                    </p>
                                </article>
                            ) : latestUpdates.length > 0 ? (
                                latestUpdates.map((item) => (
                                    <article
                                        key={item.id}
                                        className={`${styles.updateItem} ${getUpdateVariantClass(item.variant)}`}
                                    >
                                        <div className={styles.updateItemTop}>
                                            <span className={styles.updateTypePill}>{item.type}</span>
                                            <p>{item.date}</p>
                                        </div>

                                        <div className={styles.updateHeadline}>
                                            <span className={styles.updateTitlePill}>
                                                {item.titleText}
                                            </span>

                                            <span className={styles.updateActionText}>
                                                {item.actionText}
                                            </span>
                                        </div>

                                        <p className={styles.updateDescription}>{item.description}</p>
                                    </article>
                                ))
                            ) : (
                                <article className={styles.updateItem}>
                                    <div className={styles.updateItemTop}>
                                        <span className={styles.updateTypePill}>No Updates</span>
                                        <p>—</p>
                                    </div>

                                    <div className={styles.updateHeadline}>
                                        <span className={styles.updateTitlePill}>
                                            No recent updates
                                        </span>

                                        <span className={styles.updateActionText}>
                                            yet.
                                        </span>
                                    </div>
                                    <p>
                                        New document uploads, document edits, and pinned announcements from the
                                        past {LATEST_UPDATES_WINDOW_DAYS} days will appear here.
                                    </p>
                                </article>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;