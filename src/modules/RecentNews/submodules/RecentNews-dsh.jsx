import React from "react";
import styles from "../styles/RecentNews-dsh.css";

const BodyContent = () => {
  return (
    <div className={styles.recentnewsDsh}>
      <div className={styles.bodyContentContainer}>
        <p>Hello Recent News Dashboard SubModule!</p>
        <p>Fill this container with your elements, change the display if need be.</p>
        <p>If you're going to style with css, use your unique namespace '.recentnews-dsh' at the start.</p>
      </div>
    </div>
  );
};

export default BodyContent;
