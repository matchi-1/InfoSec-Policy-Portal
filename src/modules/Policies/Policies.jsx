import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/Policies.module.css";
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
        category: "",
        authorName: "",
        reviewerName: "",
    };
    const [docFilters, setDocFilters] = useState(emptyDocFilters);

    // DB docs (full objects) dummy data vv
    // const dbDocs = useMemo(() => policyDocumentsDb?.documents ?? [], []);

    const handleSelectDoc = (docId) => {
        setSelectedDocId(docId);
        setIsPdfViewActive(false);
        setIsHeaderCollapsed(false);
    };

    const getDocCategories = (doc) => {
        if (Array.isArray(doc?.category)) return doc.category.filter(Boolean);
        if (typeof doc?.category === "string" && doc.category.trim()) return [doc.category.trim()];
        return [];
    };

    const getUniqueOptions = (items, key) => {
        if (key === "category") {
            return [...new Set(items.flatMap((item) => getDocCategories(item)))].sort();
        }

        return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort();
    };

    const hasActiveDocFilters = Object.values(docFilters).some(
        (value) => String(value ?? "").trim() !== ""
    );

    const documentFilterFields = useMemo(() => {
        return [
            {
                key: "category",
                label: "Category",
                type: "select",
                options: getUniqueOptions(dbDocs, "category"),
                emptyLabel: "All categories",
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
        ];
    }, [dbDocs]);

    // Filter by title
    const filteredDocs = useMemo(() => {
        const q = docSearch.trim().toLowerCase();

        return dbDocs.filter((d) => {
            const matchesSearch =
                !q || (d.title ?? "").toLowerCase().includes(q);

            const docCategories = getDocCategories(d);

            const matchesCategory =
                !docFilters.category ||
                docCategories.includes(docFilters.category);

            const matchesAuthoredBy =
                !docFilters.authorName ||
                d.authorName === docFilters.authorName;

            const matchesReviewedBy =
                !docFilters.reviewerName ||
                d.reviewerName === docFilters.reviewerName;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesAuthoredBy &&
                matchesReviewedBy
            );
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

    const handleNextPage = () => {
        setCurrentPage((p) => Math.min(p + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((p) => Math.max(p - 1, 1));
    };

    return (
        <div className={styles.policies}>
            <div className={styles.bodyContentContainer}>
                {/* LEFT */}
                <div className={styles.sideDocumentContainer}>
                    <h2>Documents</h2>

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
                                const categories = getDocCategories(doc);

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
                                                {categories.map((cat) => (
                                                    <span key={cat} className={styles.metaChip}>
                                                        {cat}
                                                    </span>
                                                ))}
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
                                        <p>{selectedDoc.documentDetails}</p>
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
                                    <p>Authored by: {selectedDoc.authorName}</p>
                                    <p>Last Updated: {new Date(selectedDoc.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <p>Reviewed by: {selectedDoc.reviewerName}</p>
                                    <p>Last Reviewed: {new Date(selectedDoc.lastReviewed).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.documentButtonsAndSearchContainer}>
                        <div className={styles.documentSearchFilterContainer}>
                            <SearchBar
                                placeholder="Search standards, policies, procedures..."
                                value={policySearch}
                                onChange={setPolicySearch}
                            />
                        </div>

                        <div className={styles.documentButtonsContainer}>
                            <button
                                className={`${styles.documentButton} ${isPdfViewActive ? styles.documentButtonSelected : ""}`}
                                onClick={() => setIsPdfViewActive(true)}
                                disabled={!selectedDocId || isPdfViewActive}
                                type="button"
                            >
                                {isPdfViewActive ? "View Mode" : "View PDF"}
                            </button>

                            <a
                                className={styles.documentButton}
                                href={selectedDoc?.pdf_filename ? `${backend_base_url}/documents/get-pdf/${selectedDoc.pdf_filename}#view=FitH&toolbar=1&navpanes=0` : "#"}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    if (!selectedDoc?.pdf_filename) e.preventDefault();
                                }}
                                aria-disabled={!selectedDocId}
                                style={{
                                    pointerEvents: selectedDocId ? "auto" : "none",
                                    opacity: selectedDocId ? 1 : 0.5,
                                }}
                            >
                                Download PDF
                            </a>

                            {isPdfViewActive && (
                                <button
                                    className={styles.documentButton}
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
                                    className={styles.documentButton}
                                    onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
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
                                        src={`${backend_base_url}/documents/get-pdf/${selectedDoc.pdf_filename}#view=FitH&toolbar=1&navpanes=0`}
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