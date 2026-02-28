import React from "react";
import styles from "./styles/Others.module.css";

const BodyContent = () => {
    return (
        <div className={styles.others}>
            <div className={styles.bodyContentContainer}>
                <p>Hello Others Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
            </div>
        </div>
    );
};

export default BodyContent;