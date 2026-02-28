import React from "react";
import styles from "./styles/Policies.module.css";
import SearchBar from "../../shared/components/SearchBar";


const documents = [
    { id: 1, name: "Access Control Policy and Implementation" },
    { id: 2, name: "Data Protection and Privacy Guidelines" },
    { id: 3, name: "Incident Response and Management" },
    { id: 4, name: "Network Security Standards" },
    { id: 5, name: "Authentication and Authorization Methods" },
    { id: 6, name: "Encryption and Data Confidentiality" },
    { id: 7, name: "Compliance and Regulatory Requirements" },
    { id: 8, name: "Risk Management Framework" },
    { id: 9, name: "Vulnerability Assessment Procedures" },
    { id: 10, name: "Security Policies and Standards" },
    { id: 11, name: "Disaster Recovery and Continuity Planning" },
    { id: 12, name: "Physical Security Controls" },
    { id: 13, name: "Email Security and Protection" },
    { id: 14, name: "Mobile Security and Device Management" },
    { id: 15, name: "Cloud Security and Infrastructure" },
    { id: 16, name: "Third-Party Risk Management" },
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

                    <h2>Documents</h2>

                    <SearchBar placeholder="Search documents..." />

                    {/*filter btn*/}
                    <div className={styles.filterAndFileNumContainer}>
                        <div className={styles.filterContainer}>
                            <button className={styles.filterButton}>Filter</button>
                        </div>
                        <span className={styles.fileNumText}>{documents.length} Files</span>
                    </div>

                    <div className={styles.documentAndFooterContainer}>
                        <div className={styles.documentsContainer}>
                            {paginatedDocuments.map((doc) => (
                                <div key={doc.id} className={styles.documentItem}>
                                    <div className={styles.documentTextContainer}>
                                        <p>{doc.name}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className={styles.paginationContainer}>
                            <div className={styles.pagination}>
                                {currentPage > 1 && <button className={styles.pageButton} onClick={handlePrevPage}>{"<"}</button>}
                                <span className={styles.pageNumber}> Page {currentPage} of {totalPages} </span>
                                {currentPage < totalPages && <button className={styles.pageButton} onClick={handleNextPage}>{">"}</button>}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BodyContent;
