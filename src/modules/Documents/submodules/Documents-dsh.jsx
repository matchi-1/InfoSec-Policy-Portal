import React from "react";
import styles from "../styles/DocumentsDsh.module.css";
import SearchBar from "../../shared/components/SearchBar";
import PolicySections from "./components/PolicySections";
import { highlightText } from "../../utils/highlightText";

//  DB-like dummy source
import { policyDocumentsDb } from "./data/policyDocumentsDb";

const BodyContent = () => {
  const [selectedDocId, setSelectedDocId] = useState(null);
  // const [isPdfViewActive, setIsPdfViewActive] = useState(false);
  // const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  // derive list from dummy DB
  const documents = useMemo(() => {
      const dbDocs = policyDocumentsDb?.documents ?? [];
      return dbDocs.map((d) => ({ id: d.id, name: d.title }));
  }, [policyDocumentsDb?.documents]);


  const handleSelectDoc = (docId) => {
      setSelectedDocId(docId);
      // setIsPdfViewActive(false); //  whenever we change docs, we exit PDF view mode
      // setIsHeaderCollapsed(false); // reset header collapse state when changing docs
  };

  // DB docs (full objects)
  const dbDocs = useMemo(() => policyDocumentsDb?.documents ?? [], []);

  // Filter by title
  const filteredDocs = useMemo(() => {
      const q = docSearch.trim().toLowerCase();
      if (!q) return dbDocs;
      return dbDocs.filter((d) => (d.title ?? "").toLowerCase().includes(q));
  }, [dbDocs, docSearch]);

  // Selected document (use dbDocs so it matches the real object)
  const selectedDoc = useMemo(() => {
      return dbDocs.find((d) => d.id === selectedDocId) ?? null;
  }, [dbDocs, selectedDocId]);
  

  return (
    <div className={styles.policiesDsh}>
      <div className={styles.bodyContentContainer}>
        <p>Documents Dashboard -- Just a sample submodule</p>
      
        <h1>Documents</h1>
        <div className={styles.searchBarContainer}>
            <SearchBar
                placeholder="Search documents..."
                value={docSearch}
                onChange={setDocSearch}
            />
        </div>

      </div>
    </div>
  );
};

export default BodyContent;
