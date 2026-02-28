import React from "react";
import styles from "./styles/Policies.module.css";
import SearchBar from "../../shared/components/SearchBar";


const documents = [
    { id: 1, name: "Access Control" },
    { id: 2, name: "Data Protection" },
    { id: 3, name: "Incident Response" },
    { id: 4, name: "Network Security" },
    { id: 5, name: "Authentication" },
    { id: 6, name: "Encryption" },
    { id: 7, name: "Compliance" },
    { id: 8, name: "Risk Management" },
    { id: 9, name: "Vulnerability Assessment" },
    { id: 10, name: "Security Policies" },
    { id: 11, name: "Disaster Recovery" },
    { id: 12, name: "Physical Security" },
    { id: 13, name: "Email Security" },
    { id: 14, name: "Mobile Security" },
    { id: 15, name: "Cloud Security" },
    { id: 16, name: "Third-Party Management" },
];

const BodyContent = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(documents.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDocuments = documents.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className={styles.policies}>
            <div className={styles.bodyContentContainer}>
                <div className={styles.sideDocumentContainer}>
                    <p>Documents</p>
                    <SearchBar placeholder="Search documents..." />
                    {/*filter btn*/}

                    <div className={styles.documentsContainer}>
                        {paginatedDocuments.map((doc) => (
                            <div key={doc.id} className={styles.document}>
                                <p>{doc.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.pagination}>
                        {currentPage > 1 && <button className={styles.pageButton} onClick={handlePrevPage}>{"<"}</button>}
                        <span className={styles.pageNumber}> Page {currentPage} of {totalPages} </span>
                        {currentPage < totalPages && <button className={styles.pageButton} onClick={handleNextPage}>{">"}</button>}
                    </div>

                    {/* <div className={styles.FileCountContainer}>
                            <p>Showing 10 of 10 documents</p> 
                        </div>*/}
                </div>
            </div>
        </div>
    );
};

export default BodyContent;
