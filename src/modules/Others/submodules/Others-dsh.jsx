import React from "react";
import styles from "../styles/OthersDsh.module.css";

const BodyContent = () => {
  return (
    <div className={styles.othersDsh}>
      <div className={styles.bodyContentContainer}>
        <p>Hello Others Dashboard SubModule!</p>
        <p>Fill this container with your elements, change the display if need be.</p>
      </div>
    </div>
  );
};

export default BodyContent;
