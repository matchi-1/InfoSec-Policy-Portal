import React, { useMemo, useState, useEffect } from "react";
import styles from "./styles/UserManagement.module.css";
import Button from "../../shared/components/Button";
import Dropdown from "../../shared/components/Dropdown";

const AVATAR_COLORS = [
  "#d7e2ff",
  "#dcd8ff",
  "#d6e1f7",
  "#d8e4ef",
  "#dbe8d2",
  "#f2dfd7",
];

const formatUserCount = (count, total) => `Showing ${count} of ${total.toLocaleString()} total users`;

const getInitials = (firstName, lastName, email) => {
  const firstInitial = firstName?.trim()?.[0] ?? "";
  const lastInitial = lastName?.trim()?.[0] ?? "";
  const fallbackInitial = email?.trim()?.[0] ?? "U";
  return (
    `${firstInitial}${lastInitial}`.toUpperCase() ||
    fallbackInitial.toUpperCase()
  );
};

const getAvatarColor = (userId) => {
  const digits = String(userId ?? "")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[digits % AVATAR_COLORS.length];
};

const getRoleName = (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return "Unassigned";
  }

  const firstRole = roles[0];
  return (
    firstRole?.role_name ?? firstRole?.name ?? firstRole?.role ?? "Unassigned"
  );
};

const normalizeUser = (user) => {
  const userId = String(user.user_id ?? "");
  const firstName = user.first_name ?? "";
  const lastName = user.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";

  return {
    userId,
    name: fullName,
    email: user.email ?? "",
    initials: getInitials(firstName, lastName, user.email),
    avatarColor: getAvatarColor(userId),
    role: getRoleName(user.roles),
  };
};

const buildPageItems = (currentPage, totalPages) => {
  if (totalPages <= 1) {
    return [1];
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);
  const normalizedPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items = [];
  normalizedPages.forEach((page, index) => {
    const previousPage = normalizedPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push("...");
    }
    items.push(page);
  });

  return items;
};

const BodyContent = () => {
  const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [roleOptions, setRoleOptions] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [draftRoles, setDraftRoles] = useState({});
  const [committedRoles, setCommittedRoles] = useState({});

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const resp = await fetch(`${backend_base_url}/roles/`);
        if (!resp.ok) {
          throw new Error(`Failed to fetch roles (${resp.status})`);
        }

        const payload = await resp.json();
        const rawRoles = Array.isArray(payload)
          ? payload
          : (payload.data ?? []);
        const nextRoleOptions = rawRoles.map((role) => ({
          label: role.role_name,
          value: role.role_name,
        }));

        setRoleOptions(nextRoleOptions);
      } catch (error) {
        setErrorMessage(error.message || "Unable to load roles");
      }
    };

    fetchAllRoles();
  }, [backend_base_url]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoadingUsers(true);
      setErrorMessage("");

      try {
        const resp = await fetch(
          `${backend_base_url}/users/?page=${currentPage}`,
        );
        if (!resp.ok) {
          throw new Error(`Failed to fetch users (${resp.status})`);
        }

        const payload = await resp.json();
        const rawUsers = Array.isArray(payload)
          ? payload
          : (payload.data ?? []);
        const normalizedUsers = rawUsers.map(normalizeUser);
        const nextTotalPages =
          Number(payload.total_pages ?? payload.num_pages ?? 1) || 1;
        const nextTotalUsers =
          Number(
            payload.total_users ?? payload.count ?? normalizedUsers.length,
          ) || normalizedUsers.length;

        setUsers(normalizedUsers);
        setTotalPages(nextTotalPages);
        setTotalUsers(nextTotalUsers);

        const roleMap = Object.fromEntries(
          normalizedUsers.map((user) => [user.userId, user.role]),
        );

        setDraftRoles((current) => ({ ...current, ...roleMap }));
        setCommittedRoles((current) => ({ ...current, ...roleMap }));
      } catch (error) {
        setErrorMessage(error.message || "Unable to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchAllUsers();
  }, [backend_base_url, currentPage]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      if (!normalizedSearch) {
        return true;
      }

      const currentRole = draftRoles[user.userId] ?? user.role;

      return (
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        currentRole.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [draftRoles, searchTerm, users]);

  const hasUnsavedChanges = useMemo(
    () =>
      users.some(
        (user) => draftRoles[user.userId] !== committedRoles[user.userId],
      ),
    [committedRoles, draftRoles, users],
  );

  const paginationItems = useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const handleRoleChange = (userId, nextRole) => {
    setDraftRoles((currentRoles) => ({
      ...currentRoles,
      [userId]: nextRole,
    }));
  };

  const handleSaveChanges = async () => {
    const updates = users
      .filter((user) => draftRoles[user.userId] !== committedRoles[user.userId])
      .map((user) => ({
        user_id: user.userId,
        role: draftRoles[user.userId],
      }))
      .filter((update) => Boolean(update.role));

    if (!updates.length) {
      return;
    }

    setIsSavingChanges(true);
    setErrorMessage("");

    try {
      const resp = await fetch(`${backend_base_url}/users/roles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to update roles (${resp.status})`);
      }

      setCommittedRoles((currentRoles) => {
        const nextRoles = { ...currentRoles };
        updates.forEach((update) => {
          nextRoles[update.user_id] = update.role;
        });
        return nextRoles;
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to save role changes");
    } finally {
      setIsSavingChanges(false);
    }
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
          </div>

          <div className={styles.tableBody}>
            {isLoadingUsers && (
              <div className={styles.tableRow} role="row">
                <div className={styles.userCell} role="cell">
                  <div className={styles.userInfo}>
                    <strong>Loading users...</strong>
                  </div>
                </div>
              </div>
            )}

            {!isLoadingUsers && filteredUsers.length === 0 && (
              <div className={styles.tableRow} role="row">
                <div className={styles.userCell} role="cell">
                  <div className={styles.userInfo}>
                    <strong>No users found</strong>
                    <span>Try changing your search or page.</span>
                  </div>
                </div>
              </div>
            )}

            {!isLoadingUsers &&
              filteredUsers.map((user) => (
                <div className={styles.tableRow} role="row" key={user.userId}>
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
                      value={draftRoles[user.userId] ?? user.role}
                      options={roleOptions}
                      onChange={(nextRole) =>
                        handleRoleChange(user.userId, nextRole)
                      }
                      ariaLabel={`Access level for ${user.name}`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>

        <footer className={styles.footerBar}>
          <p className={styles.footerMeta}>
            {formatUserCount(filteredUsers.length, totalUsers)}
          </p>

          <div className={styles.pagination} aria-label="Pagination">
            <button
              type="button"
              className={styles.paginationControl}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage <= 1 || isLoadingUsers}
            >
              Previous
            </button>

            {paginationItems.map((item, index) =>
              item === "..." ? (
                <span key={`dots-${index}`} className={styles.paginationDots}>
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`${styles.paginationPage} ${
                    item === currentPage ? styles.paginationActive : ""
                  }`}
                  onClick={() => setCurrentPage(item)}
                  disabled={isLoadingUsers}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className={styles.paginationControl}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage >= totalPages || isLoadingUsers}
            >
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
              {errorMessage
                ? errorMessage
                : hasUnsavedChanges
                  ? "Unsaved changes detected"
                  : "All changes saved"}
            </span>
            <Button
              className={styles.saveButton}
              variant="primary"
              size="lg"
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges || isSavingChanges}
            >
              {isSavingChanges ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
