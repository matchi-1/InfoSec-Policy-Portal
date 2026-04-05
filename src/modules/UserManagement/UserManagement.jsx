import React, { useMemo, useState } from "react";
import styles from "./styles/UserManagement.module.css";
import Button from "../../shared/components/Button";
import Dropdown from "../../shared/components/Dropdown";

const initialUsers = [
  {
    id: 1,
    name: "Julian Sterling",
    email: "j.sterling@architect-erp.com",
    initials: "JS",
    avatarColor: "#d7e2ff",
    role: "Project Editor",
    status: "ACTIVE",
    statusTone: "active",
  },
  {
    id: 2,
    name: "Elena Aris",
    email: "elena.aris@studio-flow.io",
    initials: "EA",
    avatarColor: "#dcd8ff",
    role: "Administrator",
    status: "ACTIVE",
    statusTone: "active",
  },
  {
    id: 3,
    name: "Marcus Kael",
    email: "m.kael@infrastructure.net",
    initials: "MK",
    avatarColor: "#d6e1f7",
    role: "Guest Viewer",
    status: "ONLINE",
    statusTone: "online",
  },
  {
    id: 4,
    name: "Talia e aze",
    email: "talia@design-foundry.com",
    initials: "TH",
    avatarColor: "#d8e4ef",
    role: "Project Editor",
    status: "ACTIVE",
    statusTone: "active",
  },
  {
    id: 5,
    name: "Julian Sterling",
    email: "j.sterling@architect-erp.com",
    initials: "JS",
    avatarColor: "#d7e2ff",
    role: "Project Editor",
    status: "ACTIVE",
    statusTone: "active",
  },
];

const roleOptions = [
  "Project Editor",
  "Administrator",
  "Guest Viewer",
  "Read Only",
  "System Owner",
  "Security Analyst",
  "Risk Manager",
  "Compliance Officer",
  "Policy Approver",
  "Policy Author",
  "Document Controller",
  "Audit Reviewer",
  "Internal Auditor",
  "External Auditor",
  "Incident Responder",
  "Access Manager",
  "Data Steward",
  "Department Manager",
  "Team Lead",
  "Operations Specialist",
  "Support Engineer",
  "Contractor",
  "Temporary Staff",
];

const formatUserCount = (count) => `Showing ${count} of 1,216 total users`;

const BodyContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [draftRoles, setDraftRoles] = useState(() =>
    Object.fromEntries(initialUsers.map((user) => [user.id, user.role])),
  );
  const [committedRoles, setCommittedRoles] = useState(() =>
    Object.fromEntries(initialUsers.map((user) => [user.id, user.role])),
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return initialUsers.filter((user) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.role.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm]);

  const hasUnsavedChanges = useMemo(
    () =>
      initialUsers.some(
        (user) => draftRoles[user.id] !== committedRoles[user.id],
      ),
    [committedRoles, draftRoles],
  );

  const handleRoleChange = (userId, nextRole) => {
    setDraftRoles((currentRoles) => ({
      ...currentRoles,
      [userId]: nextRole,
    }));
  };

  const handleSaveChanges = () => {
    setCommittedRoles(draftRoles);
  };

  return (
    <div className={styles.usermanagement}>
      <div className={styles.bodyContentContainer}>
        <div className={styles.topGlow} />

        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <p className={styles.eyebrow}>System Administration</p>
            <h2>User Management</h2>
          </div>

          <label
            className={styles.searchShell}
            aria-label="Search users or emails"
          >
            <img src="/icons/search-icon.png" alt="" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search users or emails..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </header>

        <section
          className={styles.tableCard}
          aria-label="User management table"
        >
          <div className={styles.tableHeader} role="row">
            <span>User</span>
            <span>Access Level</span>
            <span>Activity</span>
          </div>

          <div className={styles.tableBody}>
            {filteredUsers.map((user) => (
              <div className={styles.tableRow} role="row" key={user.id}>
                <div className={styles.userCell} role="cell">
                  <div
                    className={styles.avatar}
                    style={{ backgroundColor: user.avatarColor }}
                    aria-hidden="true"
                  >
                    {user.initials}
                  </div>

                  <div className={styles.userInfo}>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className={styles.roleCell} role="cell">
                  <Dropdown
                    className={styles.roleDropdown}
                    value={draftRoles[user.id] ?? user.role}
                    options={roleOptions}
                    onChange={(nextRole) => handleRoleChange(user.id, nextRole)}
                    ariaLabel={`Access level for ${user.name}`}
                  />
                </div>

                <div className={styles.activityCell} role="cell">
                  <span
                    className={`${styles.statusPill} ${styles[user.statusTone]}`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footerBar}>
          <p className={styles.footerMeta}>
            {formatUserCount(filteredUsers.length)}
          </p>

          <div className={styles.pagination} aria-label="Pagination">
            <button type="button" className={styles.paginationControl}>
              Previous
            </button>
            <button
              type="button"
              className={`${styles.paginationPage} ${styles.paginationActive}`}
            >
              1
            </button>
            <button type="button" className={styles.paginationPage}>
              2
            </button>
            <button type="button" className={styles.paginationPage}>
              3
            </button>
            <span className={styles.paginationDots}>...</span>
            <button type="button" className={styles.paginationPage}>
              42
            </button>
            <button type="button" className={styles.paginationControl}>
              Next
            </button>
          </div>
        </footer>

        <div className={styles.actionsBar}>
          <Button
            variant="subtle"
            size="sm"
            className={styles.manageRolesButton}
            icon={<span className={styles.manageRolesIcon}>♟</span>}
          >
            Manage Roles
          </Button>

          <div className={styles.saveCluster}>
            <span className={styles.saveHint}>
              {hasUnsavedChanges
                ? "Unsaved changes detected"
                : "All changes saved"}
            </span>
            <Button
              className={styles.saveButton}
              variant="primary"
              size="lg"
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
