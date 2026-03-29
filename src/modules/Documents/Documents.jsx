import React, { useMemo, useState } from "react";
import styles from "./styles/Documents.module.css";
import SearchBar from "../../shared/components/SearchBar";
import DocumentEditor from "./components/DocumentEditor";
import { highlightText } from "../../utils/highlightText";

// DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = ({ setActiveSubModule }) => {
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [docSearch, setDocSearch] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [selectedReviewer, setSelectedReviewer] = useState("");

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isReviewerOpen, setIsReviewerOpen] = useState(false);

    // local state so delete works in UI for dummy data
    const [dbDocs, setDbDocs] = useState(policyDocumentsDb?.documents ?? []);

    const getDocCategories = (doc) => {
        if (Array.isArray(doc?.category)) return doc.category.filter(Boolean);
        if (typeof doc?.category === "string" && doc.category.trim()) return [doc.category.trim()];
        return [];
    };

    const uniqueCategories = useMemo(() => {
        return [...new Set(dbDocs.flatMap((doc) => getDocCategories(doc)))].sort();
    }, [dbDocs]);

    const uniqueAuthors = useMemo(() => {
        return [...new Set(dbDocs.map((doc) => doc.authoredBy).filter(Boolean))].sort();
    }, [dbDocs]);

    const uniqueReviewers = useMemo(() => {
        return [...new Set(dbDocs.map((doc) => doc.reviewedBy).filter(Boolean))].sort();
    }, [dbDocs]);

    const handleSelectDoc = (docId, docTitle) => {
        setSelectedDocId(docId);
        if (setActiveSubModule) {
            setActiveSubModule(docTitle);
        }
    };

    const handleDeleteDoc = (doc) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${doc.title}"?`
        );

        if (!confirmed) return;

        setDbDocs((prev) => prev.filter((d) => d.id !== doc.id));

        if (selectedDocId === doc.id) {
            setSelectedDocId(null);
            if (setActiveSubModule) setActiveSubModule(null);
        }
    };

    const filteredDocs = useMemo(() => {
        const q = docSearch.trim().toLowerCase();

        const filtered = dbDocs.filter((doc) => {
            const matchesSearch =
                !q || (doc.title ?? "").toLowerCase().includes(q);

            const docCategories = getDocCategories(doc);

            const matchesCategory =
                !selectedCategory || docCategories.includes(selectedCategory);

            const matchesAuthor =
                !selectedAuthor || doc.authoredBy === selectedAuthor;

            const matchesReviewer =
                !selectedReviewer || doc.reviewedBy === selectedReviewer;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesAuthor &&
                matchesReviewer
            );
        });

        return filtered.sort((a, b) => {
            const da = new Date(a.lastUpdated || 0);
            const db = new Date(b.lastUpdated || 0);
            return db - da;
        });
    }, [dbDocs, docSearch, selectedCategory, selectedAuthor, selectedReviewer]);

    const selectedDoc = useMemo(() => {
        if (selectedDocId === "new") {
            return {
                id: "new",
                title: "New Document",
                category: [],
                documentDetails: "New Document Description",
                details: "New Document Description",
                authoredBy: "",
                reviewedBy: "",
                lastUpdated: "",
                lastReviewed: "---------",
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

    return (
        <div className={styles.bodyContentContainer}>
            {selectedDoc ? (
                <DocumentEditor
                    doc={selectedDoc}
                    onBack={() => {
                        setSelectedDocId(null);
                        if (setActiveSubModule) setActiveSubModule(null);
                    }}
                />
            ) : (
                <div className={styles.bodyContentContainer}>
                    <h1>Documents</h1>

                    <div className={styles.searchFilterCreate}>
                        <div className={styles.searchBarContainer}>
                            <SearchBar
                                placeholder="Search documents..."
                                value={docSearch}
                                onChange={setDocSearch}
                            />
                        </div>

                        <div className={styles.filterContainer}>
                            <h2>Filter by Category</h2>
                            <div
                                className={
                                    selectedCategory !== ""
                                        ? styles.activeSelectedOption
                                        : styles.selectedOption
                                }
                                onClick={() => {
                                    setIsCategoryOpen(!isCategoryOpen);
                                    setIsAuthOpen(false);
                                    setIsReviewerOpen(false);
                                }}
                            >
                                <div><p>{selectedCategory || "All Categories"}</p></div>
                                <div>
                                    <img
                                        src={
                                            selectedCategory !== ""
                                                ? "/icons/down-white.png"
                                                : "/icons/down.png"
                                        }
                                        alt="Down Icon"
                                    />
                                </div>
                            </div>

                            {isCategoryOpen && (
                                <div className={styles.filterOptionsContainer}>
                                    <div
                                        className={styles.filterOptions}
                                        onClick={() => {
                                            setSelectedCategory("");
                                            setIsCategoryOpen(false);
                                        }}
                                    >
                                        All Categories
                                    </div>

                                    {uniqueCategories.map((category, index) => (
                                        <div
                                            className={
                                                selectedCategory === category
                                                    ? styles.activeFilter
                                                    : styles.filterOptions
                                            }
                                            key={index}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsCategoryOpen(false);
                                            }}
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

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
                                    setIsCategoryOpen(false);
                                    setIsReviewerOpen(false);
                                }}
                            >
                                <div><p>{selectedAuthor || "All Authors"}</p></div>
                                <div>
                                    <img
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
                                    setIsCategoryOpen(false);
                                    setIsAuthOpen(false);
                                }}
                            >
                                <div><p>{selectedReviewer || "All Reviewers"}</p></div>
                                <div>
                                    <img
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

                        <div
                            className={styles.createButton}
                            onClick={() => handleSelectDoc("new", "New Document")}
                        >
                            <div>
                                <img
                                    src={"/icons/plus-hover.png"}
                                    alt={"Plus Icon"}
                                />
                            </div>
                            Create New Document
                        </div>
                    </div>

                    <div className={styles.resultsContainer}>
                        <table className={styles.documentTable}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
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
                                        const categories = getDocCategories(doc);

                                        return (
                                            <tr
                                                key={doc.id}
                                                className={selectedDocId === doc.id ? styles.selectedRow : ""}
                                            >
                                                <td>{highlightText(doc.title, docSearch)}</td>
                                                <td>{categories.length ? categories.join(", ") : "—"}</td>
                                                <td>{doc.authoredBy || "—"}</td>
                                                <td>{doc.reviewedBy || "—"}</td>
                                                <td>{doc.lastUpdated || "—"}</td>

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
                                                            padding: "0.25rem",
                                                        }}
                                                    >
                                                        <img
                                                            src="/icons/edit-icon.png"
                                                            alt="Edit"
                                                            style={{
                                                                width: "1rem",
                                                                height: "1rem",
                                                                display: "block",
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
                                                            padding: "0.25rem",
                                                        }}
                                                    >
                                                        <img
                                                            src="/icons/trash-icon.png"
                                                            alt="Delete"
                                                            style={{
                                                                width: "1rem",
                                                                height: "1rem",
                                                                display: "block",
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
        </div>
    );
};

export default BodyContent;