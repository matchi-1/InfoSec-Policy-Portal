import React, { useEffect, useState } from "react";
import styles from "./styles/Home.module.css";

const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const DEFAULT_PORTAL_CONTENT = {
    home: {
        appDescription:
            "This portal provides a centralized space for viewing information security documents, managing policy-related content, and accessing department updates based on assigned user permissions.",
        mission:
            "To protect organizational information assets by promoting secure, reliable, and responsible use of technology across all departments.",
        vision:
            "To build a security-conscious organization where information protection is embedded in every system, process, and decision.",
        coreValues: [
            "Integrity",
            "Accountability",
            "Confidentiality",
            "Security Awareness",
        ],
    },
    recentNews: {
        pinnedNotice: {
            category: "Security Notice",
            title: "Quarterly Security Awareness Campaign",
            message:
                "The InfoSec Department will conduct a quarterly security awareness campaign covering phishing prevention, data handling, and safe access practices.",
            updatedAt: "Jan 20, 2026",
            updatedBy: "InfoSec Department",
        },
    },
};

const normalizePortalContent = (content) => {
    return {
        home: {
            ...DEFAULT_PORTAL_CONTENT.home,
            ...(content?.home ?? {}),
            coreValues:
                Array.isArray(content?.home?.coreValues) &&
                    content.home.coreValues.length > 0
                    ? content.home.coreValues
                    : DEFAULT_PORTAL_CONTENT.home.coreValues,
        },
        recentNews: {
            pinnedNotice: {
                ...DEFAULT_PORTAL_CONTENT.recentNews.pinnedNotice,
                ...(content?.recentNews?.pinnedNotice ?? {}),
            },
        },
    };
};

const loadPortalContent = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/portal-content/`);

        if (!response.ok) {
            throw new Error("Failed to load portal content.");
        }

        const data = await response.json();
        return normalizePortalContent(data);
    } catch (error) {
        console.error("Failed to load portal content:", error);
        return DEFAULT_PORTAL_CONTENT;
    }
};

const BodyContent = () => {
    const [portalContent, setPortalContent] = useState(DEFAULT_PORTAL_CONTENT);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPortalContent = async () => {
            const content = await loadPortalContent();
            setPortalContent(content);
            setIsLoading(false);
        };

        fetchPortalContent();

        const handlePortalContentUpdated = (event) => {
            const updatedContent = normalizePortalContent(event.detail);
            setPortalContent(updatedContent);
        };

        window.addEventListener(
            "portal-content-updated",
            handlePortalContentUpdated,
        );

        return () => {
            window.removeEventListener(
                "portal-content-updated",
                handlePortalContentUpdated,
            );
        };
    }, []);

    const homeContent = portalContent.home;

    return (
        <div className={styles.home}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.headerSection}>
                    <div className={styles.headerTitleBlock}>
                        <p className={styles.pageLabel}>Home</p>
                        <h1>Information Security Portal</h1>
                    </div>

                    <p className={styles.pageDescription}>
                        {isLoading
                            ? "Loading portal content..."
                            : homeContent.appDescription}
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <section className={styles.infoCard}>
                        <div className={styles.cardHeader}>
                            <p>Company Mission</p>
                        </div>

                        <p className={styles.cardText}>
                            {homeContent.mission}
                        </p>
                    </section>

                    <section className={styles.infoCard}>
                        <div className={styles.cardHeader}>
                            <p>Company Vision</p>
                        </div>

                        <p className={styles.cardText}>
                            {homeContent.vision}
                        </p>
                    </section>

                    <section className={`${styles.infoCard} ${styles.valuesCard}`}>
                        <div className={styles.cardHeader}>
                            <p>Core Values</p>
                        </div>

                        <div className={styles.valuesList}>
                            {homeContent.coreValues.map((value, index) => (
                                <div key={`${value}-${index}`} className={styles.valueItem}>
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                    <p>{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;