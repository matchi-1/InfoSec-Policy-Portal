import React, { useEffect, useState } from "react";
import styles from "./styles/EditHomeNews.module.css";

const PORTAL_CONTENT_STORAGE_KEY = "infosec_portal_content_v1";

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

const loadPortalContent = () => {
    // BACKEND TODO:
    // Replace this localStorage logic with a GET request later.
    //
    // Example future logic:
    // const response = await fetch(`${backendUrl}/api/portal-content/`);
    // const data = await response.json();
    // return data;
    //
    // Expected backend response shape:
    // {
    //   home: {
    //     appDescription: string,
    //     mission: string,
    //     vision: string,
    //     coreValues: string[]
    //   },
    //   recentNews: {
    //     pinnedNotice: {
    //       category: string,
    //       title: string,
    //       message: string,
    //       updatedAt: string,
    //       updatedBy: string
    //     }
    //   }
    // }

    try {
        const savedContent = localStorage.getItem(PORTAL_CONTENT_STORAGE_KEY);

        if (!savedContent) {
            return DEFAULT_PORTAL_CONTENT;
        }

        return {
            ...DEFAULT_PORTAL_CONTENT,
            ...JSON.parse(savedContent),
        };
    } catch (error) {
        console.error("Failed to load portal content:", error);
        return DEFAULT_PORTAL_CONTENT;
    }
};

const savePortalContent = (content) => {
    // BACKEND TODO:
    // Replace this localStorage logic with a PUT/PATCH request later.
    //
    // Example future logic:
    // await fetch(`${backendUrl}/api/portal-content/`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   credentials: "include",
    //   body: JSON.stringify(content),
    // });
    //
    // Logical backend behavior:
    // 1. Validate that the user is an admin.
    // 2. Save app description, mission, vision, core values, and pinned notice.
    // 3. Update updated_by and updated_at.
    // 4. Return the updated portal content object.
    //
    // Optional later:
    // If pinned notice is changed, backend can also create a notification record.

    localStorage.setItem(PORTAL_CONTENT_STORAGE_KEY, JSON.stringify(content));

    // This lets Home and Recent News update immediately if they are listening for this event.
    window.dispatchEvent(
        new CustomEvent("portal-content-updated", {
            detail: content,
        }),
    );
};

