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

const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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

const savePortalContent = async (content) => {
    const response = await fetch(`${backendUrl}/api/portal-content/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
    });

    if (!response.ok) {
        throw new Error("Failed to save portal content.");
    }

    const data = await response.json();
    const normalizedContent = normalizePortalContent(data);

    window.dispatchEvent(
        new CustomEvent("portal-content-updated", {
            detail: normalizedContent,
        }),
    );

    return normalizedContent;
};

const BodyContent = () => {
    const [savedContent, setSavedContent] = useState(DEFAULT_PORTAL_CONTENT);
    const [draftContent, setDraftContent] = useState(DEFAULT_PORTAL_CONTENT);
    const [isEditMode, setIsEditMode] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    useEffect(() => {
        const fetchPortalContent = async () => {
            const content = await loadPortalContent();
            setSavedContent(content);
            setDraftContent(content);
        };

        fetchPortalContent();
    }, []);

    const showStatus = (message) => {
        setSaveStatus(message);

        setTimeout(() => {
            setSaveStatus("");
        }, 3000);
    };

    const handleEnterEditMode = () => {
        setDraftContent(savedContent);
        setIsEditMode(true);
        setSaveStatus("");
    };

    const handleCancel = () => {
        setDraftContent(savedContent);
        setIsEditMode(false);
        showStatus("Editing cancelled. No changes were saved.");
    };

    const handleResetToLastSaved = () => {
        setDraftContent(savedContent);
        showStatus("Draft restored to the last saved content.");
    };

    const handleSave = async () => {
        try {
            const contentToSave = normalizePortalContent(draftContent);

            const savedFromBackend = await savePortalContent(contentToSave);

            setSavedContent(savedFromBackend);
            setDraftContent(savedFromBackend);
            setIsEditMode(false);
            showStatus("Changes saved successfully.");
        } catch (error) {
            console.error("Failed to save portal content:", error);
            showStatus("Failed to save changes. Please try again.");
        }
    };

    const handleHomeChange = (field, value) => {
        setDraftContent((prev) => ({
            ...prev,
            home: {
                ...prev.home,
                [field]: value,
            },
        }));
    };

    const handlePinnedNoticeChange = (field, value) => {
        setDraftContent((prev) => ({
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
        setDraftContent((prev) => {
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
        setDraftContent((prev) => ({
            ...prev,
            home: {
                ...prev.home,
                coreValues: [...prev.home.coreValues, "New Core Value"],
            },
        }));
    };

    const handleRemoveCoreValue = (index) => {
        setDraftContent((prev) => ({
            ...prev,
            home: {
                ...prev.home,
                coreValues: prev.home.coreValues.filter((_, i) => i !== index),
            },
        }));
    };

    return (
        <div className={styles.editHomeNews}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.headerSection}>
                    <p className={styles.pageLabel}>Admin Module</p>
                    <h1>Edit Home / News</h1>
                    <p className={styles.pageDescription}>
                        Manage the content displayed on the Home and Recent News modules.
                    </p>
                </div>

                <div
                    className={`${styles.editorPanel} ${isEditMode ? styles.editorPanelEditing : ""}`}
                >
                    <div className={styles.editorPanelTop}>
                        <div className={styles.modeNotice}>
                            <span
                                className={`${styles.modeBadge} ${isEditMode ? styles.modeBadgeEditing : styles.modeBadgeReadonly
                                    }`}
                            >
                                {isEditMode ? "Editing" : "Read Only"}
                            </span>

                            <span className={styles.modeDescription}>
                                {isEditMode
                                    ? "NOTICE: Editing and saving this will notify all users of the update."
                                    : "Click Edit Content to make changes."}
                            </span>
                        </div>

                        <div className={styles.actionButtons}>
                            {!isEditMode ? (
                                <button
                                    type="button"
                                    className={styles.primaryButton}
                                    onClick={handleEnterEditMode}
                                >
                                    Edit Content
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className={styles.secondaryButton}
                                        onClick={handleResetToLastSaved}
                                    >
                                        Reset to Last Saved
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.secondaryButton}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.primaryButton}
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
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
                                        value={draftContent.home.appDescription}
                                        onChange={(e) =>
                                            handleHomeChange("appDescription", e.target.value)
                                        }
                                        rows={3}
                                        disabled={!isEditMode}
                                    />
                                </label>

                                <label className={styles.fieldGroup}>
                                    <span>Company Mission</span>
                                    <textarea
                                        value={draftContent.home.mission}
                                        onChange={(e) =>
                                            handleHomeChange("mission", e.target.value)
                                        }
                                        rows={3}
                                        disabled={!isEditMode}
                                    />
                                </label>

                                <label className={styles.fieldGroup}>
                                    <span>Company Vision</span>
                                    <textarea
                                        value={draftContent.home.vision}
                                        onChange={(e) =>
                                            handleHomeChange("vision", e.target.value)
                                        }
                                        rows={3}
                                        disabled={!isEditMode}
                                    />
                                </label>

                                <div className={styles.fieldGroup}>
                                    <div className={styles.inlineFieldHeader}>
                                        <span>Core Values</span>

                                        {isEditMode && (
                                            <button
                                                type="button"
                                                className={styles.smallButton}
                                                onClick={handleAddCoreValue}
                                            >
                                                Add Value
                                            </button>
                                        )}
                                    </div>

                                    <div className={styles.coreValueList}>
                                        {draftContent.home.coreValues.map((value, index) => (
                                            <div key={index} className={styles.coreValueInputRow}>
                                                <input
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleCoreValueChange(index, e.target.value)
                                                    }
                                                    disabled={!isEditMode}
                                                />

                                                {isEditMode && (
                                                    <button
                                                        type="button"
                                                        className={styles.removeButton}
                                                        onClick={() => handleRemoveCoreValue(index)}
                                                        disabled={draftContent.home.coreValues.length <= 1}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.editorCard}>
                            <div className={styles.cardHeader}>
                                <p>Recent News Content (Pinned notice)</p>
                            </div>

                            <div className={styles.cardBody}>
                                <label className={styles.fieldGroup}>
                                    <span>Pinned Notice Category</span>
                                    <input
                                        value={draftContent.recentNews.pinnedNotice.category}
                                        onChange={(e) =>
                                            handlePinnedNoticeChange("category", e.target.value)
                                        }
                                        disabled={!isEditMode}
                                    />
                                </label>

                                <label className={styles.fieldGroup}>
                                    <span>Pinned Notice Title</span>
                                    <input
                                        value={draftContent.recentNews.pinnedNotice.title}
                                        onChange={(e) =>
                                            handlePinnedNoticeChange("title", e.target.value)
                                        }
                                        disabled={!isEditMode}
                                    />
                                </label>

                                <label className={styles.fieldGroup}>
                                    <span>Pinned Notice Author</span>
                                    <input
                                        value={draftContent.recentNews.pinnedNotice.updatedBy}
                                        onChange={(e) =>
                                            handlePinnedNoticeChange("updatedBy", e.target.value)
                                        }
                                        disabled={!isEditMode}
                                        placeholder="e.g., InfoSec Department"
                                    />
                                </label>

                                <label className={styles.fieldGroup}>
                                    <span>Pinned Notice Message</span>
                                    <textarea
                                        value={draftContent.recentNews.pinnedNotice.message}
                                        onChange={(e) =>
                                            handlePinnedNoticeChange("message", e.target.value)
                                        }
                                        rows={6}
                                        disabled={!isEditMode}
                                    />
                                </label>

                                <div className={styles.previewBox}>
                                    <p className={styles.previewLabel}>Pinned Notice Preview</p>

                                    <div className={styles.noticePreview}>
                                        <p className={styles.noticeMeta}>
                                            {draftContent.recentNews.pinnedNotice.category} •{" "}
                                            {draftContent.recentNews.pinnedNotice.updatedAt}
                                            {draftContent.recentNews.pinnedNotice.updatedBy
                                                ? ` • By ${draftContent.recentNews.pinnedNotice.updatedBy}`
                                                : ""}
                                        </p>

                                        <h2>{draftContent.recentNews.pinnedNotice.title}</h2>

                                        <p>{draftContent.recentNews.pinnedNotice.message}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;