import React from "react";
import styles from "./styles/RecentNews.css";

const BodyContent = () => {
    return (
        <div className={styles.recentnews}>
            <div className={styles.bodyContentContainer}>
                <p>Hello Recent News Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
            </div>
        </div>
    );
};

export default BodyContent;
