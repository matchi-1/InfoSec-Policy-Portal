import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/RoleManagement.module.css";
import Button from "../../../shared/components/Button";
import Dropdown from "../../../shared/components/Dropdown";
import { useConfirmationModal } from "../../../shared/components/useConfirmationModal";
import { useInformationModal } from "../../../shared/components/InformationModal";
import {
  moduleFileNames,
  moduleDisplayNames,
} from "../../../config/moduleConfig";

const createDefaultModuleState = (moduleNames = []) =>
  Object.fromEntries(moduleNames.map((name) => [name, name === "Home"]));

const withFixedModules = (
  moduleState,
  { lockUserManagement = false } = {},
) => ({
  ...moduleState,
  Home: true,
  ...(lockUserManagement ? { "User Management": true } : {}),
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

const toModuleState = (modules, moduleNames = []) => {
  const fromApi = new Set(Array.isArray(modules) ? modules : []);

  if (fromApi.has("All")) {
    return Object.fromEntries(moduleNames.map((name) => [name, true]));
  }

  return Object.fromEntries(
    moduleNames.map((name) => [name, fromApi.has(name)]),
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
  const [isPermissionEditMode, setIsPermissionEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const { askForConfirmation, confirmationModal } = useConfirmationModal();
  const { showInformation, informationModal } = useInformationModal();

  const roleNames = useMemo(() => roles.map((role) => role.roleName), [roles]);

  const selectedRoleMeta = useMemo(
    () => roles.find((role) => role.roleName === selectedRole),
    [roles, selectedRole],
  );

  const moduleNames = useMemo(() => Object.keys(moduleFileNames ?? {}), []);

  const moduleLabelsByName = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(moduleFileNames ?? {}).map((displayName) => [
          displayName,
          moduleDisplayNames[displayName] ?? displayName,
        ]),
      ),
    [],
  );

  const isAdminRole = selectedRoleMeta?.roleName === "Admin";
  const impactedUsers = selectedRoleMeta?.userCount ?? 0;
  const canEditPermissions = isPermissionEditMode || isNewRoleModalOpen;

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
          setSavedModules(createDefaultModuleState(moduleNames));
          setDraftModules(createDefaultModuleState(moduleNames));
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
  }, [backend_base_url, moduleNames]);

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
          toModuleState(roleDetail?.modules ?? [], moduleNames),
          {
            lockUserManagement:
              (roleDetail?.role_name ?? selectedRole) === "Admin",
          },
        );

        setSavedModules(nextModules);
        setDraftModules(nextModules);
        setIsPermissionEditMode(false);
      } catch (error) {
        setErrorMessage(error.message || "Unable to load role details");
      }
    };

    fetchRoleByName();
  }, [backend_base_url, moduleNames, selectedRole]);

  const hasUnsavedChanges = useMemo(() => {
    return moduleNames.some(
      (moduleName) => draftModules[moduleName] !== savedModules[moduleName],
    );
  }, [draftModules, moduleNames, savedModules]);

  const isUserManagementLocked = isAdminRole && !isNewRoleModalOpen;

  const handleRoleChange = (nextRole) => {
    setStatusMessage("");
    setIsPermissionEditMode(false);
    setSelectedRole(nextRole);
  };

  const handleStartCreateRole = () => {
    setStatusMessage("");
    setErrorMessage("");
    setIsPermissionEditMode(false);
    const createRoleModules = createDefaultModuleState(moduleNames);
    setDraftModules(createRoleModules);
    setNewRoleName("");
    setIsNewRoleModalOpen(true);
  };

  const handleCancelCreateRole = () => {
    setIsNewRoleModalOpen(false);
    setNewRoleName("");
    setStatusMessage("");
    setErrorMessage("");
    setDraftModules(savedModules);
    setIsPermissionEditMode(false);
  };

  const handleStartEditPermissions = () => {
    setStatusMessage("");
    setErrorMessage("");
    setDraftModules(savedModules);
    setIsPermissionEditMode(true);
  };

  const handleDiscardPermissions = () => {
    setDraftModules(savedModules);
    setStatusMessage("");
    setErrorMessage("");
    setIsPermissionEditMode(false);
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

      const toModules = modules;

      setSavedModules(nextModules);
      setDraftModules(nextModules);
      setStatusMessage("Role modules saved.");
      setIsPermissionEditMode(false);

      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.roleName === selectedRole ? { ...role, modules } : role,
        ),
      );

      showInformation({
        title: "Role modules saved",
        message: `Updated permissions for ${selectedRole}`,
        details: [
          {
            title: selectedRole,
            lines: toModules.length
              ? ["Permissions:", ...toModules.map((m) => `- ${m}`)]
              : ["None"],
          },
        ],
      });
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
      setIsPermissionEditMode(false);
      setStatusMessage("Role created successfully.");
      showInformation({
        title: "Role created",
        message: `Created role ${roleName}`,
        details: [
          {
            title: roleName,
            lines: modules.length
              ? ["Permissions:", ...modules.map((m) => `- ${m}`)]
              : ["None"],
          },
        ],
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to create role");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.rolemanagement}>
      <div className={styles.bodyContentContainer}>
        <header className={styles.headerSection}>
          <p className={styles.pageLabel}>System Administration</p>
          <h1>Role Management</h1>
          <p className={styles.pageDescription}>
            Configure role-based module access and manage permissions assigned
            to user roles.
          </p>
        </header>

        <section
          className={`${styles.workspaceShell} ${canEditPermissions ? styles.workspaceShellEditing : ""}`}
        >
          <div className={styles.workspaceToolbar}>
            <div className={styles.modeNotice}>
              <span
                className={`${styles.modeBadge} ${canEditPermissions ? styles.modeBadgeEditing : styles.modeBadgeReadonly}`}
              >
                {canEditPermissions ? "Editing" : "Read Only"}
              </span>
              <span className={styles.modeDescription}>
                {isNewRoleModalOpen
                  ? "Create a role, choose modules, then save the new configuration."
                  : canEditPermissions
                    ? `Editing permissions for ${selectedRole || "the selected role"}. Save when you are done.`
                    : "Select a role, then press Edit to unlock the table."}
              </span>
            </div>

            <div className={styles.actionsBar}>
              {!isNewRoleModalOpen && isPermissionEditMode && (
                <Button
                  variant="secondary"
                  size="md"
                  className={styles.discardButton}
                  onClick={() =>
                    askForConfirmation(
                      handleDiscardPermissions,
                      hasUnsavedChanges
                        ? "You have unsaved changes. Discarding would not save them."
                        : "Exit edit mode?",
                    )
                  }
                  disabled={isSaving || isCreating}
                >
                  Discard Changes
                </Button>
              )}

              <Button
                variant="primary"
                size="md"
                className={styles.saveButton}
                onClick={() => {
                  if (isNewRoleModalOpen) {
                    askForConfirmation(
                      handleCreateRole,
                      "Create this role with selected module access?",
                    );
                    return;
                  }

                  if (!isPermissionEditMode) {
                    handleStartEditPermissions();
                    return;
                  }

                  if (!hasUnsavedChanges) {
                    askForConfirmation(
                      handleDiscardPermissions,
                      "Exit edit mode?",
                    );
                    return;
                  }

                  askForConfirmation(handleSave, "Save role module changes?");
                }}
                disabled={
                  isSaving ||
                  isCreating ||
                  (!selectedRole && !isNewRoleModalOpen)
                }
              >
                {isNewRoleModalOpen
                  ? isCreating
                    ? "Creating..."
                    : "Save Role"
                  : isPermissionEditMode
                    ? isSaving
                      ? "Saving..."
                      : "Save Role"
                    : "Edit"}
              </Button>
            </div>
          </div>

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
                      canEditPermissions ? (
                        <>
                          Modifying permissions for the{" "}
                          <strong>{selectedRole}</strong> role. These changes
                          will propagate to {impactedUsers} active users.
                        </>
                      ) : (
                        <>
                          Viewing permissions for the{" "}
                          <strong>{selectedRole}</strong> role. Press Edit to
                          make changes. This role currently affects{" "}
                          {impactedUsers} active users.
                        </>
                      )
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
                      onClick={() =>
                        askForConfirmation(
                          handleCancelCreateRole,
                          "Cancel creating this new role? Unsaved selections will be lost.",
                        )
                      }
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
                    New roles use the selected module access from this
                    workspace. Choose modules on the right, then create the
                    role.
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
                      isUserManagementLocked &&
                      moduleName === "User Management";
                    const checked =
                      isHome ||
                      isForcedAdminUM ||
                      Boolean(draftModules[moduleName]);
                    const disabled =
                      (!selectedRole && !isNewRoleModalOpen) ||
                      !canEditPermissions ||
                      isForcedAdminUM ||
                      isHome;

                    return (
                      <div key={moduleName} className={styles.permissionsRow}>
                        <div className={styles.moduleName}>
                          {moduleLabelsByName[moduleName] ?? moduleName}
                        </div>

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
        </section>

        {(errorMessage || statusMessage) && (
          <p className={styles.helperText} role="status">
            {errorMessage || statusMessage}
          </p>
        )}

        {confirmationModal}
        {informationModal}
      </div>
    </div>
  );
};

export default BodyContent;
