import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/RoleManagement.module.css";
import Button from "../../../shared/components/Button";
import Dropdown from "../../../shared/components/Dropdown";
import { useConfirmationModal } from "../../../shared/components/ConfirmationModal";

const APP_MODULES = [
  "Home",
  "Documents",
  "Policies",
  "RecentNews",
  "Others",
  "UserManagement",
];

const createDefaultModuleState = () =>
  Object.fromEntries(APP_MODULES.map((name) => [name, name === "Home"]));

const withFixedModules = (
  moduleState,
  { lockUserManagement = false } = {},
) => ({
  ...moduleState,
  Home: true,
  ...(lockUserManagement ? { UserManagement: true } : {}),
});

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
  const [draftModules, setDraftModules] = useState(() =>
    createDefaultModuleState(),
  );
  const [savedModules, setSavedModules] = useState(() =>
    createDefaultModuleState(),
  );
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const { askForConfirmation, confirmationModal } = useConfirmationModal();

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
          setSavedModules(createDefaultModuleState());
          setDraftModules(createDefaultModuleState());
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
        const nextModules = withFixedModules(
          toModuleState(roleDetail?.modules ?? []),
          {
            lockUserManagement:
              (roleDetail?.role_name ?? selectedRole) === "Admin",
          },
        );

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

  const isUserManagementLocked = isAdminRole && !isNewRoleModalOpen;

  const handleRoleChange = (nextRole) => {
    setStatusMessage("");
    setSelectedRole(nextRole);
  };

  const handleStartCreateRole = () => {
    setStatusMessage("");
    setErrorMessage("");
    const createRoleModules = createDefaultModuleState();
    setDraftModules(createRoleModules);
    setSavedModules(createRoleModules);
    setNewRoleName("");
    setIsNewRoleModalOpen(true);
  };

  const handleCancelCreateRole = () => {
    setIsNewRoleModalOpen(false);
    setNewRoleName("");
    setStatusMessage("");
    setErrorMessage("");
    setDraftModules(savedModules);
  };

  // Precompute stable toggle handlers so we don't create a new lambda per render
  const toggleHandlers = useMemo(() => {
    const map = {};
    moduleNames.forEach((name) => {
      map[name] = () =>
        setDraftModules((current) => ({ ...current, [name]: !current[name] }));
    });
    return map;
  }, [moduleNames, setDraftModules]);

  const handleDiscard = () => {
    if (isNewRoleModalOpen) {
      handleCancelCreateRole();
      return;
    }

    setDraftModules(savedModules);
  };

  const handleSave = async () => {
    if (!selectedRole) {
      return;
    }

    const modules = getSelectedModules(
      withFixedModules(draftModules, {
        lockUserManagement: isUserManagementLocked,
      }),
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

      const nextModules = withFixedModules(draftModules, {
        lockUserManagement: isUserManagementLocked,
      });

      setSavedModules(nextModules);
      setDraftModules(nextModules);
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
      withFixedModules(draftModules, {
        lockUserManagement: isUserManagementLocked,
      }),
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
                moduleNames.map((moduleName) => {
                  const isHome = moduleName === "Home";
                  const isForcedAdminUM =
                    isUserManagementLocked && moduleName === "UserManagement";
                  const checked =
                    isHome ||
                    isForcedAdminUM ||
                    Boolean(draftModules[moduleName]);
                  const disabled =
                    (!selectedRole && !isNewRoleModalOpen) ||
                    isForcedAdminUM ||
                    isHome;

                  return (
                    <div key={moduleName} className={styles.permissionsRow}>
                      <div className={styles.moduleName}>{moduleName}</div>

                      <label className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={toggleHandlers[moduleName]}
                          aria-label={`Access permission for ${moduleName}`}
                          disabled={disabled}
                        />
                        <span className={styles.checkboxVisual} />
                      </label>
                    </div>
                  );
                })}
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
            onClick={() =>
              askForConfirmation(
                isNewRoleModalOpen ? handleCreateRole : handleSave,
                isNewRoleModalOpen
                  ? "Create this role with selected module access?"
                  : "Save role module changes?",
              )
            }
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

        {confirmationModal}
      </div>
    </div>
  );
};

export default BodyContent;
