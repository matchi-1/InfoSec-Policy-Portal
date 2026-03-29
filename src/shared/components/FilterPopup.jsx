import React, { useEffect, useMemo, useRef, useState } from "react";
import popupStyles from "./FilterPopup.module.css";

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

                                    {field.type === "select" ? (
                                        <select
                                            className={popupStyles.fieldInput}
                                            value={value}
                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                        >
                                            <option value="">{field.emptyLabel || `All`}</option>
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