import React, { useMemo, useState } from "react";
import styles from "../styles/RoleManagement.module.css";
import Button from "../../../shared/components/Button";
import Dropdown from "../../../shared/components/Dropdown";

const roleDefinitions = {
  "Senior Architect": {
    impactedUsers: 14,
    modules: {
      "Module 1": { view: true },
      "Module 2": { view: true },
      "Module 3": { view: true },
      "Module 4": { view: true },
    },
  },
  Administrator: {
    impactedUsers: 25,
    modules: {
      "Module 1": { view: true },
      "Module 2": { view: true },
      "Module 3": { view: true },
      "Module 4": { view: true },
    },
  },
  "Guest Viewer": {
    impactedUsers: 38,
    modules: {
      "Module 1": { view: true },
      "Module 2": { view: true },
      "Module 3": { view: true },
      "Module 4": { view: true },
    },
  },
};

const permissionColumns = ["view"];

const cloneModules = (modules) => JSON.parse(JSON.stringify(modules));

const BodyContent = () => {
  const roleNames = useMemo(() => Object.keys(roleDefinitions), []);
  const [selectedRole, setSelectedRole] = useState(roleNames[0]);
  const [draftPermissions, setDraftPermissions] = useState(() =>
    cloneModules(roleDefinitions[roleNames[0]].modules),
  );
  const [savedPermissions, setSavedPermissions] = useState(() =>
    cloneModules(roleDefinitions[roleNames[0]].modules),
  );
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("New Role 1");

  const impactedUsers = roleDefinitions[selectedRole]?.impactedUsers ?? 0;
  const moduleNames = Object.keys(draftPermissions);

  const hasUnsavedChanges = useMemo(() => {
    return moduleNames.some((moduleName) =>
      permissionColumns.some(
        (permission) =>
          draftPermissions[moduleName]?.[permission] !==
          savedPermissions[moduleName]?.[permission],
      ),
    );
  }, [draftPermissions, moduleNames, savedPermissions]);

  const handleRoleChange = (nextRole) => {
    setSelectedRole(nextRole);
    setDraftPermissions(cloneModules(roleDefinitions[nextRole].modules));
    setSavedPermissions(cloneModules(roleDefinitions[nextRole].modules));
  };

  const togglePermission = (moduleName, permission) => {
    setDraftPermissions((current) => ({
      ...current,
      [moduleName]: {
        ...current[moduleName],
        [permission]: !current[moduleName][permission],
      },
    }));
  };

  const handleDiscard = () => {
    setDraftPermissions(cloneModules(savedPermissions));
  };

  const handleSave = () => {
    setSavedPermissions(cloneModules(draftPermissions));
  };

  return (
    <div className={styles.rolemanagement}>
      <div className={styles.bodyContentContainer}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>System Administration</p>
          <h2>Role Management</h2>
        </header>

        <section className={styles.workspace}>
          <aside className={styles.configCard}>
            <div className={styles.configHeader}>
              <h3>Select Configuration</h3>
              <Button
                variant="primary"
                size="sm"
                className={styles.newButton}
                onClick={() => setIsNewRoleModalOpen(true)}
              >
                New
              </Button>
            </div>

            <Dropdown
              className={styles.roleDropdown}
              value={selectedRole}
              options={roleNames}
              onChange={handleRoleChange}
              ariaLabel="Select role configuration"
            />

            <p className={styles.helperText}>
              Modifying permissions for the <strong>{selectedRole}</strong>{" "}
              tier. These changes will propagate to {impactedUsers} active
              users.
            </p>
          </aside>

          <div className={styles.permissionsCard}>
            <div className={styles.permissionsHeader}>
              <span>Module</span>
              <span>Access</span>
            </div>

            <div className={styles.permissionsBody}>
              {moduleNames.map((moduleName) => (
                <div key={moduleName} className={styles.permissionsRow}>
                  <div className={styles.moduleName}>{moduleName}</div>

                  {permissionColumns.map((permission) => (
                    <label
                      key={`${moduleName}-${permission}`}
                      className={styles.checkboxCell}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(
                          draftPermissions[moduleName]?.[permission],
                        )}
                        onChange={() =>
                          togglePermission(moduleName, permission)
                        }
                        aria-label={`${permission} permission for ${moduleName}`}
                      />
                      <span className={styles.checkboxVisual} />
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className={styles.actionsBar}>
          <Button
            variant="secondary"
            size="md"
            className={styles.discardButton}
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges}
          >
            Discard Changes
          </Button>

          <Button
            variant="primary"
            size="md"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            Save Role
          </Button>
        </footer>

        {isNewRoleModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setIsNewRoleModalOpen(false)}
          >
            <div
              className={styles.modalCard}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h4>Creating New Role</h4>
                <Button
                  variant="primary"
                  size="sm"
                  className={styles.cancelButton}
                  onClick={() => setIsNewRoleModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>

              <input
                type="text"
                value={newRoleName}
                onChange={(event) => setNewRoleName(event.target.value)}
                className={styles.modalInput}
              />

              <p className={styles.modalCopy}>
                Configure the access levels for your new role. After saving, you
                will be able to assign users to this role.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyContent;
