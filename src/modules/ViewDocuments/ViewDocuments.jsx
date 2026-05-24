import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/ViewDocuments.module.css";
import SearchBar from "../../shared/components/SearchBar";
import PolicySections from "./components/PolicySections";
import { highlightText } from "../../utils/highlightText";
import FilterPopup from "../../shared/components/FilterPopup";

//  DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = () => {
    const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [isPdfViewActive, setIsPdfViewActive] = useState(false);
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    const [docSearch, setDocSearch] = useState("");
    const [policySearch, setPolicySearch] = useState("");
    const [dbDocs, setDbDocs] = useState([])
    useEffect(() => {
        const fetchDocuments = async () => {
            console.log("(debug) fetching docs from backend...")
            const resp = await fetch(backend_base_url + "/documents/get-documents/")
            const docs = await resp.json()
            console.log("(debug) fetched docs: " + docs)
            setDbDocs(docs)
        }
        fetchDocuments();
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const emptyDocFilters = {
        tag: "",
        authorName: "",
        reviewerName: "",
        sortBy: "",
        sortOrder: "",
    };

    const [docFilters, setDocFilters] = useState(emptyDocFilters);

    // DB docs (full objects) dummy data vv
    // const dbDocs = useMemo(() => policyDocumentsDb?.documents ?? [], []);

    const handleSelectDoc = (docId) => {
        setSelectedDocId(docId);
        setIsPdfViewActive(false);
        setIsHeaderCollapsed(false);
    };

    const getDocTags = (doc) => {
        if (!Array.isArray(doc?.tags)) return [];

        return doc.tags
            .map((tag) => {
                if (typeof tag === "string") return tag;
                return tag?.tag_content;
            })
            .filter(Boolean);
    };

    const getUniqueOptions = (items, key) => {
        if (key === "tag") {
            return [...new Set(items.flatMap((item) => getDocTags(item)))].sort();
        }

        return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort();
    };

    const hasActiveDocFilters = Object.values(docFilters).some(
        (value) => String(value ?? "").trim() !== ""
    );

    const documentFilterFields = useMemo(() => {
        return [
            {
                key: "tag",
                label: "Tags",
                type: "select",
                options: getUniqueOptions(dbDocs, "tag"),
                emptyLabel: "All tags",
            },
            {
                key: "authorName",
                label: "Authored by",
                type: "select",
                options: getUniqueOptions(dbDocs, "authorName"),
                emptyLabel: "All authors",
            },
            {
                key: "reviewerName",
                label: "Reviewed by",
                type: "select",
                options: getUniqueOptions(dbDocs, "reviewerName"),
                emptyLabel: "All reviewers",
            },
            {
                key: "sortBy",
                label: "Sort by",
                type: "select",
                options: [
                    { label: "Document title", value: "title" },
                    { label: "Author name", value: "authorName" },
                    { label: "Reviewer name", value: "reviewerName" },
                    { label: "Last updated", value: "lastUpdated" },
                    { label: "Last reviewed", value: "lastReviewed" },
                ],
                emptyLabel: "Default: Last updated, newest first",
            },
            {
                key: "sortOrder",
                label: "Sort order",
                type: "select",
                options: [
                    { label: "Ascending", value: "asc" },
                    { label: "Descending", value: "desc" },
                ],
                emptyLabel: "Default: Descending",
            },
        ];
    }, [dbDocs]);

    const getSortValue = (doc, key) => {
        if (!key) return "";

        if (key === "lastUpdated" || key === "lastReviewed") {
            const date = new Date(doc[key]);
            return Number.isNaN(date.getTime()) ? 0 : date.getTime();
        }

        return String(doc[key] ?? "").toLowerCase();
    };

    // Filter by title
    const filteredDocs = useMemo(() => {
        const q = docSearch.trim().toLowerCase();

        const filtered = dbDocs.filter((d) => {
            const matchesSearch =
                !q || (d.title ?? "").toLowerCase().includes(q);

            const docTags = getDocTags(d);

            const matchesTag =
                !docFilters.tag ||
                docTags.includes(docFilters.tag);

            const matchesAuthoredBy =
                !docFilters.authorName ||
                d.authorName === docFilters.authorName;

            const matchesReviewedBy =
                !docFilters.reviewerName ||
                d.reviewerName === docFilters.reviewerName;

            return (
                matchesSearch &&
                matchesTag &&
                matchesAuthoredBy &&
                matchesReviewedBy
            );
        });

        const sortBy = docFilters.sortBy || "lastUpdated";
        const sortOrder = docFilters.sortOrder || "desc";

        if (!sortBy) {
            return filtered;
        }

        return [...filtered].sort((a, b) => {
            const aValue = getSortValue(a, sortBy);
            const bValue = getSortValue(b, sortBy);

            if (aValue < bValue) {
                return sortOrder === "asc" ? -1 : 1;
            }

            if (aValue > bValue) {
                return sortOrder === "asc" ? 1 : -1;
            }

            return 0;
        });
    }, [dbDocs, docSearch, docFilters]);

    useEffect(() => {
        setCurrentPage(1);
    }, [docSearch, docFilters]);

    const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredDocs.length);

    const paginatedDocuments = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

    // Selected document
    const selectedDoc = useMemo(() => {
        return dbDocs.find((d) => d.id === selectedDocId) ?? null;
    }, [dbDocs, selectedDocId]);

    const selectedPdfPreviewUrl = selectedDoc?.pdf_filename
        ? `${backend_base_url}/documents/get-pdf/${encodeURIComponent(selectedDoc.pdf_filename)}#view=FitH&toolbar=1&navpanes=0`
        : "#";

    const selectedPdfDownloadUrl = selectedDoc?.pdf_filename
        ? `${backend_base_url}/documents/get-pdf/${encodeURIComponent(selectedDoc.pdf_filename)}`
        : "#";

    const handleDownloadPdf = async () => {
        if (!selectedDoc?.pdf_filename) return;

        try {
            const response = await fetch(selectedPdfDownloadUrl);

            if (!response.ok) {
                throw new Error("Failed to download PDF.");
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = selectedDoc.pdf_filename;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download the PDF. Please try again.");
        }
    };

    const handleNextPage = () => {
        setCurrentPage((p) => Math.min(p + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((p) => Math.max(p - 1, 1));
    };

    return (
        <div className={`${styles.policies} ${isPdfViewActive ? styles.pdfActive : ""}`}>
            <div className={styles.bodyContentContainer}>
                {/* LEFT */}
                <div className={styles.sideDocumentContainer}>
                    <h2>View Documents</h2>

                    <div className={styles.searchBarContainer}>
                        <SearchBar
                            placeholder="Search documents..."
                            value={docSearch}
                            onChange={setDocSearch}
                        />
                    </div>

                    <div className={styles.filterAndFileNumContainer}>
                        <div className={styles.filterActions}>
                            <FilterPopup
                                title="Filter documents"
                                buttonLabel="Filter"
                                iconSrc="/icons/filter-blue.png"
                                fields={documentFilterFields}
                                values={docFilters}
                                onApply={setDocFilters}
                                onClear={setDocFilters}
                            />

                            {hasActiveDocFilters && (
                                <button
                                    type="button"
                                    className={styles.clearFilterText}
                                    onClick={() => setDocFilters(emptyDocFilters)}
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <span className={styles.fileNumText}>
                            {docSearch.trim() || hasActiveDocFilters
                                ? `${filteredDocs.length} of ${dbDocs.length} Files`
                                : `${dbDocs.length} Files`}
                        </span>
                    </div>

                    <div className={styles.documentAndFooterContainer}>
                        <div className={styles.documentsContainer}>
                            {paginatedDocuments.map((doc) => {
                                const tags = getDocTags(doc);

                                return (
                                    <div
                                        key={doc.id}
                                        className={`${styles.documentItem} ${selectedDocId === doc.id ? styles.selected : ""}`}
                                        onClick={() => handleSelectDoc(doc.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === "Enter" && handleSelectDoc(doc.id)}
                                    >
                                        <div className={styles.documentItemContent}>
                                            <p className={styles.documentTitle}>
                                                {highlightText(doc.title, docSearch)}
                                            </p>

                                            <div className={styles.documentMetaChips}>
                                                {tags.length > 0 ? (
                                                    tags.map((tag) => (
                                                        <span key={tag} className={styles.metaChip}>
                                                            {tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className={styles.metaChip}>No tags</span>
                                                )}
                                            </div>

                                            <div className={styles.documentMetaLine}>
                                                {doc.authoredBy ? `By ${doc.authorName}` : "No author"}
                                            </div>

                                            <div className={`${styles.documentMetaLine} ${styles.documentUpdatedLine}`}>
                                                {doc.lastUpdated ? `Upd ${new Date(doc.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}` : "No update date"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {paginatedDocuments.length === 0 && (
                                <div className={styles.noResults}>
                                    <p style={{ fontSize: "0.875rem", color: "#888" }}>No documents found.</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.paginationContainer}>
                            <div className={styles.pagination}>
                                <button
                                    className={styles.pageButton}
                                    onClick={handlePrevPage}
                                    disabled={currentPage <= 1}
                                    aria-hidden={currentPage <= 1}
                                >
                                    {"<"}
                                </button>

                                <span className={styles.pageNumber}>
                                    Showing {filteredDocs.length === 0 ? 0 : startIndex + 1}–{endIndex} of {filteredDocs.length}
                                </span>

                                <button
                                    className={styles.pageButton}
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages}
                                    aria-hidden={currentPage >= totalPages}
                                >
                                    {">"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className={styles.rightContentContainer}>
                    {!isHeaderCollapsed && (
                        <div className={styles.documentHeaderContainer}>
                            {selectedDoc ? (
                                <div className={styles.documentDetails}>
                                    <div className={styles.documentTitleContainer}>
                                        <h2>{selectedDoc?.title}</h2>
                                    </div>

                                    <div className={styles.documentDescription}>
                                        <p>{selectedDoc.details || "No description provided."}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.documentDetails}>
                                    <h2>No Document Selected</h2>
                                    <div className={styles.documentDescription}>
                                        <p>Please select a document from the list to view its details.</p>
                                    </div>
                                </div>
                            )}

                            {selectedDoc && (
                                <div className={styles.documentMetadata}>
                                    <p>Authored by: {selectedDoc.authorName || "No author"}</p>
                                    <p>
                                        Last Updated:{" "}
                                        {selectedDoc.lastUpdated
                                            ? new Date(selectedDoc.lastUpdated).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })
                                            : "No update date"}
                                    </p>
                                    <p>Reviewed by: {selectedDoc.reviewerName || "No reviewer"}</p>
                                    <p>
                                        Last Reviewed:{" "}
                                        {selectedDoc.lastReviewed
                                            ? new Date(selectedDoc.lastReviewed).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })
                                            : "No review date"}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div
                        className={`${styles.documentButtonsAndSearchContainer} ${isPdfViewActive ? styles.pdfToolbarMode : ""
                            }`}
                    >
                        {!isPdfViewActive && (
                            <div className={styles.documentSearchFilterContainer}>
                                <SearchBar
                                    placeholder="Search standards, policies, procedures..."
                                    value={policySearch}
                                    onChange={setPolicySearch}
                                />
                            </div>
                        )}

                        <div className={styles.documentButtonsContainer}>
                            {!isPdfViewActive && (
                                <button
                                    className={styles.documentButton}
                                    onClick={() => setIsPdfViewActive(true)}
                                    disabled={!selectedDocId}
                                    type="button"
                                >
                                    View PDF
                                </button>
                            )}

                            {isPdfViewActive && selectedDoc && (
                                <a
                                    className={styles.documentButton}
                                    href={selectedPdfPreviewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open in New Tab
                                </a>
                            )}

                            <button
                                className={styles.documentButton}
                                onClick={handleDownloadPdf}
                                disabled={!selectedDocId}
                                type="button"
                                style={{
                                    opacity: selectedDocId ? 1 : 0.5,
                                    cursor: selectedDocId ? "pointer" : "not-allowed",
                                }}
                            >
                                Download PDF
                            </button>

                            {isPdfViewActive && (
                                <button
                                    className={`${styles.documentButton} ${styles.backPdfButton}`}
                                    onClick={() => {
                                        setIsPdfViewActive(false);
                                        setIsHeaderCollapsed(false);
                                    }}
                                    type="button"
                                >
                                    Back
                                </button>
                            )}
                            {isPdfViewActive && selectedDoc && (
                                <button
                                    type="button"
                                    className={`${styles.documentButton} ${styles.headerToggleButton}`}
                                    onClick={() => setIsHeaderCollapsed((prev) => !prev)}
                                    title={isHeaderCollapsed ? "Show document header" : "Hide document header"}
                                    aria-label={isHeaderCollapsed ? "Show document header" : "Hide document header"}
                                >
                                    {isHeaderCollapsed ? "↓" : "↑"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.documentContentContainer}>
                        {isPdfViewActive ? (
                            selectedDoc ? (
                                <div className={styles.pdfViewerContainer}>
                                    <iframe
                                        className={styles.pdfIframe}
                                        src={selectedPdfPreviewUrl}
                                        title={selectedDoc.title}
                                    />
                                </div>
                            ) : (
                                <div className={styles.pdfViewerPlaceholder}>
                                    <p>Select a document first.</p>
                                </div>
                            )
                        ) : (
                            <PolicySections
                                key={selectedDocId ?? "no-doc"}
                                data={selectedDoc?.sections ?? []}
                                query={policySearch}
                                isDocumentSelected={!!selectedDocId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;