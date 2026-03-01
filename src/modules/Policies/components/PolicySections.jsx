import { useEffect, useMemo, useState } from "react";
import styles from "../styles/PolicySections.module.css";

/**
 * data shape:
 * [
 *   { id, title, description?, subsections: [{ id, title, content }] }
 * ]
 *
 * query:
 * - filters sections by section.title/description OR subsection.title/content
 * - if section matches directly, we keep all subsections
 * - if only subsections match, we keep only matching subsections
 */
export default function PolicySections({ data = [], query = "" }) {
    const sections = useMemo(() => data ?? [], [data]);

    const [openSectionId, setOpenSectionId] = useState(null);
    const [activeSubBySection, setActiveSubBySection] = useState({}); // { [sectionId]: subId }

    // Reset when we load a different document (data changes)
    useEffect(() => {
        setOpenSectionId(null);
        setActiveSubBySection({});
    }, [data]);

    // Normalize query
    const q = useMemo(() => query.trim().toLowerCase(), [query]);

    const matches = (value = "") => value.toLowerCase().includes(q);

    // Filter sections/subsections by query
    const filteredSections = useMemo(() => {
        if (!q) return sections;

        const out = [];

        for (const sec of sections) {
            const secTitle = sec?.title ?? "";
            const secDesc = sec?.description ?? "";
            const secMatches = matches(secTitle) || matches(secDesc);

            const subs = Array.isArray(sec?.subsections) ? sec.subsections : [];

            // If section matches directly, keep ALL its subsections (context)
            if (secMatches) {
                out.push({ ...sec, subsections: subs });
                continue;
            }

            // Otherwise keep only matching subsections
            const matchingSubs = subs.filter((sub) => {
                const subTitle = sub?.title ?? "";
                const subContent = sub?.content ?? "";
                return matches(subTitle) || matches(subContent);
            });

            if (matchingSubs.length > 0) {
                out.push({ ...sec, subsections: matchingSubs });
            }
        }

        return out;
    }, [sections, q]);

    // If searching: auto-open first matching section and select its first subsection
    useEffect(() => {
        if (!q) return;

        if (filteredSections.length === 0) {
            setOpenSectionId(null);
            return;
        }

        const first = filteredSections[0];
        setOpenSectionId(first.id);

        if (first?.subsections?.length) {
            setActiveSubBySection((old) => ({
                ...old,
                [first.id]: first.subsections[0].id,
            }));
        }
    }, [q, filteredSections]);

    const toggleSection = (sectionId) => {
        setOpenSectionId((prev) => {
            const next = prev === sectionId ? null : sectionId;

            // auto-select first subsection on open (if none chosen yet OR if current is missing)
            if (next) {
                const sec = filteredSections.find((s) => s.id === next);
                const subs = sec?.subsections ?? [];

                if (subs.length) {
                    setActiveSubBySection((old) => {
                        const current = old[next];
                        const stillExists = subs.some((s) => s.id === current);
                        return {
                            ...old,
                            [next]: stillExists ? current : subs[0].id,
                        };
                    });
                }
            }

            return next;
        });
    };

    const openSection = filteredSections.find((s) => s.id === openSectionId);
    const openSubs = openSection?.subsections ?? [];

    const activeSubId = openSection ? activeSubBySection[openSection.id] : null;
    const activeSub =
        openSubs.find((sub) => sub.id === activeSubId) ?? openSubs[0] ?? null;

    // render content from a string (supports headings-ish + bullets)
    const renderContent = (text = "") => {
        const lines = String(text).split("\n");
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

    // if nothing matches, show a simple empty state
    if (filteredSections.length === 0) {
        return (
            <div className={styles.policyAccordion}>
                <div className={styles.policyNoResults}>
                    <p>No matches found.</p>
                    <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
                        Try searching by section title, subsection title, or any phrase inside the content.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.policyAccordion}>
            {filteredSections.map((section) => {
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
                                        {(section.subsections ?? []).map((sub) => {
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