import React, { useState, useMemo } from "react";
import styles from "./styles/Documents.module.css";
import SearchBar from "../../shared/components/SearchBar";
import DocumentEditor from "./components/DocumentEditor";
import { highlightText } from "../../utils/highlightText";

//  DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = ({ setActiveSubModule }) => {
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isPdfViewActive, setIsPdfViewActive] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");

  // derive list from dummy DB
  const documents = useMemo(() => {
      const dbDocs = policyDocumentsDb?.documents ?? [];
      return dbDocs.map((d) => ({ id: d.id, name: d.title }));
  }, [policyDocumentsDb?.documents]);


  const handleSelectDoc = (docId, docTitle) => {
      setSelectedDocId(docId);
      if (setActiveSubModule) {
          setActiveSubModule(docTitle);
      }
      // setIsPdfViewActive(false); //  whenever we change docs, we exit PDF view mode
      // setIsHeaderCollapsed(false); // reset header collapse state when changing docs
  };

  // DB docs (full objects)
  const dbDocs = useMemo(() => policyDocumentsDb?.documents ?? [], []);

  const uniqueAuthors = [...new Set(dbDocs.map(doc => doc.authoredBy))];
  const uniqueReviewers = [...new Set(dbDocs.map(doc => doc.reviewedBy))];

  // Filter by title and sort by last updated date (newest first)
  const sortedDocs = useMemo(() => {
      const q = docSearch.trim().toLowerCase();

      // filter
      let list = q
          ? dbDocs.filter((d) => (d.title ?? "").toLowerCase().includes(q))
          : [...dbDocs];

      // sort by lastUpdated descending
      return list.sort((a, b) => {
          const da = new Date(a.lastUpdated);
          const db = new Date(b.lastUpdated);
          return db - da;
      });
  }, [dbDocs, docSearch]);
    
  // Filter table based on dropdown
  const docsbyAuthor = selectedAuthor
    ? sortedDocs.filter(doc => doc.authoredBy === selectedAuthor)
    : sortedDocs;

  const docsbyReviewer = selectedReviewer
    ? sortedDocs.filter(doc => doc.reviewedBy === selectedReviewer)
    : sortedDocs;

  // Get selected document
  const selectedDoc = useMemo(() => {
      // if selectedDocId is "new", return a blank template object
      if (selectedDocId === "new") {
          return {
            // "new" temp id value 
              id: "new",
              title: "New Document",
              content: "",
              authoredBy: "",
              reviewedBy: "",
              lastUpdated: new Date()
          };
      }
      return dbDocs.find((d) => d.id === selectedDocId) ?? null;
  }, [dbDocs, selectedDocId]);

  return (
    <div className={styles.policiesDsh}>
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
            // Documents Dashboard
          <div className={styles.bodyContentContainer}>
            <h1>Documents</h1>
            <div className={styles.searchBarContainer}>
                <SearchBar
                    placeholder="Search documents..."
                    value={docSearch}
                    onChange={setDocSearch}
                />
            </div>

            <select 
                className={styles.filterContainer}
                value={selectedAuthor}
                onChange={(e) => {
                    setSelectedAuthor(e.target.value)
                    setSelectedReviewer("") // reset reviewer filter when author filter changes
                }}
            >
                <option value="">All Authors</option>
                    {uniqueAuthors.map((author, index) => (
                    <option key={index} value={author}>
                        {author}
                    </option>
                ))}
                <img
                    src={"/icons/down.png"}
                    alt={"Down Icon"}
                />
            </select>

            <select 
                className={styles.filterContainer}
                value={selectedReviewer}
                onChange={(e) => {
                    setSelectedReviewer(e.target.value)
                    setSelectedAuthor("") // reset author filter when reviewer filter changes
                }}
            >
                <option value="">All Reviewers</option>
                    {uniqueReviewers.map((reviewer, index) => (
                    <option key={index} value={reviewer}>  
                        {reviewer}
                    </option>
                ))}
                <img
                    src={"/icons/down.png"}
                    alt={"Down Icon"}
                />
            </select>

            <button
                className={styles.createButton}
                onClick={() => handleSelectDoc("new", "New Document")}
            >Create New</button>


            <div className={styles.resultsContainer}>
                {sortedDocs.length > 0 ? (
                    <table className={styles.documentTable}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Authored By</th>
                                <th>Reviewed By</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            selectedAuthor && docsbyAuthor.length > 0 ? docsbyAuthor.map((doc) => (
                                <tr
                                    key={doc.id}
                                    className={selectedDocId === doc.id ? styles.selectedRow : ""}
                                    onClick={() => handleSelectDoc(doc.id, doc.title)}
                                >
                                    <td>{highlightText(doc.title, docSearch)}</td>
                                    <td>{doc.authoredBy}</td>
                                    <td>{doc.reviewedBy}</td>
                                    <td>{doc.lastUpdated}</td>
                                </tr>
                            )) : selectedReviewer && docsbyReviewer.length > 0 ? docsbyReviewer.map((doc) => (
                                <tr
                                    key={doc.id}
                                    className={selectedDocId === doc.id ? styles.selectedRow : ""}
                                    onClick={() => handleSelectDoc(doc.id, doc.title)}
                                >           
                                    <td>{highlightText(doc.title, docSearch)}</td>
                                    <td>{doc.authoredBy}</td>
                                    <td>{doc.reviewedBy}</td>
                                    <td>{doc.lastUpdated}</td>
                                </tr>
                            )) : docsbyAuthor.length === 0 || docsbyReviewer.length === 0 ? (
                                <p style={{ fontSize: "0.875rem", color: "#888" }}>No documents found for selected filter.</p>
                            ) : 
                                sortedDocs.map((doc) => (
                                <tr
                                    key={doc.id}
                                    className={selectedDocId === doc.id ? styles.selectedRow : ""}
                                    onClick={() => handleSelectDoc(doc.id, doc.title)}
                                >
                                    <td>{highlightText(doc.title, docSearch)}</td>
                                    <td>{doc.authoredBy}</td>
                                    <td>{doc.reviewedBy}</td>
                                    <td>{doc.lastUpdated}</td>
                                </tr>
                            ))} 
                        </tbody>
                    </table>
                ) : (
                    <p style={{ fontSize: "0.875rem", color: "#888" }}>No documents found.</p>
                )}
            </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default BodyContent;
