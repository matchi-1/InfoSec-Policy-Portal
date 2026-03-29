import React, { useState, useEffect } from "react";

const SearchBar = ({ value = "", onChange, placeholder = "Search..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSearch = () => {
    onChange(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.trim() === "") {
      onChange("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getActionButtonStyle = (buttonName) => {
    const isHovered = hoveredButton === buttonName;
    const isActive = activeButton === buttonName;

    return {
      ...styles.actionButton,
      ...(isHovered ? styles.actionButtonHover : {}),
      ...(isActive ? styles.actionButtonActive : {}),
    };
  };

  const getActionIconStyle = (buttonName) => {
    const isHovered = hoveredButton === buttonName;
    const isActive = activeButton === buttonName;

    return {
      ...styles.actionIcon,
      ...(isHovered ? styles.actionIconHover : {}),
      ...(isActive ? styles.actionIconActive : {}),
    };
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.container,
          border: isFocused
            ? "2px solid rgb(98, 117, 176)"
            : "1px solid rgb(132, 143, 175)",
        }}
      >
        <img src="/icons/search-icon.png" alt="Search" style={styles.icon} />
        <input
          type="text"
          placeholder={placeholder}
          style={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button
        type="button"
        style={getActionButtonStyle("search")}
        onClick={handleSearch}
        onMouseEnter={() => setHoveredButton("search")}
        onMouseLeave={() => {
          setHoveredButton(null);
          setActiveButton(null);
        }}
        onMouseDown={() => setActiveButton("search")}
        onMouseUp={() => setActiveButton(null)}
      >
        <img
          src="/icons/search-icon.png"
          alt="Search"
          style={getActionIconStyle("search")}
        />
      </button>

      <button
        type="button"
        style={getActionButtonStyle("clear")}
        onClick={handleClear}
        onMouseEnter={() => setHoveredButton("clear")}
        onMouseLeave={() => {
          setHoveredButton(null);
          setActiveButton(null);
        }}
        onMouseDown={() => setActiveButton("clear")}
        onMouseUp={() => setActiveButton(null)}
      >
        <span style={getActionIconStyle("clear")}>✕</span>
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    width: "100%",
    maxWidth: "24rem",
    minWidth: 0,
    boxSizing: "border-box",
  },
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F7F9FB",
    borderRadius: "0.5rem",
    flex: 1,
    minWidth: 0,
    height: "1.75rem",
    paddingLeft: "0.6rem",
    paddingRight: "0.5rem",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    marginRight: "0.45rem",
    flexShrink: 0,
  },
  input: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    flex: 1,
    minWidth: 0,
    width: "100%",
    fontSize: "0.9rem",
    color: "#1a2346",
    height: "100%",
    margin: 0,
    boxSizing: "border-box",
  },

  actionButton: {
    width: "1.8rem",
    height: "1.75rem",
    border: "1px solid #6F6F6F",
    borderRadius: "0.5rem",
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
    boxSizing: "border-box",
    transition:
      "background-color 0.15s ease, border-color 0.15s ease, transform 0.08s ease",
  },
  actionButtonHover: {
    backgroundColor: "#E7EAF0",
  },
  actionButtonActive: {
    backgroundColor: "#DDE1E8",
    transform: "scale(0.97)",
  },

  actionIcon: {
    color: "#727272",
    fontSize: "0.72rem",
    fontWeight: "600",
    lineHeight: 1,
    width: "0.72rem",
    height: "0.72rem",
    filter: "brightness(0) saturate(100%) invert(45%)",
    transition: "filter 0.15s ease, color 0.15s ease",
    flexShrink: 0,
  },
  actionIconHover: {
    color: "#5F5F5F",
    filter: "brightness(0) saturate(100%) invert(35%)",
  },
  actionIconActive: {
    color: "#4F4F4F",
    filter: "brightness(0) saturate(100%) invert(28%)",
  },
};

export default SearchBar;