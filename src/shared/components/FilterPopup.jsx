import React, { useEffect, useMemo, useRef, useState } from "react";
import popupStyles from "./FilterPopup.module.css";

const normalizeOption = (option) => {
    if (typeof option === "string") {
        return {
            label: option,
            value: option,
        };
    }

    return {
        label: option?.label ?? "",
        value: option?.value ?? "",
    };
};

const SearchableDropdown = ({
    field,
    value,
    onChange,
    styles,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const normalizedOptions = useMemo(() => {
        return (field.options ?? []).map(normalizeOption);
    }, [field.options]);

    const selectedOption = normalizedOptions.find(
        (option) => String(option.value) === String(value)
    );

    const filteredOptions = normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(searchText.trim().toLowerCase())
    );

    const shouldShowSearch =
        field.searchable && normalizedOptions.length > (field.searchThreshold ?? 6);

    return (
        <div className={styles.searchableDropdown}>
            <button
                type="button"
                className={styles.searchableDropdownButton}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>
                    {selectedOption?.label || field.emptyLabel || "Select option"}
                </span>
                <span className={styles.searchableDropdownArrow}>
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>

            {isOpen && (
                <div className={styles.searchableDropdownMenu}>
                    {shouldShowSearch && (
                        <input
                            type="text"
                            className={styles.searchableDropdownInput}
                            placeholder={`Search ${field.label.toLowerCase()}...`}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            autoFocus
                        />
                    )}

                    <button
                        type="button"
                        className={styles.searchableDropdownOption}
                        onClick={() => {
                            onChange("");
                            setSearchText("");
                            setIsOpen(false);
                        }}
                    >
                        {field.emptyLabel || "All"}
                    </button>

                    {filteredOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`${styles.searchableDropdownOption} ${String(value) === String(option.value)
                                ? styles.searchableDropdownOptionActive
                                : ""
                                }`}
                            onClick={() => {
                                onChange(option.value);
                                setSearchText("");
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}

                    {filteredOptions.length === 0 && (
                        <div className={styles.searchableDropdownEmpty}>
                            No options found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const normalizeOptions = (options = []) =>
    options.map((option) =>
        typeof option === "string"
            ? { label: option, value: option }
            : { label: option.label, value: option.value }
    );

const buildEmptyValues = (fields) =>
    fields.reduce((acc, field) => {
        acc[field.key] = "";
        return acc;
    }, {});

const buildSyncedValues = (fields, values = {}) =>
    fields.reduce((acc, field) => {
        acc[field.key] = values[field.key] ?? "";
        return acc;
    }, {});

const FilterPopup = ({
    title = "Filters",
    buttonLabel = "Filter",
    iconSrc = "/icons/filter-blue.png",
    fields = [],
    values = {},
    onApply,
    onClear,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draftValues, setDraftValues] = useState(buildSyncedValues(fields, values));
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setDraftValues(buildSyncedValues(fields, values));
        }
    }, [isOpen, fields, values]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const activeCount = useMemo(() => {
        return fields.reduce((count, field) => {
            const value = values[field.key];
            return value !== undefined && value !== null && `${value}`.trim() !== ""
                ? count + 1
                : count;
        }, 0);
    }, [fields, values]);

    const handleFieldChange = (key, nextValue) => {
        setDraftValues((prev) => ({
            ...prev,
            [key]: nextValue,
        }));
    };

    const handleApply = () => {
        onApply?.(draftValues);
        setIsOpen(false);
    };

    const handleClear = () => {
        const clearedValues = buildEmptyValues(fields);
        setDraftValues(clearedValues);

        if (onClear) {
            onClear(clearedValues);
        } else {
            onApply?.(clearedValues);
        }

        setIsOpen(false);
    };

    return (
        <div className={popupStyles.wrapper} ref={wrapperRef}>
            <button
                type="button"
                className={`${popupStyles.filterContainer} ${isOpen ? popupStyles.triggerButtonOpen : ""
                    }`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <img
                    src={iconSrc}
                    alt="Filter"
                    className={`${popupStyles.filterIcon} ${isOpen ? popupStyles.triggerIconOpen : ""
                        }`}
                />
                <span>{buttonLabel}</span>

                {activeCount > 0 && (
                    <span className={popupStyles.activeCountBadge}>{activeCount}</span>
                )}
            </button>

            {isOpen && (
                <div className={popupStyles.popup}>
                    <div className={popupStyles.popupHeader}>
                        <h4>{title}</h4>
                    </div>

                    <div className={popupStyles.fieldsContainer}>
                        {fields.map((field) => {
                            const options = normalizeOptions(field.options || []);
                            const value = draftValues[field.key] ?? "";

                            return (
                                <label key={field.key} className={popupStyles.fieldGroup}>
                                    <span className={popupStyles.fieldLabel}>{field.label}</span>

                                    {field.type === "select" && field.searchable ? (
                                        <SearchableDropdown
                                            field={field}
                                            value={value}
                                            styles={popupStyles}
                                            onChange={(nextValue) => handleFieldChange(field.key, nextValue)}
                                        />
                                    ) : field.type === "select" ? (
                                        <select
                                            className={popupStyles.fieldInput}
                                            value={value}
                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                        >
                                            <option value="">{field.emptyLabel || "All"}</option>

                                            {options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type || "text"}
                                            className={popupStyles.fieldInput}
                                            placeholder={field.placeholder || ""}
                                            value={value}
                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                        />
                                    )}
                                </label>
                            );
                        })}
                    </div>

                    <div className={popupStyles.footer}>
                        <button
                            type="button"
                            className={popupStyles.clearButton}
                            onClick={handleClear}
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            className={popupStyles.applyButton}
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPopup;