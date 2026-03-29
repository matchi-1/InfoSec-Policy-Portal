import styles from "../styles/PDFModal.module.css";
import { useState } from "react";
const BodyContent = ( {setShowUploadModal, setFile} ) => {
    const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE
    const [tempFile, setTempFile] = useState(null)
    return (
        <div className={styles.PDFModal}>
            <div className={styles.PDFModalBody}>
                <input type="file" accept="application/pdf" onChange={(e) => {setTempFile(e.target.files[0])}}/>
                <button onClick={(e) => {
                    e.preventDefault();
                    setFile(tempFile);
                    setShowUploadModal(false);
                }}>upload</button>
                <button onClick={() => {console.log("closing modal");setShowUploadModal(false)}}>close</button>
            </div>
        </div>
    )
}

export default BodyContent;