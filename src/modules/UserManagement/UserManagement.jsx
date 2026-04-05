import React from "react";
import styles from "./styles/UserManagement.module.css";

const BodyContent = () => {
  return (
    <div className={styles.usermanagement}>
      <div className={styles.bodyContentContainer}>
        {/* Header */}
        <div>
          {/* Label */}
          <div>
            <h4>SYSTEM ADMINISTRATION</h4>
            <h2>User Management</h2>
          </div>
          {/* Search Bar */}
          <div>
            <img src="" alt="" />
            <input
              type="text"
              name=""
              id=""
              placeholder="Search users or emails..."
            />
          </div>
        </div>

        {/* Table */}
        <main>
          <tr>
            <th>User</th>
            <th>Access Level</th>
            <th>Last Active</th>
          </tr>
        </main>

        {/* Buttons */}
        <div></div>
      </div>
    </div>
  );
};

export default BodyContent;
