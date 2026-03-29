import React, { useState, useEffect } from "react";

const SearchBar = ({ value = "", onChange, placeholder = "Search..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button type="button" style={styles.actionButton} onClick={handleSearch}>
        <img src="/icons/search-icon.png" alt="Search" style={styles.actionIcon} />
      </button>

      <button type="button" style={styles.actionButton} onClick={handleClear}>
        <span style={styles.xIcon}>✕</span>
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
    width: "100%",
    maxWidth: "24rem",
  },
  container: {
    display: "flex",
    backgroundColor: "#F7F9FB",
    borderRadius: "0.5rem",
    width: "100%",
    height: "1.75rem",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "1rem",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    marginRight: "0.5rem",
  },
  input: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    flex: 1,
    fontSize: "0.8rem",
    color: "#787878",
    height: "100%",
    margin: "0rem",
  },
  actionButton: {
    width: "1.9rem",
    height: "1.75rem",
    border: "none",
    borderRadius: "0.5rem",
    backgroundColor: "#204C8B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  actionIcon: {
    width: "0.9rem",
    height: "0.9rem",
    filter: "brightness(0) invert(1)",
  },
  xIcon: {
    color: "white",
    fontSize: "0.9rem",
    fontWeight: "600",
    lineHeight: 1,
  },
};

export default SearchBar;