const BodyContent = () => {
    const [portalContent, setPortalContent] = useState(DEFAULT_PORTAL_CONTENT);
    const [saveStatus, setSaveStatus] = useState("");

    useEffect(() => {
        const content = loadPortalContent();
        setPortalContent(content);
    }, []);

    const handleHomeChange = (field, value) => {
        setPortalContent((prev) => ({
            ...prev,
            home: {
                ...prev.home,
                [field]: value,
            },
        }));
    };

    const handlePinnedNoticeChange = (field, value) => {
        setPortalContent((prev) => ({
            ...prev,
            recentNews: {
                ...prev.recentNews,
                pinnedNotice: {
                    ...prev.recentNews.pinnedNotice,
                    [field]: value,
                },
            },
        }));
    };

    const handleCoreValueChange = (index, value) => {
        setPortalContent((prev) => {
            const updatedValues = [...prev.home.coreValues];
            updatedValues[index] = value;

            return {
                ...prev,
                home: {
                    ...prev.home,
                    coreValues: updatedValues,
                },
            };
        });
    };

    const handleAddCoreValue = () => {
        setPortalContent((prev) => ({
            ...prev,
            home: {
                ...prev.home,
                coreValues: [...prev.home.coreValues, "New Core Value"],
            },
        }));
    };

    const handleRemoveCoreValue = (index) => {
        setPortalContent((prev) => ({
            ...prev,
            home: {
                ...prev.home,
                coreValues: prev.home.coreValues.filter((_, i) => i !== index),
            },
        }));
    };

    const handleSave = () => {
        const contentToSave = {
            ...portalContent,
            recentNews: {
                ...portalContent.recentNews,
                pinnedNotice: {
                    ...portalContent.recentNews.pinnedNotice,

                    // BACKEND TODO:
                    // Later, updatedAt and updatedBy should come from the backend.
                    updatedAt: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }),
                    updatedBy: "Current Admin User",
                },
            },
        };

        savePortalContent(contentToSave);
        setPortalContent(contentToSave);
        setSaveStatus("Changes saved locally. Backend save can be added later.");

        setTimeout(() => {
            setSaveStatus("");
        }, 3000);
    };

    const handleReset = () => {
        setPortalContent(DEFAULT_PORTAL_CONTENT);
        savePortalContent(DEFAULT_PORTAL_CONTENT);
        setSaveStatus("Placeholder content restored.");

        setTimeout(() => {
            setSaveStatus("");
        }, 3000);
    };

    return (
        <div className={styles.editHomeNews}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.headerSection}>
                    <p className={styles.pageLabel}>Admin Module</p>
                    <h1>Edit Home / News</h1>
                    <p className={styles.pageDescription}>
                        Manage the placeholder content displayed on the Home and Recent News
                        modules. This currently saves locally and can later be connected to
                        the backend.
                    </p>
                </div>

                <div className={styles.actionBar}>
                    <div>
                        <p className={styles.actionTitle}>Portal Content Editor</p>
                        <p className={styles.actionSubtitle}>
                            Updates here should map directly to the client-facing modules.
                        </p>
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={handleReset}
                        >
                            Reset Placeholders
                        </button>

                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {saveStatus && <div className={styles.saveStatus}>{saveStatus}</div>}

                <div className={styles.contentGrid}>
                    <section className={styles.editorCard}>
                        <div className={styles.cardHeader}>
                            <p>Home Content</p>
                        </div>

                        <div className={styles.cardBody}>
                            <label className={styles.fieldGroup}>
                                <span>App Description</span>
                                <textarea
                                    value={portalContent.home.appDescription}
                                    onChange={(e) =>
                                        handleHomeChange("appDescription", e.target.value)
                                    }
                                    rows={3}
                                />
                            </label>

                            <label className={styles.fieldGroup}>
                                <span>Company Mission</span>
                                <textarea
                                    value={portalContent.home.mission}
                                    onChange={(e) => handleHomeChange("mission", e.target.value)}
                                    rows={3}
                                />
                            </label>

                            <label className={styles.fieldGroup}>
                                <span>Company Vision</span>
                                <textarea
                                    value={portalContent.home.vision}
                                    onChange={(e) => handleHomeChange("vision", e.target.value)}
                                    rows={3}
                                />
                            </label>

                            <div className={styles.fieldGroup}>
                                <div className={styles.inlineFieldHeader}>
                                    <span>Core Values</span>

                                    <button
                                        type="button"
                                        className={styles.smallButton}
                                        onClick={handleAddCoreValue}
                                    >
                                        Add Value
                                    </button>
                                </div>

                                <div className={styles.coreValueList}>
                                    {portalContent.home.coreValues.map((value, index) => (
                                        <div key={index} className={styles.coreValueInputRow}>
                                            <input
                                                value={value}
                                                onChange={(e) =>
                                                    handleCoreValueChange(index, e.target.value)
                                                }
                                            />

                                            <button
                                                type="button"
                                                className={styles.removeButton}
                                                onClick={() => handleRemoveCoreValue(index)}
                                                disabled={portalContent.home.coreValues.length <= 1}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.editorCard}>
                        <div className={styles.cardHeader}>
                            <p>Recent News Content</p>
                        </div>

                        <div className={styles.cardBody}>
                            <label className={styles.fieldGroup}>
                                <span>Pinned Notice Category</span>
                                <input
                                    value={portalContent.recentNews.pinnedNotice.category}
                                    onChange={(e) =>
                                        handlePinnedNoticeChange("category", e.target.value)
                                    }
                                />
                            </label>

                            <label className={styles.fieldGroup}>
                                <span>Pinned Notice Title</span>
                                <input
                                    value={portalContent.recentNews.pinnedNotice.title}
                                    onChange={(e) =>
                                        handlePinnedNoticeChange("title", e.target.value)
                                    }
                                />
                            </label>

                            <label className={styles.fieldGroup}>
                                <span>Pinned Notice Message</span>
                                <textarea
                                    value={portalContent.recentNews.pinnedNotice.message}
                                    onChange={(e) =>
                                        handlePinnedNoticeChange("message", e.target.value)
                                    }
                                    rows={6}
                                />
                            </label>

                            <div className={styles.previewBox}>
                                <p className={styles.previewLabel}>Pinned Notice Preview</p>

                                <div className={styles.noticePreview}>
                                    <p className={styles.noticeMeta}>
                                        {portalContent.recentNews.pinnedNotice.category} •{" "}
                                        {portalContent.recentNews.pinnedNotice.updatedAt}
                                    </p>

                                    <h2>{portalContent.recentNews.pinnedNotice.title}</h2>

                                    <p>{portalContent.recentNews.pinnedNotice.message}</p>
                                </div>
                            </div>

                            <div className={styles.mappingNote}>
                                <p>Backend mapping later:</p>
                                <span>
                                    Home reads <strong>home</strong>. Recent News reads{" "}
                                    <strong>recentNews.pinnedNotice</strong>. Latest Updates reads
                                    your existing <strong>notifications</strong> table.
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;