import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/Policies.module.css";
import SearchBar from "../../shared/components/SearchBar";
import PolicySections from "./components/PolicySections";

//  DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = () => {
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [isPdfViewActive, setIsPdfViewActive] = useState(false);
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    const [docSearch, setDocSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // derive list from dummy DB
    const documents = useMemo(() => {
        const dbDocs = policyDocumentsDb?.documents ?? [];
        return dbDocs.map((d) => ({ id: d.id, name: d.title }));
    }, [policyDocumentsDb?.documents]);

    const totalPages = Math.ceil(documents.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDocuments = documents.slice(startIndex, endIndex);

    // selected document objects (for header/details/sections)
    const selectedDoc = useMemo(() => {
        return (policyDocumentsDb?.documents ?? []).find((d) => d.id === selectedDocId) ?? null;
    }, [selectedDocId]);



    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };



    const handleSelectDoc = (docId) => {
        setSelectedDocId(docId);
        setIsPdfViewActive(false); //  whenever we change docs, we exit PDF view mode
        setIsHeaderCollapsed(false); // reset header collapse state when changing docs
    };




    const dbDocs = policyDocumentsDb?.documents ?? [];
    const filteredDocs = useMemo(() => {
        const q = docSearch.trim().toLowerCase();
        if (!q) return dbDocs;

        return dbDocs.filter((d) => {
            const title = (d.title ?? "").toLowerCase();
            return title.includes(q);
        });
    }, [dbDocs, docSearch]);





    useEffect(() => {
        setCurrentPage(1);
    }, [docSearch]);




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
                        <div className={styles.filterContainer}>
                            <img
                                src={"/icons/filter-blue.png"}
                                alt={"Filter Icon"}
                                className={styles.filterIcon}
                            />
                            <p>Filter</p>
                        </div>

                        {/* reflect DB */}
                        <span className={styles.fileNumText}>{documents.length} Files</span>
                    </div>

                    <div className={styles.documentAndFooterContainer}>
                        <div className={styles.documentsContainer}>
                            {paginatedDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className={`${styles.documentItem} ${selectedDocId === doc.id ? styles.selected : ""
                                        }`}
                                    onClick={() => handleSelectDoc(doc.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && handleSelectDoc(doc.id)}
                                >
                                    <p>{doc.name}</p>
                                </div>
                            ))}
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
                                    Showing {documents.length === 0 ? 0 : startIndex + 1}–
                                    {Math.min(endIndex, documents.length)} of {documents.length}
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
                            <SearchBar placeholder="Search standards, policies, procedures..." />

                            <div className={styles.filterContainer}>
                                <img
                                    src={"/icons/filter-blue.png"}
                                    alt={"Filter Icon"}
                                    className={styles.filterIcon}
                                />
                                <p>Filter</p>
                            </div>
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
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;