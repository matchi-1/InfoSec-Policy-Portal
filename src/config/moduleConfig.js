// Add new modules/submodules here.
export const MODULES = {
  Home: { file: "Home", label: "Home", submodules: {} },
  "View Documents": {
    file: "ViewDocuments",
    label: "View Documents",
    submodules: {},
  },
  "Recent News": { file: "RecentNews", label: "Recent News", submodules: {} },
  "Create Edit Documents": {
    file: "CreateEditDocuments",
    label: "Create/Edit Documents",
    submodules: {},
  },
  "Edit Home/News": {
    file: "EditHomeNews",
    label: "Edit Home/News",
    submodules: {},
  },
  "User Management": {
    file: "UserManagement",
    label: "User Management",
    submodules: {
      "Role Management": { file: "RoleManagement", label: "Role Management" },
    },
  },
};

// Derived, backward-compatible exports
export const moduleFileNames = Object.fromEntries(
  Object.entries(MODULES).map(([name, def]) => [name, def.file]),
);

export const moduleSubmoduleFileNames = Object.fromEntries(
  Object.entries(MODULES).map(([name, def]) => [
    name,
    Object.fromEntries(
      Object.entries(def.submodules || {}).map(([subName, subDef]) => [
        subName,
        subDef.file,
      ]),
    ),
  ]),
);

export const moduleDisplayNames = Object.fromEntries(
  Object.entries(MODULES).map(([name, def]) => [name, def.label ?? name]),
);

export const sidebarModuleGroups = [
  {
    id: "client-divider",
    label: "Client Modules",
    modules: ["Home", "View Documents", "Recent News"],
  },
  {
    id: "admin-divider",
    label: "Admin Modules",
    modules: ["Create Edit Documents", "Edit Home/News", "User Management"],
  },
];

export const getModuleDisplayName = (moduleId) =>
  moduleDisplayNames[moduleId] ?? moduleId;
