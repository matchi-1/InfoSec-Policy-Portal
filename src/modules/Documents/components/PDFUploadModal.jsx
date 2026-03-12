import styles from "../styles/PDFModal.module.css";
import { useState } from "react";
const BodyContent = () => {
    const [file, setFile] = useState(null);

    const handleUpload = async (e) => {
    
    }
    return (
        <div className={styles.PDFModal}>
            <div className={styles.PDFModalBody}>
                <form onSubmit={handleUpload}>
                    <input type="file" accept="application/pdf" onChange={(e) => {setFile(e.target.files[0])}}/>
                    <button type="submit">upload</button>
                    <p>bruh</p>
                </form>
            </div>
        </div>
    )
}

export default BodyContent;