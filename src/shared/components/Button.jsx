import React from "react";
import styles from "./Button.module.css";

const variantClassMap = {
  primary: styles.primary,
  secondary: styles.secondary,
  subtle: styles.subtle,
  text: styles.text,
};

const sizeClassMap = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  disabled = false,
  icon = null,
  onClick,
  ariaLabel,
}) => {
  const variantClass = variantClassMap[variant] || variantClassMap.primary;
  const sizeClass = sizeClassMap[size] || sizeClassMap.md;

  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
