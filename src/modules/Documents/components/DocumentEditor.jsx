import { useEffect, useMemo, useState } from "react";
import styles from "../styles/DocumentEditor.module.css";
import { highlightText } from "../../../utils/highlightText";

const BodyContent = () => {
    return (
        <div className={styles.documentEditor}>
            <div className={styles.bodyContentContainer}>
                <p>Document Editor</p>
            </div>
        </div>
    );
};

export default BodyContent;