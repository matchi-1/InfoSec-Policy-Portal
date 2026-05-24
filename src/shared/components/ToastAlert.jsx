import styles from "./DocumentEditor.module.css"

export default function ToastAlert({
    title = "No PDF Available",
    message = "Upload a PDF file and save the document before viewing.",
}) {
    return (
        <div className={styles.toastAlert}>
            <div className={styles.toastAlertContent}>
                <p className={styles.toastAlertTitle}>{title}</p>
                <p className={styles.toastAlertText}>{message}</p>
            </div>
        </div>
    )
}