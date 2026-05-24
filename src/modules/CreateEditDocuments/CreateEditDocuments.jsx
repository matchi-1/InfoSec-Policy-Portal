import React, { useMemo, useState, useEffect } from "react";
import styles from "./styles/CreateEditDocuments.module.css";
import SearchBar from "../../shared/components/SearchBar";
import DocumentEditor from "./components/DocumentEditor";
import { highlightText } from "../../utils/highlightText";

// DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = ({ setActiveSubModule, setHasUnsavedModuleChanges }) => {
    const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [docSearch, setDocSearch] = useState("");

    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [selectedReviewer, setSelectedReviewer] = useState("");

    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isReviewerOpen, setIsReviewerOpen] = useState(false);

    // local state so delete works in UI for dummy data
    // const [dbDocs, setDbDocs] = useState(policyDocumentsDb?.documents ?? []);
    const [dbDocs, setDbDocs] = useState([]);
    useEffect(() => {
        const fetchDocuments = async () => {
            console.log("(debug) fetching docs from backend...")
            const resp = await fetch(backend_base_url + "/documents/get-documents/")
            const docs = await resp.json()
            console.log("(debug) fetched docs: " + docs)
            setDbDocs(docs)
        }
        fetchDocuments();
    }, [selectedDocId])

    const uniqueAuthors = useMemo(() => {
        return [...new Set(dbDocs.map((doc) => doc.authorName).filter(Boolean))].sort();
    }, [dbDocs]);

    const uniqueReviewers = useMemo(() => {
        return [...new Set(dbDocs.map((doc) => doc.reviewerName).filter(Boolean))].sort();
    }, [dbDocs]);

    const handleSelectDoc = (docId, docTitle) => {
        setSelectedDocId(docId);
        if (setActiveSubModule) {
            setActiveSubModule(docTitle);
        }
    };

    // const handleDeleteDoc = (doc) => {
    //     const confirmed = window.confirm(
    //         `Are you sure you want to delete "${doc.title}"?`
    //     );

    //     if (!confirmed) return;

    //     setDbDocs((prev) => prev.filter((d) => d.id !== doc.id));

    //     if (selectedDocId === doc.id) {
    //         setSelectedDocId(null);
    //         if (setActiveSubModule) setActiveSubModule(null);
    //     }
    // };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [deletedDoc, setdeletedDoc] = useState(null);

    const handleDeleteDoc = (doc) => {
        setDocToDelete(doc);
        setShowDeleteModal(true);
    };

    const confirmDeleteDoc = async () => {
        if (!docToDelete) return;

        setDbDocs((prev) =>
            prev.filter((d) => d.id !== docToDelete.id)
        );

        if (selectedDocId === docToDelete.id) {
            setSelectedDocId(null);

            if (setActiveSubModule) {
                setActiveSubModule(null);
            }
        }

        console.log("(debug) to delete: ", docToDelete)
        const resp = await fetch(`${backend_base_url}/documents/delete-doc/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "doc_id": docToDelete.id
            })
        })

        setShowDeleteModal(false);
        setDocToDelete(null);
    };

    const filteredDocs = useMemo(() => {
        const q = docSearch.trim().toLowerCase();

        const filtered = dbDocs.filter((doc) => {
            const searchableText = [
                doc.title,
                doc.authorName,
                doc.reviewerName,
                doc.details,
                doc.documentDetails,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = !q || searchableText.includes(q);

            const matchesAuthor =
                !selectedAuthor || doc.authorName === selectedAuthor;

            const matchesReviewer =
                !selectedReviewer || doc.reviewerName === selectedReviewer;

            return (
                matchesSearch &&
                matchesAuthor &&
                matchesReviewer
            );
        });

        return filtered.sort((a, b) => {
            const da = new Date(a.lastUpdated || 0);
            const db = new Date(b.lastUpdated || 0);
            return db - da;
        });
    }, [dbDocs, docSearch, selectedAuthor, selectedReviewer]);

    const selectedDoc = useMemo(() => {
        if (selectedDocId === "new") {
            return {
                id: "new",
                title: "New Document",
                documentDetails: "New Document Description",
                details: "New Document Description",
                authoredBy: "",
                reviewedBy: "",
                lastUpdated: null,
                lastReviewed: null,
                authorName: null,
                reviewerName: null,
                pdf_filename: "null",
                sections: [],
            };
        }

        const found = dbDocs.find((d) => d.id === selectedDocId) ?? null;

        if (!found) return null;

        return {
            ...found,
            details: found.details ?? found.documentDetails ?? "",
        };
    }, [dbDocs, selectedDocId]);

    const [showDeleteToast, setShowDeleteToast] = useState(false);

    return (
        <div className={styles.bodyContentContainer}>
            {selectedDoc ? (
                <DocumentEditor
                    doc={selectedDoc}
                    onBack={() => {
                        setSelectedDocId(null);
                    }}
                    setHasUnsavedModuleChanges={setHasUnsavedModuleChanges}
                />
            ) : (
                <div className={styles.documentsListView}>
                    <header className={styles.headerSection}>
                        <p className={styles.pageLabel}>Document Administration</p>
                        <h1>Create/Edit Documents</h1>
                        <p className={styles.pageDescription}>
                            Search, filter, create, edit, and manage information security documents.
                        </p>
                    </header>

                    <div className={styles.searchFilterCreate}>
                        <div className={styles.searchBarContainer}>
                            <SearchBar
                                placeholder="Search by title, author, reviewer..."
                                value={docSearch}
                                onChange={setDocSearch}
                            />
                        </div>
                        <div className={styles.filterCreateWrap}>
                            <div className={styles.filtersWrapper}>

                                <div className={styles.filterContainer}>
                                    <h2>Filter by Author</h2>
                                    <div
                                        className={
                                            selectedAuthor !== ""
                                                ? styles.activeSelectedOption
                                                : styles.selectedOption
                                        }
                                        onClick={() => {
                                            setIsAuthOpen(!isAuthOpen);
                                            setIsReviewerOpen(false);
                                        }}
                                    >
                                        <div><p>{selectedAuthor || "All Authors"}</p></div>
                                        <div>
                                            <img
                                                className={`${styles.dropdownArrow} ${isAuthOpen ? styles.dropdownArrowOpen : ""
                                                    }`}
                                                src={
                                                    selectedAuthor !== ""
                                                        ? "/icons/down-white.png"
                                                        : "/icons/down.png"
                                                }
                                                alt="Down Icon"
                                            />
                                        </div>
                                    </div>

                                    {isAuthOpen && (
                                        <div className={styles.filterOptionsContainer}>
                                            <div
                                                className={styles.filterOptions}
                                                onClick={() => {
                                                    setSelectedAuthor("");
                                                    setIsAuthOpen(false);
                                                }}
                                            >
                                                All Authors
                                            </div>

                                            {uniqueAuthors.map((author, index) => (
                                                <div
                                                    className={
                                                        selectedAuthor === author
                                                            ? styles.activeFilter
                                                            : styles.filterOptions
                                                    }
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedAuthor(author);
                                                        setIsAuthOpen(false);
                                                    }}
                                                >
                                                    {author}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.filterContainer}>
                                    <h2>Filter by Reviewer</h2>
                                    <div
                                        className={
                                            selectedReviewer !== ""
                                                ? styles.activeSelectedOption
                                                : styles.selectedOption
                                        }
                                        onClick={() => {
                                            setIsReviewerOpen(!isReviewerOpen);
                                            setIsAuthOpen(false);
                                        }}
                                    >
                                        <div><p>{selectedReviewer || "All Reviewers"}</p></div>
                                        <div>
                                            <img
                                                className={`${styles.dropdownArrow} ${isReviewerOpen ? styles.dropdownArrowOpen : ""
                                                    }`}
                                                src={
                                                    selectedReviewer !== ""
                                                        ? "/icons/down-white.png"
                                                        : "/icons/down.png"
                                                }
                                                alt="Down Icon"
                                            />
                                        </div>
                                    </div>

                                    {isReviewerOpen && (
                                        <div className={styles.filterOptionsContainer}>
                                            <div
                                                className={styles.filterOptions}
                                                onClick={() => {
                                                    setSelectedReviewer("");
                                                    setIsReviewerOpen(false);
                                                }}
                                            >
                                                All Reviewers
                                            </div>

                                            {uniqueReviewers.map((reviewer, index) => (
                                                <div
                                                    className={
                                                        selectedReviewer === reviewer
                                                            ? styles.activeFilter
                                                            : styles.filterOptions
                                                    }
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedReviewer(reviewer);
                                                        setIsReviewerOpen(false);
                                                    }}
                                                >
                                                    {reviewer}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                className={styles.createButton}
                                onClick={() => handleSelectDoc("new", "New Document")}
                            >
                                <img
                                    src={"/icons/plus-hover.png"}
                                    alt={"Plus Icon"}
                                />
                                <p>Create</p>
                            </button>
                        </div>
                    </div>
                    <div className={styles.resultsContainer}>
                        <table className={styles.documentTable}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Authored By</th>
                                    <th>Reviewed By</th>
                                    <th>Last Updated</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDocs.length > 0 ? (
                                    filteredDocs.map((doc) => {
                                        console.log("(debug) listing docs: doc: ", doc)
                                        return (
                                            <tr
                                                key={doc.id}
                                                className={selectedDocId === doc.id ? styles.selectedRow : ""}
                                            >
                                                <td>{highlightText(doc.title, docSearch)}</td>
                                                <td>{doc.authorName || "—"}</td>
                                                <td>{doc.reviewerName || "—"}</td>
                                                <td>{doc.lastUpdated ? new Date(doc.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "—"}</td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectDoc(doc.id, doc.title)}
                                                        aria-label={`Edit ${doc.title}`}
                                                        title="Edit document"
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            minWidth: "1rem",
                                                        }}
                                                    >
                                                        <img
                                                            src="/icons/edit-icon.png"
                                                            alt="Edit"
                                                            style={{
                                                                height: "1.1rem",
                                                                width: "auto",
                                                                objectFit: "contain",
                                                            }}
                                                        />
                                                    </button>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteDoc(doc)}
                                                        aria-label={`Delete ${doc.title}`}
                                                        title="Delete document"
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            minWidth: "1rem",
                                                        }}
                                                    >
                                                        <img
                                                            src="/icons/delete.png"
                                                            alt="Delete"
                                                            style={{
                                                                height: "1.3rem",
                                                                width: "1.3rem",
                                                                objectFit: "contain",
                                                            }}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            style={{
                                                fontSize: "0.9rem",
                                                color: "#888",
                                                padding: "1rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            No documents found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {
                showDeleteModal && (
                    <div className={styles.confModalOverlay}>
                        <div className={styles.confModal}>
                            <div className={styles.confModalHeader}>
                                <h3>Delete Document?</h3>

                                <p>
                                    This will permanently remove{" "}
                                    <strong>
                                        "{docToDelete?.title}"
                                    </strong>{" "}
                                    from the document list.
                                </p>
                            </div>

                            <div className={styles.confModalButtons}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDocToDelete(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => {
                                        setdeletedDoc(docToDelete.title);
                                        confirmDeleteDoc()
                                        setShowDeleteToast(true);

                                        setTimeout(() => {
                                            setShowDeleteToast(false);
                                        }, 2500);
                                    }}
                                    style={{
                                        background: "#c62828",
                                    }}
                                >
                                    Delete Document
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* TOASTS */}
            {
                showDeleteToast && (
                    <div className={styles.toastAlert}>
                        <div className={styles.toastAlertContent}>
                            <p className={styles.toastAlertTitle}>
                                Document Deleted
                            </p>

                            <p className={styles.toastAlertText}>
                                Document{" "}
                                <strong>
                                    "{deletedDoc}"
                                </strong>{" "}
                                deleted successfully.
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default BodyContent;