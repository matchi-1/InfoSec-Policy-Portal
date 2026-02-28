import React from "react";
import styles from "./styles/Policies.module.css";

const BodyContent = () => {
    return (
        <div className={styles.policies}>
            <div className={styles.bodyContentContainer}>
                <p>Hello Policies Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
            </div>
        </div>
    );
};

export default BodyContent;
