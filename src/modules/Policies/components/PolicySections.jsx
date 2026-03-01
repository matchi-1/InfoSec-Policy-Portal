import { useEffect, useMemo, useState } from "react";
import styles from "../styles/PolicySections.module.css";

/**
 * data shape:
 * [
 *   { id, title, subsections: [{ id, title, content }] }
 * ]
 */
export default function PolicySections({ data = [] }) {
    const sections = useMemo(() => data, [data]);

    const [openSectionId, setOpenSectionId] = useState(null);
    const [activeSubBySection, setActiveSubBySection] = useState({}); // { [sectionId]: subId }

    // reset when we load a different document (data changes)
    useEffect(() => {
        setOpenSectionId(null);
        setActiveSubBySection({});
    }, [sections]);

    const toggleSection = (sectionId) => {
        setOpenSectionId((prev) => {
            const next = prev === sectionId ? null : sectionId;

            // auto-select first subsection on open (if none chosen yet)
            if (next) {
                const sec = sections.find((s) => s.id === next);
                if (sec?.subsections?.length) {
                    setActiveSubBySection((old) => ({
                        ...old,
                        [next]: old[next] ?? sec.subsections[0].id,
                    }));
                }
            }
            return next;
        });
    };

    const openSection = sections.find((s) => s.id === openSectionId);
    const activeSubId = openSection ? activeSubBySection[openSection.id] : null;

    const activeSub =
        openSection?.subsections?.find((sub) => sub.id === activeSubId) ??
        openSection?.subsections?.[0];

    // render content from a string (supports headings-ish + bullets)
    const renderContent = (text = "") => {
        const lines = text.split("\n");
        return lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className={styles.policySpacer} />;

            if (trimmed.startsWith("•")) {
                return (
                    <li key={idx} className={styles.policyBullet}>
                        {trimmed.replace(/^•\s*/, "")}
                    </li>
                );
            }

            const isHeading = /:$/.test(trimmed) || /^\d+\./.test(trimmed);
            return (
                <p
                    key={idx}
                    className={isHeading ? styles.policyLineHeading : styles.policyLine}
                >
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <div className={styles.policyAccordion}>
            {sections.map((section) => {
                const isOpen = section.id === openSectionId;

                return (
                    <div key={section.id} className={styles.policySection}>
                        <button
                            type="button"
                            className={`${styles.policySectionHeader} ${isOpen ? styles.policySectionHeaderOpen : ""
                                }`}
                            onClick={() => toggleSection(section.id)}
                        >
                            <span
                                className={`${styles.policyChevron} ${isOpen ? styles.policyChevronOpen : ""
                                    }`}
                            >
                                ▶
                            </span>
                            <span className={styles.policySectionTitle}>{section.title}</span>
                        </button>

                        {/* always render wrapper so height can animate */}
                        <div
                            className={`${styles.policyPanelOuter} ${isOpen ? styles.policyPanelOuterOpen : ""
                                }`}
                        >
                            <div className={styles.policyPanelInner}>
                                <div className={styles.policyPanel}>
                                    <div className={styles.policySubnav}>
                                        {section.subsections?.map((sub) => {
                                            const isActive = activeSub?.id === sub.id;
                                            return (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    className={`${styles.policySubnavItem} ${isActive ? styles.policySubnavItemActive : ""
                                                        }`}
                                                    onClick={() =>
                                                        setActiveSubBySection((old) => ({
                                                            ...old,
                                                            [section.id]: sub.id,
                                                        }))
                                                    }
                                                >
                                                    {sub.title}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className={styles.policyContent}>
                                        <div className={styles.policyContentInner}>
                                            <h3 className={styles.policyContentTitle}>
                                                {activeSub?.title ?? "Select a subsection"}
                                            </h3>

                                            <div className={styles.policyContentText}>
                                                <ul className={styles.policyBulletList}>
                                                    {activeSub ? renderContent(activeSub.content) : null}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}