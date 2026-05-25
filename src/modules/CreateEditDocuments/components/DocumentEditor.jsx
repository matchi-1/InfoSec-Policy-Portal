import { use, useEffect, useMemo, useState, useRef } from "react";
import styles from "../styles/DocumentEditor.module.css";
import { highlightText } from "../../../utils/highlightText";
import PDFUploadModal from "./PDFUploadModal.jsx"
import { MDXEditor, headingsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin, listsPlugin, linkPlugin, imagePlugin, tablePlugin, markdownShortcutPlugin } from '@mdxeditor/editor';
import { BlockTypeSelect, InsertThematicBreak, ListsToggle, UndoRedo, BoldItalicUnderlineToggles, InsertImage, InsertTable } from "@mdxeditor/editor";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import CustomDatePicker from "../../../shared/components/CustomDatePicker.jsx";
import '@mdxeditor/editor/style.css'
import { useNavigate } from "react-router-dom";


// TEMPORARY vvvvv DUMMY DATA FOR CONTORL TAGS 
// import { controlTags } from "../data/controlTags.js";
import { initial, set } from "lodash";


function BodyContent({ doc, onBack, setHasUnsavedModuleChanges }) {
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
    const [currTitleTemp, setCurrTitleTemp] = useState(null);

    const [editingDesc, setEditingDesc] = useState(false);
    const [currDesc, setCurrDesc] = useState(doc.details);
    const [currDescTemp, setCurrDescTemp] = useState(null);

    const [viewingPDF, setViewingPDF] = useState(false);
    const [isPdfFullscreenOpen, setIsPdfFullscreenOpen] = useState(false);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [fileName, setFileName] = useState(doc.pretty_pdf_filename ?? "null")
    const [fileNameTemp, setFileNameTemp] = useState("null")

    const [currTags, setCurrTags] = useState(doc.tags ? doc.tags : []);
    const [showTagsDropdown, setShowTagsDropdown] = useState(false);
    const [tagQuery, setTagQuery] = useState("");
    const [controlTags, setControlTags] = useState(null);
    const [filteredTags, setFilteredTags] = useState(controlTags);

    const [sectionTitleEditID, setSectionTitleEditID] = useState(null);
    const [sectionTitleTemp, setSectionTitleTemp] = useState(null);

    const [subTitleEditID, setSubTitleEditID] = useState(null);
    const [subTitleTemp, setSubTitleTemp] = useState(null);

    const [showTagModal, setShowTagModal] = useState(false);
    const [tagTxt, setTagTxt] = useState("")

    const [showAddTagConfirmModal, setShowAddTagConfirmModal] = useState(false);
    const [tagToast, setTagToast] = useState(null);
    const tagToastTimerRef = useRef(null);
    const [showPdfReplacementToast, setShowPdfReplacementToast] = useState(false);

    // const [currentMarkdown, setCurrentMarkdown] = useState("")
    // const [initialMarkdown, setInitialMarkdown] = useState("")
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);


    // const [selectDate, setSelectDate] = useState(doc.lastReviewed ? new Date(doc.lastReviewed) : new Date());
    const [selectDate, setSelectDate] = useState(doc.lastReviewed ? dayjs(doc.lastReviewed) : dayjs());
    const normalizeDate = (d) => d ? new Date(d).toISOString() : ""

    const [showConfModal, setShowConfModal] = useState(false);

    const [authoredBy, setAuthoredBy] = useState(doc.authoredBy ?? null);
    const [reviewedBy, setReviewedBy] = useState(doc.reviewedBy ?? null);
    const [currAuthorName, setCurrAuthorName] = useState(doc.authoredBy ? doc.authorName : null)
    const [currReviewerName, setCurrReviewerName] = useState(doc.reviewedBy ? doc.reviewerName : null)
    const [userList, setUserList] = useState([]);

    const showTagToast = (title, message) => {
        setTagToast({ title, message });

        if (tagToastTimerRef.current) {
            clearTimeout(tagToastTimerRef.current);
        }

        tagToastTimerRef.current = setTimeout(() => {
            setTagToast(null);
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (tagToastTimerRef.current) {
                clearTimeout(tagToastTimerRef.current);
            }
        };
    }, []);

    const handleOpenAddTagConfirm = () => {
        const cleanedTag = tagTxt.trim();

        if (!cleanedTag) {
            showTagToast("Tag Required", "Please enter a tag name before continuing.");
            return;
        }

        const tagAlreadyExists = controlTags?.some(
            (tag) => tag.tag_content?.trim().toLowerCase() === cleanedTag.toLowerCase()
        );

        if (tagAlreadyExists) {
            showTagToast("Tag Already Exists", `"${cleanedTag}" is already in the tag list.`);
            return;
        }

        setShowTagModal(false);
        setShowAddTagConfirmModal(true);
    };

    const handleConfirmAddTag = async () => {
        const cleanedTag = tagTxt.trim();

        if (!cleanedTag) {
            setShowAddTagConfirmModal(false);
            showTagToast("Tag Required", "Please enter a tag name before continuing.");
            return;
        }

        try {
            const resp = await fetch(`${backend_base_url}/documents/add-tag/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tag_content: cleanedTag,
                }),
            });

            if (!resp.ok) {
                throw new Error("Failed to add tag.");
            }

            await get_tags();

            setTagTxt("");
            setShowAddTagConfirmModal(false);
            setShowTagsDropdown(true);

            showTagToast("Tag Added", `"${cleanedTag}" was added to the tag list.`);
        } catch (error) {
            console.error("Failed to add tag:", error);

            setShowAddTagConfirmModal(false);
            setShowTagModal(true);

            showTagToast("Failed to Add Tag", "Please try again.");
        }
    };

    const handleCancelTagInput = () => {
        setShowTagModal(false);
        setTagTxt("");
    };

    const handleCancelAddTagConfirm = () => {
        setShowAddTagConfirmModal(false);
        setShowTagModal(true);
    };

    const get_tags = async () => {
        const resp = await fetch(`${backend_base_url}/documents/get-tags/`);
        const data = await resp.json()
        console.log("(debug) tags from backend: ", data)
        setControlTags(data)
    }

    useEffect(() => {
        const get_users = async () => {
            const resp = await fetch(`${backend_base_url}/documents/get-users/`);
            const data = await resp.json()
            setUserList(data);
        }
        get_users();
        get_tags();
    }, [])

    useEffect(() => {
        console.log("(debug) tags: ", controlTags)
    }, [controlTags])

    useEffect(() => {
        console.log("user list")
        console.log(userList)
    }, [userList])

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

    // useEffect(() => {
    //     if (tagQuery == "") {
    //         setFilteredTags(controlTags)
    //     } else {
    //         const filteredData = controlTags.filter(item => {
    //             return Object.values(item)
    //                 .join('')
    //                 .toLowerCase()
    //                 .includes(tagQuery.toLowerCase());
    //         });
    //         setFilteredTags(filteredData);
    //     }
    // }, [tagQuery])
    useEffect(() => {
        if (!controlTags) return;

        if (tagQuery.trim() === "") {
            setFilteredTags(controlTags);
        } else {
            const q = tagQuery.toLowerCase();

            const filteredData = controlTags.filter(item =>
                item.tag_content?.toLowerCase().includes(q)
            );

            setFilteredTags(filteredData);
        }
    }, [tagQuery, controlTags]);

    const openSection = filteredSections.find((s) => s.id === openSectionId);
    const openSubs = openSection?.subsections ?? [];

    const activeSubId = openSection ? activeSubBySection[openSection.id] : null;
    const activeSub =
        openSubs.find((sub) => sub.id === activeSubId) ?? openSubs[0] ?? null;

    useEffect(() => {
        console.log("(debug) activesubid changing, activesub is now now: ", activeSub)
        // setInitialMarkdown((activeSub && activeSub.content) ? activeSub.content : "")
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

    const isSaveValid =
        doc?.id &&
        currTitle?.trim() &&
        selectDate &&
        authoredBy &&
        reviewedBy &&
        JSON.parse(localStorage.getItem("user"))?.user_id;

    const [showFileDeleteModal, setShowFileDeleteModal] = useState(false);
    const [showBackConfirmModal, setShowBackConfirmModal] = useState(false);
    const [showClearTagsModal, setShowClearTagsModal] = useState(false);

    const [showSaveToast, setShowSaveToast] = useState(false);
    const [showUploadToast, setShowUploadToast] = useState(false);
    const [showRemoveToast, setShowRemoveToast] = useState(false);
    const [deletedFile, setDeletedFile] = useState("");

    const currentFileName =
        fileNameTemp !== "null"
            ? fileNameTemp
            : fileName !== "null" && fileName !== deletedFile
                ? fileName
                : "null";

    const initialDocRef = useRef(null)


    useEffect(() => {
        if (!doc) return

        initialDocRef.current = {
            title: doc.title || "",
            details: doc.details || "",
            lastReviewed: doc.lastReviewed,
            tags: JSON.stringify(doc.tags || []),
            sections: JSON.stringify(doc.sections || []),
            authoredBy: doc.authoredBy || "",
            reviewedBy: doc.reviewedBy || "",
            pdfFileName: doc.pretty_pdf_filename ?? "null",
            pdfFilename: doc.pdf_filename ?? "null",
        };
    }, [doc])

    useEffect(() => {
        setFileToUpload(null);
        setFileName(doc.pretty_pdf_filename ?? "null");
        setFileNameTemp("null");
    }, [doc.id]);

    const hasUnsavedChanges = () => {
        if (!initialDocRef.current) return false;

        const normalize = (value) => (value ?? "").toString().trim();

        const normalizeDateValue = (value) => {
            if (!value) return "";

            const parsedDate = dayjs(value);
            return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
        };

        const currentPdfName = fileName !== currentFileName

        const titleChanged =
            normalize(currTitle) !== normalize(initialDocRef.current.title);

        const descChanged =
            normalize(currDesc) !== normalize(initialDocRef.current.details);

        const reviewedDateChanged =
            normalizeDateValue(selectDate) !==
            normalizeDateValue(initialDocRef.current.lastReviewed);

        const authorChanged =
            normalize(authoredBy) !== normalize(initialDocRef.current.authoredBy);

        const reviewerChanged =
            normalize(reviewedBy) !== normalize(initialDocRef.current.reviewedBy);

        const fileChanged =
            fileToUpload !== null ||
            normalize(currentPdfName) !== normalize(initialDocRef.current.pdfFileName);

        const tagsChanged =
            JSON.stringify(currTags) !== initialDocRef.current.tags;

        const sectionsChanged =
            JSON.stringify(sections) !== initialDocRef.current.sections;

        return (
            titleChanged ||
            descChanged ||
            reviewedDateChanged ||
            authorChanged ||
            reviewerChanged ||
            fileChanged ||
            tagsChanged ||
            sectionsChanged
        );
    };

    const hasChanges = hasUnsavedChanges();

    const hasRemovedExistingPdfWithoutReplacement =
        doc?.id !== "new" &&
        initialDocRef.current?.pdfFileName &&
        initialDocRef.current.pdfFileName !== "null" &&
        fileName === "null" &&
        fileNameTemp === "null" &&
        !fileToUpload;


    const canSave =
        isSaveValid &&
        hasChanges &&
        !hasRemovedExistingPdfWithoutReplacement;

    useEffect(() => {
        setHasUnsavedModuleChanges?.(hasUnsavedChanges());
    }, [
        currTitle,
        currDesc,
        fileToUpload,
        fileName,
        fileNameTemp,
        currTags,
        sections,
        authoredBy,
        reviewedBy,
        selectDate,
        setHasUnsavedModuleChanges,
    ]);

    useEffect(() => {
        return () => {
            setHasUnsavedModuleChanges?.(false);
        };
    }, [setHasUnsavedModuleChanges]);

    const hasSavedPdf =
        doc?.id !== "new" &&
        doc?.pdf_filename &&
        doc.pdf_filename !== "null" &&
        fileName !== "null";

    const pdfPreviewUrl = hasSavedPdf
        ? `${backend_base_url}/documents/get-pdf/${doc.pdf_filename}#view=FitH&toolbar=1&navpanes=0`
        : "#";

    useEffect(() => {
        if (!hasSavedPdf) {
            setViewingPDF(false);
            setIsPdfFullscreenOpen(false);
        }
    }, [hasSavedPdf]);

    useEffect(() => {
        if (!isPdfFullscreenOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsPdfFullscreenOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isPdfFullscreenOpen]);


    const showPdfReplacementRequiredToast = () => {
        setShowPdfReplacementToast(true);

        setTimeout(() => {
            setShowPdfReplacementToast(false);
        }, 3000);
    };

    return (
        <div className={styles.documents}>
            <div className={styles.headerCollapseBar}>
                <p className={styles.backDocuBtn}
                    onClick={() => {
                        if (hasUnsavedChanges()) {
                            setShowBackConfirmModal(true)
                        } else {
                            onBack()
                        }
                    }}
                >
                    <img src="/icons/to-left.png" />
                    <p>Back</p>
                </p>
                <div className={styles.headerRegion}>
                    <div className={styles.headerDock}>
                        <p className={styles.headerCollapseHint}>
                            {isHeaderCollapsed
                                ? "Click here to show header →"
                                : "Click here to collapse header →"}
                        </p>
                        <button
                            type="button"
                            className={`${styles.headerDetailsToggle} ${isHeaderCollapsed ? styles.headerDetailsToggleCollapsed : ""
                                }`}
                            onClick={() => setIsHeaderCollapsed((prev) => !prev)}
                        >
                            {isHeaderCollapsed ? "↓" : "↑"}
                        </button>
                        {/* <button
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
                        </button> */}
                        {canSave ? (
                            <button
                                type="button"
                                className={styles.saveBtn}
                                onClick={() => {
                                    setShowConfModal(true);
                                }}
                            >
                                <img src="/icons/save-green.png" />
                                <p>Save</p>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.saveBtnDisabled}
                                aria-label={
                                    hasRemovedExistingPdfWithoutReplacement
                                        ? "Upload a replacement PDF before saving"
                                        : !isSaveValid
                                            ? "Complete all required fields before saving"
                                            : "No changes to save"
                                }
                                title={
                                    hasRemovedExistingPdfWithoutReplacement
                                        ? "Upload a replacement PDF before saving"
                                        : !isSaveValid
                                            ? "Complete all required fields before saving"
                                            : "No changes to save"
                                }
                                disabled={!hasRemovedExistingPdfWithoutReplacement}
                                onClick={() => {
                                    if (hasRemovedExistingPdfWithoutReplacement) {
                                        showPdfReplacementRequiredToast();
                                    }
                                }}
                            >
                                <img src="/icons/save-green.png" />
                                <p>Save</p>
                            </button>
                        )}
                        {/* <button
                            className={styles.saveBtn}
                            onClick={() => { setShowConfModal(true) }}>
                            <img src="/icons/save-green.png" />
                            <p>Save</p>
                        </button> */}
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
                                        <h1 onDoubleClick={() => {
                                            setEditingTitle(true);
                                            setCurrTitleTemp(currTitle);
                                        }}
                                        >{currTitle}</h1>
                                        <button
                                            className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                            onClick={() => {
                                                setEditingTitle(true);
                                                setCurrTitleTemp(currTitle);
                                            }}
                                            aria-label="Rename title"
                                            title="Rename title"
                                        >
                                            <img src="/icons/rename-blue.png" alt="" className={styles.actionIcon} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.titleEditor}>
                                        <input
                                            type="text" autoFocus
                                            value={currTitleTemp}
                                            onChange={(e) => setCurrTitleTemp(e.target.value)}
                                            onBlur={() => {
                                                setEditingTitle(false)
                                                setCurrTitle(currTitleTemp)
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                setEditingTitle(false);
                                                setCurrTitle(currTitleTemp);
                                            }}
                                            aria-label="Save"
                                            title="Save"
                                        >
                                            <img src="/icons/check-blue.png" alt="" className={styles.actionIcon} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingTitle(false);
                                            }}
                                            aria-label="Cancel"
                                            title="Cancel"
                                        >
                                            <img src="/icons/close-blue.png" alt="" className={styles.actionIcon} />
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                        <div className={styles.descContainer}>
                            {!editingDesc ? (
                                <div className={styles.descText}>
                                    <p
                                        onDoubleClick={() => {
                                            setEditingDesc(true)
                                            setCurrDescTemp(currDesc)
                                        }}
                                    >{currDesc}</p>
                                    <button
                                        className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                        onClick={() => {
                                            setEditingDesc(true)
                                            setCurrDescTemp(currDesc)
                                        }}
                                        aria-label="Edit description"
                                        title="Edit description"
                                    >
                                        <img src="/icons/rename-blue.png" alt="" className={styles.actionIcon} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.descText}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            setEditingDesc(false);
                                            setCurrDesc(currDescTemp);
                                        }
                                    }}
                                >
                                    <textarea
                                        autoFocus
                                        value={currDescTemp}
                                        onChange={(e) => {
                                            setCurrDescTemp(e.target.value);

                                            // e.target.style.height = "auto";
                                            // e.target.style.height = `${e.target.scrollHeight}px`;
                                        }}
                                        rows={3}
                                    />
                                    <button
                                        onClick={() => {
                                            setEditingDesc(false);
                                            setCurrDesc(currDescTemp);
                                        }}
                                        aria-label="Save"
                                        title="Save"
                                    >
                                        <img src="/icons/check-blue.png" alt="" className={styles.actionIcon} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingDesc(false);
                                        }}
                                        aria-label="Cancel"
                                        title="Cancel"
                                    >
                                        <img src="/icons/close-blue.png" alt="" className={styles.actionIcon} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={styles.tagsContainer}>
                            <button onClick={() => setShowTagsDropdown(!showTagsDropdown)}>
                                <div className={styles.chipsContainer}>
                                    {currTags.length > 0 ?
                                        currTags.map((tag) => {
                                            return (
                                                <div className={styles.tagChips}>
                                                    <p>{tag.tag_content}</p>
                                                    <img
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrTags((prev) => prev.filter((item) => item !== tag));
                                                        }}
                                                        src="/icons/close.png" alt="Remove tag" />
                                                </div>
                                            )
                                        }) : <h3>Add ISO / NIST Tags</h3>
                                    }
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                    {currTags.length > 0 ? (
                                        <img
                                            style={{ width: "1.4rem", height: "1.4rem" }}
                                            src="/icons/close-gray.png"
                                            alt="remove all tags"
                                            title="Remove all tags"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowClearTagsModal(true);
                                            }}
                                        />
                                    ) : ""
                                    }
                                    {/* <img
                                        src="/icons/down-gray.png" alt="collapse tag"
                                        onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                                    /> */}
                                    <img
                                        className={`${styles.dropdownArrow} ${showTagsDropdown ? styles.dropdownArrowOpen : ""
                                            }`}
                                        style={{ width: '1.2rem', height: '1.2rem' }}
                                        src="/icons/down-gray.png"
                                        alt="collapse tag"
                                        onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                                    />
                                </div>
                            </button>
                            {
                                showTagsDropdown && <div className={styles.tagsDropdown}>
                                    <div className={styles.tagsDropdownSearch}>
                                        <img src="/icons/search-icon.png" />
                                        <input type="text" placeholder="Search for tags..." onChange={(e) => { setTagQuery(e.target.value) }} />
                                    </div>
                                    <div className={styles.tagsDropdownList}>
                                        <button
                                            type="button"
                                            className={styles.addTagOption}
                                            onClick={() => {
                                                setShowTagModal(true);
                                            }}
                                        >
                                            <span className={styles.addTagIcon}>+</span>
                                            <span>Add new tag</span>
                                        </button>
                                        {
                                            filteredTags.length == 0 ? <p style={{ fontSize: '0.75rem', padding: '0.5rem', opacity: 0.7 }}>No tags found</p> :
                                                filteredTags.map((tag) => {
                                                    if (!currTags.includes(tag)) {
                                                        return (
                                                            <p onClick={() => {
                                                                setCurrTags((prev) => [...prev, tag])
                                                            }}>{tag.tag_content}</p>
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
                                <div className={styles.dropdownWrapper}>
                                    <div className={
                                        doc.authoredBy
                                            ? styles.dropDownSectionSelected
                                            : styles.dropDownSection}

                                        onClick={() => {
                                            setShowAuthoredDropdown(!showAuthoredDropdown);
                                            setShowReviewedDropdown(false);
                                            setShowDateDropdown(false);
                                        }}>
                                        <p>{authoredBy ? currAuthorName : "Select Author"}</p>
                                        {/* <img
                                            src={
                                                doc.authoredBy === ""
                                                    ? "/icons/down.png"
                                                    : "/icons/down-white.png"
                                            }
                                            alt="Down Icon"
                                        /> */}
                                        <img
                                            className={`${styles.dropdownArrow} ${showAuthoredDropdown ? styles.dropdownArrowOpen : ""
                                                }`}
                                            src={
                                                doc.authoredBy === ""
                                                    ? "/icons/down.png"
                                                    : "/icons/down-white.png"
                                            }
                                            alt="Down Icon"
                                        />
                                    </div>
                                    {showAuthoredDropdown && (
                                        <div className={styles.dropdownList}>
                                            {userList.map((user) => {
                                                return (
                                                    <p onClick={() => {
                                                        setAuthoredBy(user.id)
                                                        setShowAuthoredDropdown(false)
                                                        setCurrAuthorName(`${user.first_name} ${user.last_name}`)
                                                    }}>{user.first_name} {user.last_name}</p>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className={styles.dropdownContainer}>
                                <p>reviewed by:</p>
                                <div className={styles.dropdownWrapper}>
                                    <div className={
                                        doc.reviewedBy
                                            ? styles.dropDownSectionSelected
                                            : styles.dropDownSection}

                                        onClick={() => {
                                            setShowReviewedDropdown(!showReviewedDropdown);
                                            setShowAuthoredDropdown(false);
                                            setShowDateDropdown(false);
                                        }}>
                                        <p>{reviewedBy ? currReviewerName : "Select Reviewer"}</p>
                                        <img
                                            className={`${styles.dropdownArrow} ${showReviewedDropdown ? styles.dropdownArrowOpen : ""
                                                }`}
                                            src={
                                                doc.reviewedBy === ""
                                                    ? "/icons/down.png"
                                                    : "/icons/down-white.png"
                                            }
                                            alt="Down Icon"
                                        />
                                    </div>
                                    {showReviewedDropdown && (
                                        <div className={styles.dropdownList}>
                                            {userList.map((user) => {
                                                return (
                                                    <p onClick={() => {
                                                        setReviewedBy(user.id)
                                                        setShowReviewedDropdown(false)
                                                        setCurrReviewerName(`${user.first_name} ${user.last_name}`)
                                                    }}>{user.first_name} {user.last_name}</p>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.dropdownContainer}>
                                <p>last reviewed:</p>
                                <div className={styles.dropdownWrapper}>
                                    <div className={styles.dropDownSectionSelected} onClick={() => {
                                        // setShowDateDropdown(!showDateDropdown);
                                        setShowAuthoredDropdown(false);
                                        setShowReviewedDropdown(false);
                                    }}>
                                        <CustomDatePicker
                                            format="MM / DD / YYYY"
                                            value={selectDate}
                                            onChange={(date) => setSelectDate(date)}
                                            slotProps={{
                                                popper: {
                                                    placement: "bottom-start",
                                                },
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                }
                                            }}
                                        />
                                        {/* <p>{selectDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <img
                                        src={"/icons/down-white.png"}
                                        alt="Down Icon"
                                    /> */}
                                    </div>
                                    {/* {showDateDropdown && (
                                    <div className={styles.dropdownList}>
                                        <DatePicker showIcon popperPlacement="bottom" selected={selectDate} onChange={(date) => setSelectDate(date)} />
                                        <button onClick={() => { setShowDateDropdown(false) }}>ok</button>
                                    </div>
                                )} */}
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            {hasSavedPdf && (
                                <>
                                    <button
                                        type="button"
                                        className={styles.pdfFullscreenBtn}
                                        onClick={() => setIsPdfFullscreenOpen(true)}
                                    >
                                        View PDF Fullscreen
                                    </button>

                                    {!viewingPDF ? (
                                        <button
                                            type="button"
                                            className={styles.viewBtn}
                                            onClick={() => setViewingPDF(true)}
                                        >
                                            View PDF
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className={styles.closeBtn}
                                            onClick={() => setViewingPDF(false)}
                                        >
                                            Close PDF
                                        </button>
                                    )}
                                </>
                            )}
                            {currentFileName !== "null" ? (
                                <button className={styles.pdfChip}>
                                    <div>
                                        <img src="/icons/pdf.png" alt="" className={styles.actionIcon} />
                                        <p>{currentFileName}</p>
                                    </div>
                                    <img
                                        src="/icons/close-blue.png" alt="" className={styles.actionIcon}
                                        onClick={() => {
                                            setShowFileDeleteModal(true)
                                        }} />
                                </button>
                            ) : (
                                <button
                                    className={styles.uploadBtn}
                                    onClick={() => { setShowUploadModal(true) }}>
                                    Upload PDF
                                </button>
                            )}
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
                            src={pdfPreviewUrl}
                            title={doc.title}
                        />
                    </div>
                ) : (
                    <div className={isHeaderCollapsed ? styles.policyAccordionFull : styles.policyAccordion}>
                        {filteredSections.map((section) => {
                            const isOpen = section.id === openSectionId && section.id != sectionTitleEditID;
                            return (
                                <div key={section.id}
                                    className={`${styles.policySection} ${isOpen ? styles.policySectionOpen : ""
                                        }`}>
                                    <button
                                        type="button"
                                        className={`${styles.policySectionHeader} ${isOpen ? styles.policySectionHeaderOpen : ""
                                            }`}
                                        onKeyDown={(e) => { e.stopPropagation(); }}
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
                                                        <input type="text" autoFocus value={sectionTitleTemp} onChange={(e) => { setSectionTitleTemp(e.target.value) }} onClick={(e) => e.stopPropagation()}
                                                            onKeyDown={(e) => { e.stopPropagation(); }}
                                                            onMouseDown={(e) => { e.stopPropagation(); }}
                                                            onBlur={() => {
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
                                                            }}
                                                        />
                                                        <div>
                                                            <button
                                                                className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                                                onKeyDown={(e) => { e.stopPropagation(); }}
                                                                onMouseDown={(e) => { e.preventDefault() }}
                                                                onClick={(e) => {
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
                                                                }}
                                                                aria-label="Save"
                                                                title="Save"
                                                            >
                                                                <img src="/icons/check-blue.png" alt="" className={styles.actionIcon} />
                                                            </button>
                                                            <button
                                                                className={`${styles.iconActionBtn} ${styles.trashActionBtn}`}
                                                                onKeyDown={(e) => { e.stopPropagation(); }}
                                                                onMouseDown={(e) => { e.preventDefault() }}
                                                                onClick={(e) => { e.stopPropagation(); setSectionTitleEditID(null); setSectionTitleTemp(null); }}
                                                                aria-label="Cancel"
                                                                title="Cancel"
                                                            >
                                                                <img src="/icons/close-blue.png" alt="" className={styles.actionIcon} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {highlightText(section.title, query, styles.highlight)}
                                                        <div>
                                                            <button
                                                                className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSectionTitleEditID(section.id);
                                                                    setSectionTitleTemp(section.title);
                                                                }}
                                                                aria-label="Rename section"
                                                                title="Rename section"
                                                            >
                                                                <img src="/icons/rename-blue.png" alt="" className={styles.actionIcon} />
                                                            </button>

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
                                                                <img src="/icons/delete.png" alt="" className={styles.actionIcon} />
                                                            </button>
                                                        </div>
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
                                                                                <input type="text" autoFocus value={subTitleTemp} onChange={(e) => { setSubTitleTemp(e.target.value) }} onClick={(e) => { e.stopPropagation() }} onMouseDown={(e) => { e.stopPropagation() }} onBlur={() => {
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
                                                                                }} />
                                                                                <button onMouseDown={(e) => { e.preventDefault() }} onClick={(e) => {
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
                                                                                }}
                                                                                    aria-label="Save"
                                                                                    title="Save"
                                                                                >
                                                                                    <img src="/icons/check-blue.png" alt="" className={styles.actionIcon} />
                                                                                </button>
                                                                                <button onMouseDown={(e) => { e.preventDefault() }} onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setSubTitleEditID(null);
                                                                                    setSubTitleTemp(null);
                                                                                }}
                                                                                    aria-label="Cancel"
                                                                                    title="Cancel"
                                                                                >
                                                                                    <img src="/icons/close-blue.png" alt="" className={styles.actionIcon} />
                                                                                </button>
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
                                                                                        <img src="/icons/rename-blue.png" alt="" className={styles.actionIcon} />
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
                                                                                        <img src="/icons/delete.png" alt="" className={styles.actionIcon} />
                                                                                    </button>
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                }
                                                            </button>
                                                        );
                                                    })}
                                                    <div className={styles.SubsectionCreateButton}>
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
                                                        }}>
                                                            <img src="icons/add-green.png" />
                                                            <p>Add Subsection</p>
                                                        </button>
                                                    </div>
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
                                                                key={activeSub?.id}
                                                                contentEditableClassName="prose"
                                                                placeholder="Write information here!"
                                                                // markdown={sections[openSectionId]?.subsections[activeSubId]?.content ?? ""}
                                                                // markdown={sections.find((sect)=>sect.id===openSectionId)?.subsections?.find((subsect)=>subsect.id===activeSubId).content ?? ""}
                                                                markdown={activeSub?.content ?? ""}
                                                                onChange={(md) => {
                                                                    console.log("(debug) markdown: ", md)
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
                            <button onClick={() => {
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
                                <img src="icons/add-green.png" />
                                <p>Add Section</p>
                            </button>
                        </div>
                    </div>
                )
            }
            {showUploadModal && (
                <PDFUploadModal
                    setShowUploadModal={setShowUploadModal}
                    setFile={setFileToUpload}
                    setFileNameTemp={setFileNameTemp}
                />
            )}
            {showConfModal &&
                <div className={styles.confModalOverlay}>
                    <div className={styles.confModal}>
                        <div className={styles.confModalHeader}>
                            <h3>Save Changes?</h3>
                            <p>
                                This will update the document and overwrite the current version.
                            </p>
                        </div>

                        <div className={styles.confModalButtons}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setShowConfModal(false)
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.confirmBtn}
                                onClick={async () => {
                                    setShowConfModal(false)

                                    if (hasRemovedExistingPdfWithoutReplacement) {
                                        showPdfReplacementRequiredToast();
                                        return;
                                    }

                                    const data = new FormData()

                                    data.append('id', doc.id)
                                    data.append('title', currTitle)
                                    data.append('details', currDesc)
                                    data.append('lastReviewed', selectDate.toISOString())
                                    data.append('tags', JSON.stringify(currTags))
                                    data.append('sections', JSON.stringify(sections))
                                    data.append('authoredBy', authoredBy)
                                    data.append('reviewedBy', reviewedBy)
                                    data.append('curr_id', JSON.parse(localStorage.getItem("user")).user_id)

                                    if (fileToUpload) {
                                        data.append('pdf_file', fileToUpload)
                                    }

                                    console.log("(debug) sending data to backend for doc update")
                                    console.log("(debug)", [...data])

                                    await fetch(`${backend_base_url}/documents/create-update-doc/`, {
                                        method: 'POST',
                                        body: data
                                    })

                                    setShowSaveToast(true);
                                    setTimeout(() => {
                                        setShowSaveToast(false);
                                    }, 1000);

                                    setHasUnsavedModuleChanges?.(false);
                                    setTimeout(() => { onBack(); }, 1000);
                                }}
                            >
                                Save Document
                            </button>
                        </div>
                    </div>
                </div>
            }
            {showTagModal && (
                <div className={styles.confModalOverlay}>
                    <div className={`${styles.confModal} ${styles.tagInputModal}`}>
                        <div className={styles.confModalHeader}>
                            <h3>Add New Tag</h3>
                            <p>
                                Enter the ISO, NIST, or control tag you want to add to the tag list.
                            </p>
                        </div>

                        <div className={styles.tagInputBody}>
                            <label className={styles.tagInputLabel}>
                                <span>Tag Name</span>
                                <input
                                    type="text"
                                    value={tagTxt}
                                    autoFocus
                                    placeholder="e.g., ISO 27001, NIST AC-01"
                                    onChange={(e) => setTagTxt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleOpenAddTagConfirm();
                                        }

                                        if (e.key === "Escape") {
                                            handleCancelTagInput();
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <div className={styles.confModalButtons}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={handleCancelTagInput}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.confirmBtn}
                                onClick={handleOpenAddTagConfirm}
                                disabled={!tagTxt.trim()}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddTagConfirmModal && (
                <div className={styles.confModalOverlay}>
                    <div className={styles.confModal}>
                        <div className={styles.confModalHeader}>
                            <h3>Add Tag?</h3>
                            <p>
                                Are you sure you want to add "{tagTxt.trim()}" to the tag list?
                            </p>
                        </div>

                        <div className={styles.confModalButtons}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={handleCancelAddTagConfirm}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.confirmBtn}
                                onClick={handleConfirmAddTag}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {
                showBackConfirmModal && (
                    <div className={styles.confModalOverlay}>
                        <div className={styles.confModal}>
                            <div className={styles.confModalHeader}>
                                <h3>Unsaved Changes</h3>
                                <p>
                                    You have unsaved changes. Leaving now will discard them.
                                </p>
                            </div>

                            <div className={styles.confModalButtons}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowBackConfirmModal(false)}
                                >
                                    Stay
                                </button>

                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => {
                                        setShowBackConfirmModal(false)
                                        onBack()
                                    }}
                                >
                                    Discard Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showFileDeleteModal && (
                    <div className={styles.confModalOverlay}>
                        <div className={styles.confModal}>
                            <div className={styles.confModalHeader}>
                                <h3>Delete Attached PDF?</h3>
                                <p>
                                    This will remove the currently attached PDF from the document.
                                </p>
                            </div>

                            <div className={styles.confModalButtons}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowFileDeleteModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => {
                                        setDeletedFile(currentFileName);

                                        setShowRemoveToast(true);

                                        setTimeout(() => {
                                            setShowRemoveToast(false);
                                        }, 2500);

                                        // setFileName("null");
                                        setFileName("null");
                                        setFileNameTemp("null");
                                        setFileToUpload(null);
                                        setViewingPDF(false);
                                        setShowFileDeleteModal(false);
                                    }}
                                >
                                    Remove PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {showClearTagsModal && (
                <div className={styles.confModalOverlay}>
                    <div className={styles.confModal}>
                        <div className={styles.confModalHeader}>
                            <h3>Remove All Tags?</h3>
                            <p>
                                This will remove all selected tags from this document. Are you sure you want to continue?
                            </p>
                        </div>

                        <div className={styles.confModalButtons}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => setShowClearTagsModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => {
                                    setCurrTags([]);
                                    setShowClearTagsModal(false);
                                }}
                            >
                                Remove All Tags
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isPdfFullscreenOpen && hasSavedPdf && (
                <div
                    className={styles.pdfFullscreenOverlay}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsPdfFullscreenOpen(false);
                        }
                    }}
                >
                    <div className={styles.pdfFullscreenPanel}>
                        <div className={styles.pdfFullscreenHeader}>
                            <div className={styles.pdfFullscreenTitleGroup}>
                                <p>PDF Preview</p>
                                <h3>{currTitle || doc.title}</h3>
                            </div>

                            <div className={styles.pdfFullscreenActions}>
                                <a
                                    className={styles.pdfFullscreenOpenTabBtn}
                                    href={pdfPreviewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open in New Tab
                                </a>

                                <button
                                    type="button"
                                    className={styles.pdfFullscreenCloseBtn}
                                    onClick={() => setIsPdfFullscreenOpen(false)}
                                    aria-label="Close fullscreen PDF"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <iframe
                            className={styles.pdfFullscreenIframe}
                            src={pdfPreviewUrl}
                            title={`${currTitle || doc.title} fullscreen PDF`}
                        />
                    </div>
                </div>
            )}

            {/* TOASTS */}
            {showSaveToast && (
                <div className={styles.toastAlert}>
                    <div className={styles.toastAlertContent}>
                        <p className={styles.toastAlertTitle}>
                            Document Saved
                        </p>

                        <p className={styles.toastAlertText}>
                            Document "<strong>{currTitle || doc.title}</strong>" saved successfully.
                        </p>
                    </div>
                </div>
            )
            }

            {showPdfReplacementToast && (
                <div className={styles.toastAlert}>
                    <div className={styles.toastAlertContent}>
                        <p className={styles.toastAlertTitle}>
                            Replacement PDF Required
                        </p>

                        <p className={styles.toastAlertText}>
                            You removed the existing PDF. Please upload a new PDF before saving this document.
                        </p>
                    </div>
                </div>
            )}

            {showRemoveToast && (
                <div className={styles.toastAlert}>
                    <div className={styles.toastAlertContent}>
                        <p className={styles.toastAlertTitle}>
                            PDF Removed
                        </p>

                        <p className={styles.toastAlertText}>
                            Document "<strong>{deletedFile}</strong>" is removed from this document.
                        </p>
                    </div>
                </div>
            )
            }

            {tagToast && (
                <div className={styles.toastAlert}>
                    <div className={styles.toastAlertContent}>
                        <p className={styles.toastAlertTitle}>{tagToast.title}</p>
                        <p className={styles.toastAlertText}>{tagToast.message}</p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default BodyContent;