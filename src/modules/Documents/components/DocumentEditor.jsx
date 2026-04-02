import { useEffect, useMemo, useState } from "react";
import styles from "../styles/DocumentEditor.module.css";
import { highlightText } from "../../../utils/highlightText";
import PDFUploadModal from "./PDFUploadModal.jsx"
import { MDXEditor, headingsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin, listsPlugin, linkPlugin, imagePlugin, tablePlugin, markdownShortcutPlugin } from '@mdxeditor/editor';
import { BlockTypeSelect, InsertThematicBreak, ListsToggle, UndoRedo, BoldItalicUnderlineToggles, InsertImage, InsertTable } from "@mdxeditor/editor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '@mdxeditor/editor/style.css'


// TEMPORARY vvvvv DUMMY DATA FOR CONTORL TAGS 
import { controlTags } from "../data/controlTags.js";


function BodyContent({ doc, onBack }) {
    const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE
    console.log("(debug) doc: ", doc)
    // const sections = doc.sections ?? [];
    console.log(`(debug) pdf url: ${backend_base_url}/documents/get-pdf/${doc.pdf_filename}`)
    const query = ""; //temporary -Harley
    const [sections, setSections] = useState(doc.sections ?? []);

    const [openSectionId, setOpenSectionId] = useState(null);
    const [activeSubBySection, setActiveSubBySection] = useState({}); // { [sectionId]: subId }

    const [showAuthoredDropdown, setShowAuthoredDropdown] = useState(false);
    const [showReviewedDropdown, setShowReviewedDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    const [editingTitle, setEditingTitle] = useState(false);
    const [currTitle, setCurrTitle] = useState(doc.title);

    const [editingDesc, setEditingDesc] = useState(false);
    const [currDesc, setCurrDesc] = useState(doc.details);

    const [viewingPDF, setViewingPDF] = useState(false);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);

    const [currTags, setCurrTags] = useState(doc.tags ? doc.tags : []);
    const [showTagsDropdown, setShowTagsDropdown] = useState(false);
    const [tagQuery, setTagQuery] = useState("");
    const [filteredTags, setFilteredTags] = useState(controlTags);

    const [sectionTitleEditID, setSectionTitleEditID] = useState(null);
    const [sectionTitleTemp, setSectionTitleTemp] = useState(null);

    const [subTitleEditID, setSubTitleEditID] = useState(null);
    const [subTitleTemp, setSubTitleTemp] = useState(null);

    // const [currentMarkdown, setCurrentMarkdown] = useState("")
    const [initialMarkdown, setInitialMarkdown] = useState("")
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    

    const [selectDate, setSelectDate] = useState(doc.lastReviewed ? new Date(doc.lastReviewed) : new Date());

    const [showConfModal, setShowConfModal] = useState(false);

    // Normalize query
    const q = useMemo(() => query.trim().toLowerCase(), [query]);

    const matches = (value = "") => value.toLowerCase().includes(q);

    // Filter sections/subsections by query
    const filteredSections = useMemo(() => {
        console.log("(debug) updating filtered sections")
        console.log("(debug) sections: ", sections)
        if (!q) return sections;
        console.log("(debug) q exists: ", q)
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

    useEffect(() => {
        if (tagQuery == "") {
            setFilteredTags(controlTags)
        } else {
            const filteredData = controlTags.filter(item => {
                return Object.values(item)
                    .join('')
                    .toLowerCase()
                    .includes(tagQuery.toLowerCase());
            });
            setFilteredTags(filteredData);
        }
    }, [tagQuery])

    const openSection = filteredSections.find((s) => s.id === openSectionId);
    const openSubs = openSection?.subsections ?? [];

    const activeSubId = openSection ? activeSubBySection[openSection.id] : null;
    const activeSub =
        openSubs.find((sub) => sub.id === activeSubId) ?? openSubs[0] ?? null;

    useEffect(() =>{
        setInitialMarkdown(activeSub?.content ?? "")
    }, [activeSub?.id])
    // render content from a string (supports headings-ish + bullets)
    const renderContent = (text = "") => {
        const lines = String(text).split("\n");

        return lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className={styles.policySpacer} />;

            // bullets
            if (trimmed.startsWith("•")) {
                const bulletText = trimmed.replace(/^•\s*/, "");
                return (
                    <li key={idx} className={styles.policyBullet}>
                        {highlightText(bulletText, query, styles.highlight)}
                    </li>
                );
            }

            // headings-ish
            const isHeading = /:$/.test(trimmed) || /^\d+\./.test(trimmed);

            return (
                <p
                    key={idx}
                    className={isHeading ? styles.policyLineHeading : styles.policyLine}
                >
                    {highlightText(trimmed, query, styles.highlight)}
                </p>
            );
        });
    };

    // // if nothing matches, show a simple empty state
    // if (filteredSections.length === 0 && isDocumentSelected) {
    //     return (
    //         <div className={styles.policyAccordion}>
    //             <div className={styles.policyNoResults}>
    //                 <p>No matches found.</p>
    //                 <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
    //                     Try searching by section title, subsection title, or any phrase inside the content.
    //                 </p>
    //             </div>
    //         </div>
    //     );
    // } else if (!isDocumentSelected) {
    //     return (
    //         <div className={styles.policyAccordion}>
    //             <div className={styles.policyNoResults}>
    //                 <p>No document selected yet.</p>
    //                 <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
    //                     Try choosing a document from the left panel to view its sections and content here.
    //                 </p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className={styles.documents}>
            <div className={styles.headerCollapseBar}>
                <p className={styles.backDocuBtn} onClick={onBack}>
                    <img src="/icons/to-left.png"/>
                    Back to Documents
                </p>
                <div className={styles.headerRegion}>
                    <div className={styles.headerDock}>
                        <button
                            className={styles.saveBtn} 
                            onClick={() => {setShowConfModal(true)}}>
                            <img src="/icons/save-green.png"/>
                            <p>Save</p>
                        </button>
                        <button
                            type="button"
                            className={`${styles.headerDetailsToggle} ${isHeaderCollapsed ? styles.headerDetailsToggleCollapsed : ""
                                }`}
                            onClick={() => setIsHeaderCollapsed((prev) => !prev)}
                            aria-expanded={!isHeaderCollapsed}
                            aria-controls="document-details-panel"
                        >
                            <span className={styles.headerDetailsLabel}>Document details</span>

                            <span className={styles.headerDetailsSwitch}>
                                <span
                                    className={`${styles.headerDetailsKnob} ${isHeaderCollapsed ? styles.headerDetailsKnobCollapsed : ""
                                        }`}
                                />
                            </span>

                            <span className={styles.headerDetailsState}>
                                {isHeaderCollapsed ? "Hidden" : "Shown"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`${styles.titleHeaderWrap} ${isHeaderCollapsed ? styles.titleHeaderWrapCollapsed : ""
                    }`}
            >
                {/* header */}
                <div className={styles.titleHeader}>
                    <div className={styles.titleDropdowns}>
                        <div className={styles.title}>
                            {
                                (!editingTitle) ? (
                                    <div className={styles.titleText}>
                                        <h1 onClick={() => setEditingTitle(true)}>{currTitle}</h1>
                                        <button
                                            className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                            onClick={() => setEditingTitle(true)}
                                            aria-label="Edit title"
                                            title="Edit title"
                                        >
                                            <img src="/icons/rename-blue.png" alt="" className={styles.actionIcon} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.titleEditor}>
                                        <input
                                            type="text"
                                            value={currTitle}
                                            onChange={(e) => setCurrTitle(e.target.value)}
                                        />
                                        <button onClick={() => {
                                            setEditingTitle(false);
                                        }}>
                                            <img src="/icons/check-blue.png"></img>
                                            <p>Save</p>
                                        </button>
                                    </div>

                                )
                            }
                        </div>
                        <div className={styles.descContainer}>
                            {!editingDesc ? (
                                <div className={styles.descText}>
                                    <p>{currDesc}</p>
                                    <button
                                        className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                        onClick={() => { setEditingDesc(true) }}
                                        aria-label="Edit description"
                                        title="Edit description"
                                    >
                                        <img src="/icons/edit-icon.png" alt="" className={styles.actionIcon} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.descEdit}>
                                    <textarea
                                        value={currDesc}
                                        onChange={(e) => { setCurrDesc(e.target.value) }}
                                        rows={5}
                                        cols={30}
                                    />
                                    <button onClick={() => { setEditingDesc(false) }}>
                                        <img src="/icons/check-blue.png"></img>
                                        <p>Save</p>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={styles.tagsContainer}>
                            {
                                currTags.map((tag) => {
                                    return (
                                        <p onClick={() => {
                                            setCurrTags((prev) => prev.filter((item) => item !== tag));
                                        }}>{tag} </p>
                                    )
                                })
                            }
                            <button onClick={() => setShowTagsDropdown(true)}>add tag +</button>
                            {
                                showTagsDropdown && <div className={styles.tagsDropdown}>
                                    <div className={styles.tagsDropdownHeader}>
                                        <button onClick={() => {setShowTagsDropdown(false)}}> CLOSE ME </button>
                                    </div>
                                    <div className={styles.tagsDropdownSearch}>
                                        <input type="text" placeholder="Search for tags..." onChange={(e) => {setTagQuery(e.target.value)}}/>
                                    </div>
                                    <div className={styles.tagsDropdownList}>
                                        {
                                            filteredTags.map((tag) => {
                                                if (!currTags.includes(tag)) {
                                                    return(
                                                        <p onClick={() => {
                                                            setCurrTags((prev) => [...prev, tag])
                                                        }}>{tag}</p>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.descButtons}>
                        <div className={styles.dropdowns}>
                            <div className={styles.dropdownContainer}>
                                <p>authored by:</p>
                                <div className={
                                    doc.authoredBy
                                    ? styles.dropDownSectionSelected
                                    : styles.dropDownSection } 
                                    
                                    onClick={() => {
                                    setShowAuthoredDropdown(!showAuthoredDropdown);
                                    setShowReviewedDropdown(false);
                                    setShowDateDropdown(false);
                                }}>
                                    <p>{ doc.authoredBy ? doc.authoredBy : "Select Author" }</p>
                                    <img
                                        src={
                                            doc.authoredBy === ""
                                                ? "/icons/down-white.png"
                                                : "/icons/down.png"
                                        }
                                        alt="Down Icon"
                                    />
                                </div>

                                {showAuthoredDropdown && (
                                    <div className={styles.dropdownList}>
                                        users here
                                    </div>
                                )}
                            </div>

                            <div className={styles.dropdownContainer}>
                                <p>reviewed by:</p>
                                <div className={
                                    doc.reviewedBy
                                    ? styles.dropDownSectionSelected
                                    : styles.dropDownSection }
                                    
                                    onClick={() => {
                                    setShowReviewedDropdown(!showReviewedDropdown);
                                    setShowAuthoredDropdown(false);
                                    setShowDateDropdown(false);
                                }}>
                                    <p>{ doc.reviewedBy ? doc.reviewedBy : "Select Reviewer" }</p>
                                    <img
                                        src={
                                            doc.reviewedBy === ""
                                                ? "/icons/down-white.png"
                                                : "/icons/down.png"
                                        }
                                        alt="Down Icon"
                                    />
                                </div>
                                {showReviewedDropdown && (
                                    <div className={styles.dropdownList}>
                                        users here
                                    </div>
                                )}
                            </div>

                            <div className={styles.dropdownContainer}>
                                <p>last reviewed:</p>
                                <div className={styles.dropDownSectionSelected} onClick={() => {
                                    setShowDateDropdown(!showDateDropdown);
                                    setShowAuthoredDropdown(false);
                                    setShowReviewedDropdown(false);
                                }}>
                                    <p>{selectDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <img
                                        src={ "/icons/down-white.png" }
                                        alt="Down Icon"
                                    />
                                </div>
                                {showDateDropdown && (
                                    <div className={styles.dropdownList}>
                                        <DatePicker showIcon popperPlacement="bottom" selected={selectDate} onChange={(date) => setSelectDate(date)} />
                                        <button onClick={() => {setShowDateDropdown(false)}}>ok</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            {
                                (!viewingPDF) ? (
                                    <button onClick={() => {
                                        doc.pdf_filename == "null" ? alert("no pdfs?") : setViewingPDF(true)
                                    }}>View PDF</button>
                                ) : (
                                    <button onClick={() => { setViewingPDF(false) }}>Close PDF</button>
                                )
                            }
                            <button onClick={() => { setShowUploadModal(true) }}>Upload PDF</button>
                            {fileToUpload != null ? <p>*not saved</p> : null}
                        </div>
                    </div>
                    {/* // FOR DUMMY DATA STYLING DONT FORGET TO UNCOMMENT TODO: -harley */}
                </div>
            </div>

            {/* lower half */}
            {
                (viewingPDF) ? (
                    <div className={styles.pdfViewerContainer}>
                        <iframe
                            className={styles.pdfIframe}
                            src={`${backend_base_url}/documents/get-pdf/${doc.pdf_filename}#view=FitH&toolbar=1&navpanes=0`}
                            title={doc.title}
                        />
                    </div>
                ) : (
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
                                        <span className={styles.policySectionTitle}>
                                            {
                                                section.id === sectionTitleEditID ? (
                                                    <div>
                                                        <input type="text" value={sectionTitleTemp} onChange={(e) => { setSectionTitleTemp(e.target.value) }} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => { stopPropagation(); }} />
                                                        <button onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newSections = sections.map((sect) => {
                                                                if (sect.id === sectionTitleEditID) {
                                                                    return {
                                                                        ...sect,
                                                                        title: sectionTitleTemp
                                                                    }
                                                                } else {
                                                                    return sect;
                                                                }
                                                            });
                                                            setSections(newSections);
                                                            console.log("(debug) new sections: ", sections)
                                                            setSectionTitleEditID(null);
                                                            setSectionTitleTemp(null);
                                                        }}>ok</button>
                                                        <button onClick={(e) => { e.stopPropagation(); setSectionTitleEditID(null); setSectionTitleTemp(null); }}>cancel</button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {highlightText(section.title, query, styles.highlight)}
                                                        <button
                                                            className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSectionTitleEditID(section.id);
                                                                setSectionTitleTemp(section.title);
                                                            }}
                                                            aria-label="Edit section"
                                                            title="Edit section"
                                                        >
                                                            <img src="/icons/edit-icon.png" alt="" className={styles.actionIcon} />
                                                        </button>

                                                        <span>
                                                            <button
                                                                className={`${styles.iconActionBtn} ${styles.trashActionBtn}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSections(
                                                                        sections.filter(sect => sect.id != section.id)
                                                                    )
                                                                }}
                                                                aria-label="Delete section"
                                                                title="Delete section"
                                                            >
                                                                <img src="/icons/trash-icon.png" alt="" className={styles.actionIcon} />
                                                            </button>
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        </span>
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
                                                                onClick={() => {
                                                                    // setInitialMarkdown(activeSub?.content);
                                                                    setActiveSubBySection((old) => ({
                                                                        ...old,
                                                                        [section.id]: sub.id,
                                                                    }))
                                                                }
                                                                }
                                                            >
                                                                {
                                                                    sub.id === subTitleEditID ?
                                                                        (
                                                                            <div>
                                                                                <input type="text" value={subTitleTemp} onChange={(e) => { setSubTitleTemp(e.target.value) }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.stopPropagation() }} />
                                                                                <button onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setSections(prevSections =>
                                                                                        prevSections.map((sect) => {
                                                                                            if (sect.id === openSectionId) {
                                                                                                return ({
                                                                                                    ...sect,
                                                                                                    subsections: sect.subsections.map((sub) => {
                                                                                                        if (sub.id === subTitleEditID) {
                                                                                                            return {
                                                                                                                ...sub,
                                                                                                                title: subTitleTemp
                                                                                                            }
                                                                                                        } else {
                                                                                                            return sub;
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            } else {
                                                                                                return sect;
                                                                                            }
                                                                                        })
                                                                                    )
                                                                                    setSubTitleEditID(null);
                                                                                    setSubTitleTemp(null);
                                                                                }}>ok</button>
                                                                                <button onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setSubTitleEditID(null);
                                                                                    setSubTitleTemp(null);
                                                                                }}>cancel</button>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <span>
                                                                                    {highlightText(sub.title, query, styles.highlight)}
                                                                                </span>
                                                                                <span>
                                                                                    <button
                                                                                        className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setSubTitleEditID(sub.id);
                                                                                            setSubTitleTemp(sub.title);
                                                                                        }}
                                                                                        aria-label="Edit subsection"
                                                                                        title="Edit subsection"
                                                                                    >
                                                                                        <img src="/icons/edit-icon.png" alt="" className={styles.actionIcon} />
                                                                                    </button>
                                                                                </span>

                                                                                <span>
                                                                                    <button
                                                                                        className={`${styles.iconActionBtn} ${styles.trashActionBtn}`}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setSections(prevSections =>
                                                                                                prevSections.map((sect) => {
                                                                                                    if (sect.id === openSectionId) {
                                                                                                        return (
                                                                                                            {
                                                                                                                ...sect,
                                                                                                                subsections: sect.subsections.filter(subsec => subsec.id != sub.id)
                                                                                                            }
                                                                                                        )
                                                                                                    } else {
                                                                                                        return sect
                                                                                                    }
                                                                                                })
                                                                                            )
                                                                                        }}
                                                                                        aria-label="Delete subsection"
                                                                                        title="Delete subsection"
                                                                                    >
                                                                                        <img src="/icons/trash-icon.png" alt="" className={styles.actionIcon} />
                                                                                    </button>
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                }
                                                            </button>
                                                        );
                                                    })}
                                                    <button onClick={() => {
                                                        setSections(prevSections =>
                                                            prevSections.map((section) => {
                                                                if (section.id === openSectionId) {
                                                                    return {
                                                                        ...section,
                                                                        subsections: [...section.subsections,
                                                                        {
                                                                            id: "new" + crypto.randomUUID(),
                                                                            title: "New subsection",
                                                                            content: "New subsection content"
                                                                        }
                                                                        ]
                                                                    }
                                                                } else {
                                                                    return section;
                                                                }
                                                            })
                                                        )
                                                    }}>create new subssection</button>
                                                </div>

                                                <div className={styles.policyContent}>
                                                    <div className={styles.policyContentInner}>
                                                        <h3 className={styles.policyContentTitle}>
                                                            {activeSub?.title ?? ""}
                                                        </h3>

                                                        <div className={styles.policyContentText}>
                                                            {/* <ul className={styles.policyBulletList}>
                                                                {activeSub ? renderContent(activeSub.content) : null}
                                                            </ul> */}
                                                            <MDXEditor
                                                                // key={sections[openSectionId]?.subsections[activeSubId]?.content ?? ""}
                                                                key = {initialMarkdown}
                                                                contentEditableClassName="prose"
                                                                placeholder="Write information here!"
                                                                // markdown={sections[openSectionId]?.subsections[activeSubId]?.content ?? ""}
                                                                // markdown={sections.find((sect)=>sect.id===openSectionId)?.subsections?.find((subsect)=>subsect.id===activeSubId).content ?? ""}
                                                                markdown={activeSub?.content ?? ""}
                                                                onChange={(md) => {
                                                                    setSections(prevSections =>
                                                                        prevSections.map((sect) => {
                                                                            if (sect.id === openSectionId) {
                                                                                return ({
                                                                                    ...sect,
                                                                                    subsections: sect.subsections.map((sub) => {
                                                                                        if (sub.id === activeSubId) {
                                                                                            return {
                                                                                                ...sub,
                                                                                                content: md
                                                                                            }
                                                                                        } else {
                                                                                            return sub;
                                                                                        }
                                                                                    })
                                                                                })
                                                                            } else {
                                                                                return sect;
                                                                            }
                                                                        })
                                                                    )
                                                                }}
                                                                plugins={[
                                                                    toolbarPlugin({
                                                                        toolbarClassName: 'my-classname',
                                                                        toolbarContents: () => (
                                                                            <>
                                                                                <UndoRedo />
                                                                                <BlockTypeSelect />
                                                                                <BoldItalicUnderlineToggles />
                                                                                <ListsToggle />
                                                                                <InsertThematicBreak />
                                                                                <InsertImage />
                                                                                <InsertTable />
                                                                            </>
                                                                        )
                                                                    }),
                                                                    linkPlugin(),
                                                                    tablePlugin(),
                                                                    headingsPlugin(),
                                                                    quotePlugin(),
                                                                    listsPlugin(),
                                                                    thematicBreakPlugin(),
                                                                    markdownShortcutPlugin()

                                                                ]}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className={styles.SectionCreateButton}>
                            <button  onClick={() => {
                                setSections(prevSections => [...prevSections, {
                                    id: "new" + crypto.randomUUID(),
                                    description: "New section description",
                                    title: "New section",
                                    subsections: [
                                        {
                                            id: "new" + crypto.randomUUID(),
                                            title: "New subsection",
                                            content: "New subsection content"
                                        }
                                    ]
                                }])
                            }}>
                                <img src="icons/add-green.png"/>
                                <p>Add Section</p>
                            </button>
                        </div>
                    </div>
                )
            }
            {showUploadModal && <PDFUploadModal setShowUploadModal={setShowUploadModal} setFile={setFileToUpload} />}
            {showConfModal && 
                <div className={styles.confModal}>
                    <p>are u sure</p>
                    <button onClick={async () => {
                        const data = new FormData()
                        data.append('id', doc.id)
                        data.append('title', currTitle)
                        data.append('details', currDesc)
                        // author and review stuff
                        data.append('lastReviewed', selectDate.toISOString())
                        data.append('tags', JSON.stringify(currTags))
                        data.append('sections', JSON.stringify(sections))
                        if (fileToUpload) {
                            data.append('pdf_file', fileToUpload)
                        }
                        const resp = await fetch(`${backend_base_url}/documents/create-update-doc/`, {
                            method: 'POST',
                            body: data
                        })
                    }}>yes</button>
                    <button onClick={() => {setShowConfModal(false)}}>no</button>
                </div>
            }
        </div>
    );
}

export default BodyContent;