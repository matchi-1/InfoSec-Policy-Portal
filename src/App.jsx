import { useState, useRef, Suspense, lazy, useEffect } from "react";
import "./App.css";
import "./MediaQueries.css";
//import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./shared/components/UserProfile";
import { Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User } from "lucide-react";
import ConfirmationModal from "./shared/components/ConfirmationModal";
import LandingPage from "./pages/LandingPage";
import {
  moduleFileNames,
  moduleSubmoduleFileNames,
  getModuleDisplayName,
  sidebarModuleGroups,
} from "./config/moduleConfig";

function App() {
  const backend_base_url = import.meta.env.VITE_BACKEND_API_BASE;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompactSidebar, setIsCompactSidebar] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubModule, setActiveSubModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoveredSubModule, setHoveredSubModule] = useState(null);
  const [ModuleComponent, setModuleComponent] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMainModuleCollapsed, setIsMainModuleCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [notifToast, setNotifToast] = useState(null);
  const notifToastTimerRef = useRef(null);
  const lastNotifToastAtRef = useRef(
    localStorage.getItem("last_notif_toast_at") || "",
  );
  const lastShownNotifToastKeyRef = useRef(
    localStorage.getItem("last_shown_notif_toast_key"),
  );
  const [hasUnsavedModuleChanges, setHasUnsavedModuleChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const displayName = user
    ? `${user.first_name} ${user.last_name?.charAt(0)}.`
    : "";

  const iconsRef = useRef(null);
  const descsRef = useRef(null);

  // DEV ONLY: Disabled until backend role-permission endpoint is fixed
  useEffect(() => {
    // Permissions Access
    if (!user?.role?.role_name) return;

    const fetchRolePermissions = async () => {
      try {
        const resp = await fetch(
          `${backend_base_url}/roles/${encodeURIComponent(
            user.role.role_name,
          )}/permissions/`,
          { credentials: "include" },
        );

        if (!resp.ok) {
          console.warn("roles permissions fetch failed", resp.status);
          return;
        }

        const payload = await resp.json();
        const data = payload?.data ?? payload ?? {};
        const perms = Array.isArray(data) ? data : (data?.modules ?? []);
        setRolePermissions(perms);
        console.log(perms);
      } catch (err) {
        console.error("fetchRolePermissions error:", err);
      }
    };

    fetchRolePermissions();
  }, [user]);

  // landing page
  const [showLanding, setShowLanding] = useState(true);

  // log out at time out
  useEffect(() => {
    let logoutTimeout;

    const resetTimeout = () => {
      if (logoutTimeout) clearTimeout(logoutTimeout);
      logoutTimeout = setTimeout(
        () => {
          handleLogout();
        },
        30 * 60 * 1000,
      ); // 30 minutes
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimeout),
    );

    resetTimeout();

    return () => {
      clearTimeout(logoutTimeout);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimeout),
      );
    };
  }, []);

  useEffect(() => {
    if (activeModule || activeSubModule || showUserProfile) {
      setShowLanding(false);
      localStorage.setItem("activeModule", activeModule);
      localStorage.setItem("activeSubModule", activeSubModule);
      localStorage.setItem("showUserProfile", JSON.stringify(showUserProfile));
    }
  }, [activeModule, activeSubModule, showUserProfile]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));

      const storedModule = localStorage.getItem("activeModule");
      const storedSubModule = localStorage.getItem("activeSubModule");
      const storedShowUserProfile = localStorage.getItem("showUserProfile");

      if (storedShowUserProfile === "true") {
        setShowUserProfile(true);
        setActiveModule(null);
        setActiveSubModule(null);
      } else if (storedModule) {
        setActiveModule(storedModule);
        if (storedSubModule && storedSubModule !== "null")
          setActiveSubModule(storedSubModule);
      }
    } else {
      
      navigate("/login", { replace: true });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear saved session
    localStorage.removeItem("activeModule");
    localStorage.removeItem("activeSubModule");
    localStorage.removeItem("showUserProfile");
    setUser(null); // clear local user state
    navigate("/login"); // redirect to login
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setNotifOpen(false); // close notification menu if profile menu is opened
  };

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handleClickOutsideProfileDropdown = (e) => {
      if (
        !e.target.closest(".header-profile-container") &&
        !e.target.closest(".profile-dropdown")
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutsideProfileDropdown);
    return () => {
      document.removeEventListener("click", handleClickOutsideProfileDropdown);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    if (!notifOpen) return;

    const handleClickOutsideNotif = (e) => {
      if (
        !e.target.closest(".notif-icon") &&
        !e.target.closest(".notif-menu")
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutsideNotif);
    return () => {
      document.removeEventListener("click", handleClickOutsideNotif);
    };
  }, [notifOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const handleResize = () => {
      setIsCompactSidebar(mediaQuery.matches);

      // On smaller screens, default to content-only + hamburger
      if (mediaQuery.matches) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const getNotifToastKey = (notif) => {
    return String(
      notif?.id ||
      notif?.notification_id ||
      notif?.created_at ||
      "",
    );
  };


  const showNotifToast = (notif) => {
    if (!notif) return;

    const notifToastKey = getNotifToastKey(notif);

    // Prevent showing the same notification toast repeatedly on every poll
    if (!notifToastKey || lastShownNotifToastKeyRef.current === notifToastKey) {
      return;
    }

    lastShownNotifToastKeyRef.current = notifToastKey;
    localStorage.setItem("last_shown_notif_toast_key", notifToastKey);

    setNotifToast({
      id: notif.id,
      message: getNotificationMessage(notif),
    });

    if (notifToastTimerRef.current) {
      clearTimeout(notifToastTimerRef.current);
    }

    notifToastTimerRef.current = setTimeout(() => {
      setNotifToast(null);
    }, 3500);
  };


  const getNotificationActionLabel = (notif) => {
    const action = String(notif.action || "").toLowerCase();

    if (
      action.includes("pin") ||
      action.includes("announcement") ||
      action.includes("notice")
    ) {
      return "posted an announcement";
    }

    if (
      action.includes("edit") ||
      action.includes("update") ||
      action.includes("modified")
    ) {
      return "updated a document";
    }

    if (
      action.includes("upload") ||
      action.includes("create") ||
      action.includes("new")
    ) {
      return "uploaded a document";
    }

    return notif.action || "made an update";
  };

  const getNotificationVariantClass = (notif) => {
    const action = String(notif.action || "").toLowerCase();

    if (
      action.includes("pin") ||
      action.includes("announcement") ||
      action.includes("notice")
    ) {
      return "notif-pill-announcement";
    }

    if (
      action.includes("upload") ||
      action.includes("create") ||
      action.includes("new")
    ) {
      return "notif-pill-upload";
    }

    if (
      action.includes("edit") ||
      action.includes("update") ||
      action.includes("modified")
    ) {
      return "notif-pill-update";
    }

    return "notif-pill-system";
  };

  // fetch notifs
  const fetchNotifs = async (user) => {
    try {
      console.log("Fetching notifs...");

      const resp = await fetch(`${backend_base_url}/api/notifications/`, {
        method: "GET",
      });

      if (!resp.ok) {
        console.warn("Notifications fetch failed:", resp.status);
        return;
      }

      const notif_items = await resp.json();

      console.log("Notifs fetched:");
      console.log(notif_items);

      setNotifs(notif_items);

      const latestNotif = [...notif_items].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      )[0];

      const lastNotifOpen = localStorage.getItem("last_notif_open");
      const latestNotifOpenTime = lastNotifOpen
        ? new Date(lastNotifOpen).getTime()
        : 0;

      const hasUnreadNotif = notif_items.some((notif) => {
        const notifTime = new Date(notif.created_at).getTime();
        return notifTime > latestNotifOpenTime;
      });

      setHasNotification(hasUnreadNotif);

      const lastToastTime = lastNotifToastAtRef.current
        ? new Date(lastNotifToastAtRef.current).getTime()
        : 0;

      const latestNotifTime = latestNotif?.created_at
        ? new Date(latestNotif.created_at).getTime()
        : 0;

      // Show toast only if this latest notification has never triggered a toast before
      if (
        hasUnreadNotif &&
        latestNotif &&
        latestNotifTime > lastToastTime
      ) {
        showNotifToast(latestNotif);

        lastNotifToastAtRef.current = latestNotif.created_at;
        localStorage.setItem("last_notif_toast_at", latestNotif.created_at);
      }
    } catch (error) {
      console.error("fetchNotifs error:", error);
    }
  };


  //get notifs
  useEffect(() => {
    if (!user) return;
    //first fetch on pageload
    fetchNotifs(user);

    //fetching every 30s
    const interval = setInterval(() => {
      fetchNotifs(user);
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);


  const getNotificationActorLabel = (notif) => {
    const currentUserId = user?.user_id || user?.id || user?.employee_id;
    const notifActorId = notif.actor || notif.actor_id;

    if (currentUserId && notifActorId && String(notifActorId) === String(currentUserId)) {
      return "You";
    }

    return notif.actor_name || notif.actor_full_name || "System";
  };

  const getNotificationTarget = (notif) => {
    return notif.misc_title || notif.document_title || "an item";
  };

  const getNotificationMessage = (notif) => {
    const actor = getNotificationActorLabel(notif);
    const action = notif.action || "updated";
    const target = getNotificationTarget(notif);

    return `${actor} ${action} ${target}`;
  };

  const getNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // hooks for loading modules
  useEffect(() => {
    if (activeModule) {
      loadMainModule(activeModule);
    }
  }, [activeModule]);

  useEffect(() => {
    if (activeSubModule) {
      loadSubModule(activeSubModule);
    } else if (activeModule) {
      loadMainModule(activeModule);
    }
  }, [activeSubModule, activeModule]);

  // sync Scroll
  const queryClient = new QueryClient();
  // sync Scroll
  const handleScroll = (source) => {
    if (!iconsRef.current || !descsRef.current) return;

    if (source === "icons") {
      descsRef.current.scrollTop = iconsRef.current.scrollTop;
    } else {
      iconsRef.current.scrollTop = descsRef.current.scrollTop;
    }
  };

  const mainModules = import.meta.glob("./modules/*/*.jsx");
  const subModules = import.meta.glob("./modules/*/submodules/*.jsx");

  const loadSubModule = (submoduleId, mainModule = activeModule) => {
    const submoduleFile = `./modules/${moduleFileNames[mainModule]}/submodules/${moduleSubmoduleFileNames[mainModule][submoduleId]}.jsx`;

    if (subModules[submoduleFile]) {
      const LazyComponent = lazy(subModules[submoduleFile]);

      const WrappedComponent = () => (
        <LazyComponent
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          moduleFileNames={moduleFileNames}
          user_id={user?.user_id}
          employee_id={user?.employee_id}
          setHasUnsavedModuleChanges={setHasUnsavedModuleChanges}
        />
      );

      setModuleComponent(() => WrappedComponent);
      setShowUserProfile(false);
    } else {
      console.warn(`Submodule file not found: ${submoduleFile}`);
    }
  };

  const loadMainModule = (moduleId) => {
    if (!moduleId || !moduleFileNames[moduleId]) {
      return;
    }

    const moduleFile = `./modules/${moduleFileNames[moduleId]}/${moduleFileNames[moduleId]}.jsx`;

    if (mainModules[moduleFile]) {
      const LazyComponent = lazy(mainModules[moduleFile]);

      const WrappedComponent = () => (
        <LazyComponent
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          moduleFileNames={moduleFileNames}
          user_id={user?.user_id}
          employee_id={user?.employee_id}
          setHasUnsavedModuleChanges={setHasUnsavedModuleChanges}
        />
      );

      setModuleComponent(() => WrappedComponent);
      setShowUserProfile(false);
    } else {
      console.warn(`Module file not found: ${moduleFile}`);
    }
  };



  const requestNavigation = (navigation) => {
    if (hasUnsavedModuleChanges) {
      setPendingNavigation(navigation);
      return;
    }

    navigation.run();
  };

  const performMainModuleClick = (moduleId) => {
    setIsSidebarOpen(true);

    if (activeModule === moduleId) {
      if (activeSubModule) {
        setActiveSubModule(null);
        loadMainModule(moduleId);
        setIsMainModuleCollapsed(true);
      } else {
        isMainModuleCollapsed
          ? setIsMainModuleCollapsed(false)
          : setIsMainModuleCollapsed(true);

        setActiveSubModule(null);
      }
    } else {
      setIsMainModuleCollapsed(true);
      setActiveModule(moduleId);
      setActiveSubModule(null);
      loadMainModule(moduleId);
    }

    if (isCompactSidebar) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  const handleMainModuleClick = (moduleId) => {
    const willUnloadCurrentView =
      moduleId !== activeModule || Boolean(activeSubModule);

    if (!willUnloadCurrentView) {
      performMainModuleClick(moduleId);
      return;
    }

    requestNavigation({
      type: "main",
      label: getModuleDisplayName(moduleId),
      run: () => performMainModuleClick(moduleId),
    });
  };

  const performSubModuleClick = (submodule) => {
    setActiveSubModule(submodule);

    if (isCompactSidebar) {
      setIsSidebarOpen(false);
    }
  };

  const handleSubModuleClick = (submodule) => {
    if (submodule === activeSubModule) {
      return;
    }

    requestNavigation({
      type: "sub",
      label: submodule,
      run: () => performSubModuleClick(submodule),
    });
  };

  const handleConfirmNavigation = () => {
    if (!pendingNavigation) return;

    const navigationToRun = pendingNavigation;

    setPendingNavigation(null);
    setHasUnsavedModuleChanges(false);

    navigationToRun.run();
  };

  const handleCancelNavigation = () => {
    setPendingNavigation(null);
  };

  // DEV ONLY: Show all modules while backend permissions are not yet ready
  // const filteredModuleFileNames = moduleSubmoduleFileNames; // delete this and uncomment below once perms are ready

  // DEV ONLY: UNCOMMENT THIS!! once permissions are ready, filter modules based on perms
  const [filteredModuleFileNames, setFilteredModules] = useState({});
  useEffect(() => {
    const allowedModules = Array.isArray(rolePermissions)
      ? rolePermissions
        .flatMap((perm) => (typeof perm === "string" ? perm.split(",") : []))
        .map((m) => m.trim())
        .filter(Boolean)
      : [];

    const normalizeName = (s) =>
      String(s ?? "")
        .replace(/\s+/g, "")
        .toLowerCase();
    const normalizedAllowed = new Set(
      allowedModules.map((a) => normalizeName(a)),
    );
    const isAll = normalizedAllowed.has(normalizeName("All"));
    const filteredModules = {};

    if (isAll) {
      // allow everything (all modules + all submodules)
      setFilteredModules(structuredClone(moduleSubmoduleFileNames));
      return;
    } else {
      // First, include any whole-main-module permissions that match (case/space-insensitive)
      Object.keys(moduleFileNames).forEach((mainKey) => {
        if (normalizedAllowed.has(normalizeName(mainKey))) {
          filteredModules[mainKey] = {
            ...moduleSubmoduleFileNames[mainKey],
          };
        }
      });

      // Then, process explicit perms that may include submodules like "Policies/PolicySections"
      allowedModules.forEach((permission) => {
        const [mainRaw, subRaw] = permission.split(/\/(.*)/s);
        const mainKey = Object.keys(moduleSubmoduleFileNames).find(
          (k) => normalizeName(k) === normalizeName(mainRaw),
        );
        if (!mainKey) return; // ignore unknown perms safely

        if (!filteredModules[mainKey]) filteredModules[mainKey] = {};

        if (!subRaw) {
          // allow all submodules under this main module
          filteredModules[mainKey] = {
            ...moduleSubmoduleFileNames[mainKey],
          };
        } else {
          const subKey = Object.keys(moduleSubmoduleFileNames[mainKey]).find(
            (sk) => normalizeName(sk) === normalizeName(subRaw),
          );
          if (subKey) {
            filteredModules[mainKey][subKey] =
              moduleSubmoduleFileNames[mainKey][subKey];
          }
        }
      });
    }

    setFilteredModules(filteredModules);
  }, [rolePermissions]);

  // DEV ONLY: Uncomment this if you want that all modules are just shown, and there is no distinction between admin and clients
  // const modulesIcons = Object.keys(filteredModuleFileNames).map((module) => ({
  //   id: module,
  //   file: `${moduleFileNames[module]}.png`,
  // }));

  const modulesIcons = sidebarModuleGroups.flatMap((group) => {
    const visibleModules = group.modules.filter(
      (moduleId) => filteredModuleFileNames[moduleId],
    );

    if (visibleModules.length === 0) {
      return [];
    }

    return [
      { type: "divider", id: group.id, label: group.label },
      ...visibleModules.map((moduleId) => ({
        type: "module",
        id: moduleId,
        file: `${moduleFileNames[moduleId]}.png`,
      })),
    ];
  });

  return (
    <div className="shell">
      <div className={`shell-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* collapsible menu */}

        {/* static left navi -- icons */}
        <div className="sidebar-icons-container">
          <div className="sidebar-icons-hamburger-container">
            <div
              className="sidebar-icons-ham-icon-wrapper"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <div className={`ham-menu-icon ${isSidebarOpen ? "active" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div className="sidebar-main-menu-container"></div>

          <div
            className={`sidebar-module-icons ${isSidebarOpen ? "opened" : ""}`}
            ref={iconsRef}
            onScroll={() => handleScroll("icons")}
          >
            {modulesIcons.map((module) => {
              if (module.type === "divider") {
                return (
                  <div key={module.id} className="sidebar-divider-icon">
                    <span>{module.label}</span>
                  </div>
                );
              }

              return (
                <div key={module.id}>
                  {/* Main Module Icons */}
                  <div
                    className={`sidebar-module-icons-item 
    ${isSidebarOpen ? "opened" : ""} 
    ${activeModule === module.id ? "active" : ""} 
    ${hoveredModule === module.id ? "hovered" : ""}`}
                    onClick={() => handleMainModuleClick(module.id)}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <img
                      src={
                        activeModule === module.id
                          ? `/icons/module-icons-selected/${module.file}`
                          : `/icons/module-icons/${module.file}`
                      }
                      alt={module.id}
                    />
                  </div>

                  <div
                    className={`sidebar-submodule-empty-container ${
                      isMainModuleCollapsed &&
                      isSidebarOpen &&
                      activeModule === module.id
                        ? "opened"
                        : ""
                    }`}
                  >
                    {/* submodules - only show if this module is active */}
                    {filteredModuleFileNames[module.id] &&
                      Object.keys(filteredModuleFileNames[module.id]).map(
                        (submodule, index) => (
                          <div
                            key={index}
                            className="sidebar-submodule-item-empty"
                          >
                            <p></p>
                          </div>
                        ),
                      )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sidebar-infosec-footer">
            <img
              src={"public/icons/InfoSecLogo.png"}
              alt={"InfoSec Logo"}
            ></img>
          </div>
        </div>

        {/* collapsible description navi */}
        <div
          className={`sidebar-desc-container ${isSidebarOpen ? "" : "closed"}`}
        >
          <div className="sidebar-icons-hamburger-container"></div>
          <div className="sidebar-main-menu-container"></div>

          <div
            className="sidebar-module-descs"
            ref={descsRef}
            onScroll={() => handleScroll("descs")}
          >
            {modulesIcons.map((module) => {
              if (module.type === "divider") {
                return (
                  <div key={module.id} className="sidebar-divider-desc">
                    <span>{module.label}</span>
                  </div>
                );
              }

              return (
                <div key={module.id}>
                  {/* Main Module Items */}
                  <div
                    className={`sidebar-module-desc-item 
                            ${activeModule === module.id ? "active" : ""} 
                            ${hoveredModule === module.id ? "hovered" : ""}`}
                    onClick={() => handleMainModuleClick(module.id)}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <p>{getModuleDisplayName(module.id)}</p>
                  </div>

                  <div
                    className={`sidebar-submodule-empty-container ${
                      isMainModuleCollapsed &&
                      isSidebarOpen &&
                      activeModule === module.id
                        ? "opened"
                        : ""
                    }`}
                  >
                    {/* Submodules - only show if the main module is active */}
                    {filteredModuleFileNames[module.id] &&
                      Object.keys(filteredModuleFileNames[module.id]).map(
                        (sub, index) => (
                          <div
                            key={index}
                            className={`sidebar-submodule-item
                            ${activeSubModule === sub ? "active" : ""} 
                            ${hoveredSubModule === sub ? "hovered" : ""}`}
                            onClick={() => handleSubModuleClick(sub)}
                            onMouseEnter={() => setHoveredSubModule(sub)}
                            onMouseLeave={() => setHoveredSubModule(null)}
                          >
                            <p>{sub}</p>
                          </div>
                        ),
                      )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sidebar-infosec-footer-desc">
            <p>InfoSec Department</p>
          </div>
        </div>

        {/* adjustable right content */}
        <div className="header-body-container">
          <div className={`header-navi ${isSidebarOpen ? "squished" : ""}`}>
            <div
              className={`header-tabs-container ${
                !showUserProfile && activeModule ? "visible" : "hidden"
              }`}
            >
              <img
                src={`/icons/header-module-icons/${moduleFileNames[activeModule]}.png`}
                alt={getModuleDisplayName(activeModule)}
              />
              <div className="header-module-names">
                <p
                  className={`header-module-name ${!activeSubModule ? "active" : "inactive"}`}
                  onClick={() => {
                    setActiveModule(activeModule);
                    //loadMainModule(activeModule);
                    setActiveSubModule(null);
                    //loadSubModule(null);
                  }}
                >
                  {getModuleDisplayName(activeModule)}
                </p>
                <p className="fade-in">{activeSubModule ? ` > ` : ""}</p>
                <p id="header-submodule-name" className="fade-in">
                  {activeSubModule ? activeSubModule : ""}
                </p>
              </div>
            </div>

            <div className="header-right-container">
              {/*<SearchBar />*/}
              <img
                className="notif-icon"
                src={`/icons/Notification-${
                  hasNotification ? "active-" : ""
                }logo.png`}
                alt="Notificaton-Logo"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setIsProfileMenuOpen(false);
                  setHasNotification(false);
                  setNotifToast(null);

                  if (notifToastTimerRef.current) {
                    clearTimeout(notifToastTimerRef.current);
                  }

                  localStorage.setItem(
                    "last_notif_open",
                    new Date().toISOString(),
                  );
                }} //to be replaecd by func for setting notifs as read
              ></img>
              {notifToast && !notifOpen && (
                <div className="notif-toast">
                  <div className="notif-toast-dot"></div>

                  <div className="notif-toast-content">
                    <p className="notif-toast-label">New notification</p>
                    <p className="notif-toast-message">{notifToast.message}</p>
                  </div>
                </div>
              )}
              {notifOpen && (
                <div className="notif-menu">
                  <div className="notif-title">
                    <p>Notifications</p>
                  </div>
                  {notifs.length === 0 ? (
                    <div className="notif-empty">
                      <p className="notif-msg">No notifications to show.</p>
                    </div>
                  ) : (
                    notifs.map((notif, i) => (
                      <div
                        // className={
                        //   notif.read ? "notif-item" : "notif-item-unread"
                        // }
                        className="notif-item"
                        // onClick={
                        //   notif.orig_submodule
                        //     ? () => {
                        //         notifs[i].read = true;
                        //         readNotif(notif.id);
                        //         setActiveModule(notif.orig_module);
                        //         setActiveSubModule(notif.orig_submodule);
                        //       }
                        //     : () => {
                        //         notifs[i].read = true;
                        //         readNotif(notif.id);
                        //         setActiveModule(notif.orig_module);
                        //         setActiveSubModule(null);
                        //       }
                        // }
                        key={i}
                      >
                        <div className="notif-msg">
                          <p className="notif-message-line">
                            <span className="notif-actor-name">
                              {getNotificationActorLabel(notif)}
                            </span>{" "}
                            {getNotificationActionLabel(notif)}
                          </p>

                          <span
                            className={`notif-title-pill ${getNotificationVariantClass(notif)}`}
                          >
                            {getNotificationTarget(notif)}
                          </span>
                        </div>

                        <div className="notif-time">
                          <p>{getNotificationTime(notif.created_at)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-name">
                      {user?.first_name} {user?.last_name}
                    </div>
                    {/* <div className="profile-details">
                      ID: {user?.employee_id}
                    </div> */}
                    <div className="profile-details">
                      {user?.role?.role_name}
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={handleLogout}>
                      <img src="/icons/logout.png" /> Logout
                    </div>
                  </div>
                </div>
              )}

              <div className="header-profile-container">
                <div
                  className={`header-profile-icon-wrapper ${isProfileMenuOpen ? "opened" : ""}`}
                  onClick={toggleProfileMenu}
                >
                  <div className="header-profile-icon">
                    {" "}
                    {displayName?.charAt(0)}
                  </div>
                  <p className="header-profile-name">{displayName}</p>
                </div>
              </div>
            </div>
          </div>
          <QueryClientProvider client={queryClient}>
            <div className="body-container">
              {showLanding && <LandingPage />}
              {showUserProfile ? (
                <UserProfile
                  user_id={user?.user_id}
                  employee_id={user?.employee_id}
                />
              ) : (
                ModuleComponent && (
                  <Suspense
                    fallback={
                      <div className="loading-suspense">Loading...</div>
                    }
                  >
                    <ModuleComponent />
                  </Suspense>
                )
              )}
            </div>
          </QueryClientProvider>
        </div>
      </div>
      <ConfirmationModal
        isOpen={Boolean(pendingNavigation)}
        message={
          pendingNavigation?.label
            ? `You have unsaved changes. Are you sure you want to leave this page and open ${pendingNavigation.label}?`
            : "You have unsaved changes. Are you sure you want to leave this page?"
        }
        confirmLabel="Discard and Continue"
        cancelLabel="Stay"
        showCancel={true}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </div>
  );
}

export default App;
