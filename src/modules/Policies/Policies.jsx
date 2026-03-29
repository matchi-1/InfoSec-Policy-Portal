import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/Policies.module.css";
import SearchBar from "../../shared/components/SearchBar";
import PolicySections from "./components/PolicySections";
import { highlightText } from "../../utils/highlightText";
import FilterPopup from "../../shared/components/FilterPopup";

//  DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = () => {
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [isPdfViewActive, setIsPdfViewActive] = useState(false);
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    const [docSearch, setDocSearch] = useState("");
    const [policySearch, setPolicySearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [docFilters, setDocFilters] = useState({
        classification: "",
        status: "",
        authoredBy: "",
        reviewedBy: "",
    });

    // DB docs (full objects)
    const dbDocs = useMemo(() => policyDocumentsDb?.documents ?? [], []);

    // derive list from dummy DB
    const documents = useMemo(() => {
        const dbDocs = policyDocumentsDb?.documents ?? [];
        return dbDocs.map((d) => ({ id: d.id, name: d.title }));
    }, [policyDocumentsDb?.documents]);


    const handleSelectDoc = (docId) => {
        setSelectedDocId(docId);
        setIsPdfViewActive(false); //  whenever we change docs, we exit PDF view mode
        setIsHeaderCollapsed(false); // reset header collapse state when changing docs
    };

    const getUniqueOptions = (items, key) =>
        [...new Set(items.map((item) => item[key]).filter(Boolean))].sort();


    const documentFilterFields = useMemo(() => {
        return [
            {
                key: "classification",
                label: "Classification",
                type: "select",
                options: getUniqueOptions(dbDocs, "classification"),
                emptyLabel: "All classifications",
            },
            {
                key: "status",
                label: "Status",
                type: "select",
                options: getUniqueOptions(dbDocs, "status"),
                emptyLabel: "All statuses",
            },
            {
                key: "authoredBy",
                label: "Authored by",
                type: "select",
                options: getUniqueOptions(dbDocs, "authoredBy"),
                emptyLabel: "All authors",
            },
            {
                key: "reviewedBy",
                label: "Reviewed by",
                type: "select",
                options: getUniqueOptions(dbDocs, "reviewedBy"),
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

            const matchesClassification =
                !docFilters.classification ||
                d.classification === docFilters.classification;

            const matchesStatus =
                !docFilters.status ||
                d.status === docFilters.status;

            const matchesAuthoredBy =
                !docFilters.authoredBy ||
                d.authoredBy === docFilters.authoredBy;

            const matchesReviewedBy =
                !docFilters.reviewedBy ||
                d.reviewedBy === docFilters.reviewedBy;

            return (
                matchesSearch &&
                matchesClassification &&
                matchesStatus &&
                matchesAuthoredBy &&
                matchesReviewedBy
            );
        });
    }, [dbDocs, docSearch, docFilters]);

    useEffect(() => {
        setCurrentPage(1);
    }, [docSearch, docFilters]);

    // reset page when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [docSearch]);

    // paginate the filtered list
    const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredDocs.length);

    const paginatedDocuments = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

    // Selected document (use dbDocs so it matches the real object)
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
                        <FilterPopup
                            title="Filter documents"
                            buttonLabel="Filter"
                            iconSrc="/icons/filter-blue.png"
                            buttonClassName={styles.filterContainer}
                            buttonIconClassName={styles.filterIcon}
                            fields={documentFilterFields}
                            values={docFilters}
                            onApply={setDocFilters}
                            onClear={setDocFilters}
                        />

                        {/* reflect DB */}
                        <span className={styles.fileNumText}>
                            {docSearch.trim()
                                ? `${filteredDocs.length} of ${dbDocs.length} Files`
                                : `${dbDocs.length} Files`}
                        </span>
                    </div>

                    <div className={styles.documentAndFooterContainer}>
                        <div className={styles.documentsContainer}>
                            {paginatedDocuments.map((doc) => (
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
                                            {doc.classification && (
                                                <span className={styles.metaChip}>{doc.classification}</span>
                                            )}
                                            {doc.status && (
                                                <span className={styles.metaChip}>{doc.status}</span>
                                            )}
                                        </div>

                                        <div className={styles.documentMetaLine}>
                                            {doc.authoredBy ? `By ${doc.authoredBy}` : "No author"}
                                        </div>

                                        <div className={`${styles.documentMetaLine} ${styles.documentUpdatedLine}`}>
                                            {doc.lastUpdated ? `Upd ${doc.lastUpdated}` : "No update date"}
                                        </div>

                                    </div>
                                </div>
                            ))}

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

                                    {/* doc details from DB */}
                                    <div className={styles.documentDescription}>
                                        <p>{selectedDoc.details}</p>
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
                                    {/* metadata from DB */}
                                    <p>Authored by: {selectedDoc.authoredBy}</p>
                                    <p>Last Updated: {selectedDoc.lastUpdated}</p>
                                    <p>Reviewed by: {selectedDoc.reviewedBy}</p>
                                    <p>Last Reviewed: {selectedDoc.lastReviewed}</p>
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
                                className={`${styles.documentButton} ${isPdfViewActive ? styles.documentButtonSelected : ""
                                    }`}
                                onClick={() => setIsPdfViewActive(true)}
                                disabled={!selectedDocId || isPdfViewActive}
                                type="button"
                            >
                                {isPdfViewActive ? "View Mode" : "View PDF"}
                            </button>

                            <a
                                className={styles.documentButton}
                                href={selectedDoc?.pdfUrl ?? "#"}
                                download
                                onClick={(e) => {
                                    if (!selectedDoc?.pdfUrl) e.preventDefault();
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
                                        src={`${selectedDoc.pdfUrl}#view=FitH&toolbar=1&navpanes=0`}
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