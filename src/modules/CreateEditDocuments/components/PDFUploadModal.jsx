import styles from "../styles/PDFModal.module.css";
import { useState } from "react";
const BodyContent = ({ setShowUploadModal, setFile, setFileNameTemp }) => {
    const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE
    const [tempFile, setTempFile] = useState(null)
    const [showUploadToast, setShowUploadToast] = useState(false);
    return (
        <div className={styles.PDFModal}>
            <div className={styles.PDFModalBody}>
                <div className={styles.PDFModalHeader}>
                    <h3>Upload PDF</h3>

                    <p>
                        Select or Drag a PDF file to attach to this document.
                    </p>
                </div>

                <label className={styles.uploadInputWrapper}>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            setTempFile(e.target.files[0])
                        }}
                    />

                    <div className={styles.uploadInputContent}>
                        <img src="/icons/upload-file.png" />

                        <div>
                            <span>
                                {tempFile ? tempFile.name : "Choose PDF file"}
                            </span>

                            <p>
                                .pdf files only
                            </p>
                        </div>
                    </div>
                </label>

                <div className={styles.PDFModalButtons}>
                    <button
                        className={styles.cancelBtn}
                        onClick={() => {
                            setShowUploadModal(false)
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        className={styles.confirmBtn}
                        disabled={!tempFile}
                        onClick={(e) => {
                            e.preventDefault()
                            console.log(tempFile)
                            setFile(tempFile)
                            setFileNameTemp(tempFile.name)

                            setShowUploadToast(true);
                            setTimeout(() => {
                                setShowUploadToast(false)
                            }, 1000);
                            
                            setTimeout(() => {
                                setShowUploadModal(false)
                            }, 1010);
                        }}
                    >
                        Upload PDF
                    </button>
                </div>
            </div>
            {showUploadToast && (
                <div className={styles.toastAlert}>
                    <div className={styles.toastAlertContent}>
                        <p className={styles.toastAlertTitle}>
                            PDF Added
                        </p>

                        <p className={styles.toastAlertText}>
                            Document "<strong>{tempFile.name}</strong>" successfully attached to this document.
                        </p>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default BodyContent;