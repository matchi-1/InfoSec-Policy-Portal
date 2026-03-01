import React, { useState, useEffect } from "react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};


const styles = {
  container: {
    display: "flex",
    backgroundColor: "#F7F9FB",
    borderRadius: "0.5rem",
    width: "100%",
    height: "1.75rem",
    maxWidth: "20rem",
    justifyContent: "center",
    //transition: "border 0.2s ease, box-shadow 0.2s ease",
    //boxSizing: "border-box",
    alignItems: "center",
    paddingLeft: "0.5rem",
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
};

export default SearchBar;
