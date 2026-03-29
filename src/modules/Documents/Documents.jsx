import React, { useMemo, useState } from "react";
import styles from "./styles/Documents.module.css";
import SearchBar from "../../shared/components/SearchBar";
import DocumentEditor from "./components/DocumentEditor";
import FilterPopup from "../../shared/components/FilterPopup";
import { highlightText } from "../../utils/highlightText";

// DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = ({ setActiveSubModule }) => {
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [docSearch, setDocSearch] = useState("");

    // local state so delete works in UI for dummy data
    const [dbDocs, setDbDocs] = useState(policyDocumentsDb?.documents ?? []);

    const emptyDocFilters = {
        category: "",
        authoredBy: "",
        reviewedBy: "",
    };
    const [docFilters, setDocFilters] = useState(emptyDocFilters);

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

    const filteredDocs = useMemo(() => {
        const q = docSearch.trim().toLowerCase();

        const filtered = dbDocs.filter((d) => {
            const matchesSearch =
                !q || (d.title ?? "").toLowerCase().includes(q);

            const docCategories = getDocCategories(d);

            const matchesCategory =
                !docFilters.category || docCategories.includes(docFilters.category);

            const matchesAuthoredBy =
                !docFilters.authoredBy || d.authoredBy === docFilters.authoredBy;

            const matchesReviewedBy =
                !docFilters.reviewedBy || d.reviewedBy === docFilters.reviewedBy;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesAuthoredBy &&
                matchesReviewedBy
            );
        });

        return filtered.sort((a, b) => {
            const da = new Date(a.lastUpdated);
            const db = new Date(b.lastUpdated);
            return db - da;
        });
    }, [dbDocs, docSearch, docFilters]);

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

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                minWidth: 0,
                            }}
                        >
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
                                    onClick={() => setDocFilters(emptyDocFilters)}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        padding: 0,
                                        margin: 0,
                                        fontSize: "0.72rem",
                                        color: "#6f7f98",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    Clear
                                </button>
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
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDocs.length > 0 ? (
                                    filteredDocs.map((doc) => {
                                        const categories = getDocCategories(doc);

                                        return (
                                            <tr
                                                key={doc.id}
                                                className={
                                                    selectedDocId === doc.id
                                                        ? styles.selectedRow
                                                        : ""
                                                }
                                            >
                                                <td>{highlightText(doc.title, docSearch)}</td>
                                                <td>
                                                    {categories.length > 0
                                                        ? categories.join(", ")
                                                        : "—"}
                                                </td>
                                                <td>{doc.authoredBy || "—"}</td>
                                                <td>{doc.reviewedBy || "—"}</td>
                                                <td>{doc.lastUpdated || "—"}</td>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "0.35rem",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSelectDoc(doc.id, doc.title)
                                                            }
                                                            aria-label={`Edit ${doc.title}`}
                                                            title="Edit document"
                                                            style={{
                                                                border: "none",
                                                                background: "transparent",
                                                                cursor: "pointer",
                                                                padding: "0.25rem",
                                                                fontSize: "1rem",
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            ✏️
                                                        </button>

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
                                                                fontSize: "1rem",
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
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