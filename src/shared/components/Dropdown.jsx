import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Dropdown.module.css";

const normalizeOption = (option) =>
  typeof option === "string"
    ? { label: option, value: option }
    : { label: option.label, value: option.value };

const Dropdown = ({
  value,
  options = [],
  onChange,
  size = "md",
  className = "",
  ariaLabel,
  searchable,
  searchPlaceholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [menuDirection, setMenuDirection] = useState("down");
  const [menuMaxHeight, setMenuMaxHeight] = useState(224);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const sizeClass = size === "sm" ? styles.sm : styles.md;
  const normalizedOptions = useMemo(
    () => options.map(normalizeOption),
    [options],
  );

  const selectedIndex = useMemo(() => {
    const index = normalizedOptions.findIndex(
      (option) => option.value === value,
    );
    return index >= 0 ? index : 0;
  }, [normalizedOptions, value]);

  const selectedOption =
    normalizedOptions[selectedIndex] ?? normalizedOptions[0];

  const shouldShowSearch = searchable ?? normalizedOptions.length > 7;

  const filteredOptions = useMemo(() => {
    if (!shouldShowSearch) {
      return normalizedOptions;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return normalizedOptions;
    }

    return normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedOptions, searchTerm, shouldShowSearch]);

  const selectedFilteredIndex = useMemo(() => {
    const index = filteredOptions.findIndex(
      (option) => option.value === selectedOption?.value,
    );
    return index >= 0 ? index : 0;
  }, [filteredOptions, selectedOption?.value]);

  useEffect(() => {
    setHighlightedIndex(selectedFilteredIndex);
  }, [selectedFilteredIndex]);

  useEffect(() => {
    if (isOpen && shouldShowSearch) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, shouldShowSearch]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const updateMenuPlacement = () => {
      if (!wrapperRef.current) {
        return;
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      const edgePadding = 12;
      const availableBelow = window.innerHeight - rect.bottom - edgePadding;
      const availableAbove = rect.top - edgePadding;
      const optionHeight = size === "sm" ? 30 : 34;
      const searchBoxAllowance = shouldShowSearch ? 44 : 0;
      const desiredHeight = Math.min(
        filteredOptions.length * optionHeight + 8 + searchBoxAllowance,
        224,
      );

      const shouldOpenUp =
        availableBelow < desiredHeight && availableAbove > availableBelow;
      const activeSpace = shouldOpenUp ? availableAbove : availableBelow;
      const boundedHeight = Math.max(96, Math.min(224, activeSpace));

      setMenuDirection(shouldOpenUp ? "up" : "down");
      setMenuMaxHeight(boundedHeight);
    };

    updateMenuPlacement();

    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", updateMenuPlacement);
    window.addEventListener("scroll", updateMenuPlacement, true);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("resize", updateMenuPlacement);
      window.removeEventListener("scroll", updateMenuPlacement, true);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [filteredOptions.length, isOpen, shouldShowSearch, size]);

  const selectOption = (nextValue) => {
    onChange?.(nextValue);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (event) => {
    if (!filteredOptions.length && event.key !== "Escape") {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((currentIndex) => {
        const delta = event.key === "ArrowDown" ? 1 : -1;
        return (
          (currentIndex + delta + filteredOptions.length) %
          filteredOptions.length
        );
      });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        const optionToSelect = filteredOptions[highlightedIndex];
        if (optionToSelect) {
          selectOption(optionToSelect.value);
        }
      } else {
        setIsOpen(true);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`${styles.shell} ${sizeClass} ${className}`.trim()}
      ref={wrapperRef}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.triggerLabel}>
          {selectedOption?.label ?? "Select"}
        </span>
        <span
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`${styles.menu} ${menuDirection === "up" ? styles.menuUp : ""}`}
          style={{ maxHeight: `${menuMaxHeight}px` }}
        >
          {shouldShowSearch && (
            <div className={styles.searchRow}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
                className={styles.searchInput}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    handleTriggerKeyDown(event);
                  }
                }}
              />
            </div>
          )}

          <ul
            className={styles.optionsList}
            role="listbox"
            aria-label={ariaLabel}
          >
            {filteredOptions.map((option, index) => {
              const isSelected = option.value === selectedOption?.value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ""} ${
                      isHighlighted ? styles.optionHighlighted : ""
                    }`}
                    onClick={() => selectOption(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span className={styles.optionLabel}>{option.label}</span>
                    {isSelected && (
                      <span className={styles.selectedMark}>✓</span>
                    )}
                  </button>
                </li>
              );
            })}

            {filteredOptions.length === 0 && (
              <li className={styles.emptyState}>No matching roles</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
