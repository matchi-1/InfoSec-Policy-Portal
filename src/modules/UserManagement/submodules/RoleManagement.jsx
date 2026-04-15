import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/RoleManagement.module.css";
import Button from "../../../shared/components/Button";
import Dropdown from "../../../shared/components/Dropdown";

const APP_MODULES = [
  "Home",
  "Documents",
  "Policies",
  "RecentNews",
  "Others",
  "UserManagement",
];

const normalizeRoleList = (payload) => {
  const roles = Array.isArray(payload) ? payload : (payload?.data ?? []);
  return roles.map((role) => ({
    roleId: role.role_id,
    roleName: role.role_name,
    userCount: role.user_count ?? 0,
    modules: Array.isArray(role.modules) ? role.modules : [],
  }));
};

const toModuleState = (modules) => {
  const fromApi = new Set(Array.isArray(modules) ? modules : []);

  if (fromApi.has("All")) {
    return Object.fromEntries(APP_MODULES.map((name) => [name, true]));
  }

  return Object.fromEntries(
    APP_MODULES.map((name) => [name, fromApi.has(name)]),
  );
};

const getSelectedModules = (moduleState) =>
  Object.entries(moduleState)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([name]) => name);

const BodyContent = () => {
  const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE;
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [draftModules, setDraftModules] = useState(() => toModuleState([]));
  const [savedModules, setSavedModules] = useState(() => toModuleState([]));
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const roleNames = useMemo(() => roles.map((role) => role.roleName), [roles]);

  const selectedRoleMeta = useMemo(
    () => roles.find((role) => role.roleName === selectedRole),
    [roles, selectedRole],
  );

  const isAdminRole = selectedRoleMeta?.roleName === "Admin";
  const impactedUsers = selectedRoleMeta?.userCount ?? 0;
  const moduleNames = APP_MODULES;

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const resp = await fetch(`${backend_base_url}/roles/`);
        if (!resp.ok) {
          throw new Error(`Failed to fetch roles (${resp.status})`);
        }

        const payload = await resp.json();
        const normalizedRoles = normalizeRoleList(payload);
        setRoles(normalizedRoles);

        if (!normalizedRoles.length) {
          setSelectedRole("");
          setSavedModules(toModuleState([]));
          setDraftModules(toModuleState([]));
          return;
        }

        const initialRoleName = normalizedRoles[0].roleName;
        setSelectedRole(initialRoleName);
      } catch (error) {
        setErrorMessage(error.message || "Unable to load roles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [backend_base_url]);

  useEffect(() => {
    if (!selectedRole) {
      return;
    }

    const fetchRoleByName = async () => {
      setErrorMessage("");

      try {
        const resp = await fetch(
          `${backend_base_url}/roles/${encodeURIComponent(selectedRole)}/`,
        );

        if (!resp.ok) {
          throw new Error(`Failed to fetch role details (${resp.status})`);
        }

        const payload = await resp.json();
        const roleDetail = payload?.data ?? payload;
        const nextModules = toModuleState(roleDetail?.modules ?? []);

        if ((roleDetail?.role_name ?? selectedRole) === "Admin") {
          nextModules.UserManagement = true;
        }

        setSavedModules(nextModules);
        setDraftModules(nextModules);
      } catch (error) {
        setErrorMessage(error.message || "Unable to load role details");
      }
    };

    fetchRoleByName();
  }, [backend_base_url, selectedRole]);

  const hasUnsavedChanges = useMemo(() => {
    return moduleNames.some(
      (moduleName) => draftModules[moduleName] !== savedModules[moduleName],
    );
  }, [draftModules, moduleNames, savedModules]);

  const handleRoleChange = (nextRole) => {
    setStatusMessage("");
    setSelectedRole(nextRole);
  };

  const handleStartCreateRole = () => {
    setStatusMessage("");
    setErrorMessage("");
    setNewRoleName("");
    setIsNewRoleModalOpen(true);
  };

  const handleCancelCreateRole = () => {
    setIsNewRoleModalOpen(false);
    setNewRoleName("");
  };

  const toggleModule = (moduleName) => {
    setDraftModules((current) => ({
      ...current,
      [moduleName]: !current[moduleName],
    }));
  };

  const handleDiscard = () => {
    setDraftModules(savedModules);
  };

  const handleSave = async () => {
    if (!selectedRole) {
      return;
    }

    const modules = getSelectedModules(
      isAdminRole ? { ...draftModules, UserManagement: true } : draftModules,
    );
    if (!modules.length) {
      setErrorMessage("Select at least one module.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const resp = await fetch(
        `${backend_base_url}/roles/${encodeURIComponent(selectedRole)}/modules/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ modules }),
        },
      );

      if (!resp.ok) {
        throw new Error(`Failed to update role modules (${resp.status})`);
      }

      setSavedModules(draftModules);
      setStatusMessage("Role modules saved.");

      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.roleName === selectedRole ? { ...role, modules } : role,
        ),
      );
    } catch (error) {
      setErrorMessage(error.message || "Unable to save role modules");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRole = async () => {
    const roleName = newRoleName.trim();
    if (!roleName) {
      setErrorMessage("Role name is required.");
      return;
    }

    const modules = getSelectedModules(
      isAdminRole ? { ...draftModules, UserManagement: true } : draftModules,
    );
    if (!modules.length) {
      setErrorMessage("Select at least one module for the new role.");
      return;
    }

    setIsCreating(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const resp = await fetch(`${backend_base_url}/roles/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_name: roleName, modules }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to create role (${resp.status})`);
      }

      const listResp = await fetch(`${backend_base_url}/roles/`);
      if (!listResp.ok) {
        throw new Error(`Failed to refresh roles (${listResp.status})`);
      }

      const refreshedPayload = await listResp.json();
      const normalizedRoles = normalizeRoleList(refreshedPayload);
      setRoles(normalizedRoles);
      setSelectedRole(roleName);
      setNewRoleName("");
      setIsNewRoleModalOpen(false);
      setStatusMessage("Role created successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to create role");
    } finally {
      setIsCreating(false);
    }
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
            {!isNewRoleModalOpen ? (
              <>
                <div className={styles.configHeader}>
                  <h3>Select Configuration</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    className={styles.newButton}
                    onClick={handleStartCreateRole}
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
                  {selectedRole ? (
                    <>
                      Modifying permissions for the{" "}
                      <strong>{selectedRole}</strong> role. These changes will
                      propagate to {impactedUsers} active users.
                    </>
                  ) : (
                    "Create your first role to start configuring module access."
                  )}
                </p>
              </>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h4>Creating New Role</h4>
                  <Button
                    variant="primary"
                    size="sm"
                    className={styles.cancelButton}
                    onClick={handleCancelCreateRole}
                  >
                    Cancel
                  </Button>
                </div>

                <input
                  type="text"
                  value={newRoleName}
                  onChange={(event) => setNewRoleName(event.target.value)}
                  className={styles.modalInput}
                  placeholder="Enter role name"
                />

                <p className={styles.modalCopy}>
                  New roles use the selected module access from this workspace.
                  Choose modules on the right, then create the role.
                </p>
              </>
            )}
          </aside>

          <div className={styles.permissionsCard}>
            <div className={styles.permissionsHeader}>
              <span>Module</span>
              <span>Access</span>
            </div>

            <div className={styles.permissionsBody}>
              {isLoading && (
                <div className={styles.permissionsRow}>
                  <div className={styles.moduleName}>Loading roles...</div>
                  <div />
                </div>
              )}

              {!isLoading &&
                moduleNames.map((moduleName) => (
                  <div key={moduleName} className={styles.permissionsRow}>
                    <div className={styles.moduleName}>{moduleName}</div>

                    <label className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={Boolean(
                          isAdminRole && moduleName === "UserManagement"
                            ? true
                            : draftModules[moduleName],
                        )}
                        onChange={() => toggleModule(moduleName)}
                        aria-label={`Access permission for ${moduleName}`}
                        disabled={
                          (!selectedRole && !isNewRoleModalOpen) ||
                          (isAdminRole && moduleName === "UserManagement")
                        }
                      />
                      <span className={styles.checkboxVisual} />
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {(errorMessage || statusMessage) && (
          <p className={styles.helperText} role="status">
            {errorMessage || statusMessage}
          </p>
        )}

        <footer className={styles.actionsBar}>
          <Button
            variant="secondary"
            size="md"
            className={styles.discardButton}
            onClick={handleDiscard}
            disabled={
              isSaving ||
              isCreating ||
              (!isNewRoleModalOpen && !hasUnsavedChanges)
            }
          >
            {isNewRoleModalOpen ? "Cancel" : "Discard Changes"}
          </Button>

          <Button
            variant="primary"
            size="md"
            className={styles.saveButton}
            onClick={isNewRoleModalOpen ? handleCreateRole : handleSave}
            disabled={
              isSaving ||
              isCreating ||
              (isNewRoleModalOpen
                ? !newRoleName.trim() ||
                  getSelectedModules(draftModules).length === 0
                : !selectedRole || !hasUnsavedChanges)
            }
          >
            {isNewRoleModalOpen
              ? isCreating
                ? "Creating..."
                : "Save Role"
              : isSaving
                ? "Saving..."
                : "Save Role"}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default BodyContent;
