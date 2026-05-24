import React, { useEffect } from "react";
import Button from "./Button";
import styles from "./ConfirmationModal.module.css";

const DEFAULT_MESSAGE = "Are you sure you want to continue?";

const ConfirmationModal = ({
  isOpen,
  message = DEFAULT_MESSAGE,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  showCancel = true,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={() => onCancel?.()}
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          {showCancel && (
            <Button variant="secondary" size="md" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}

          <Button variant="primary" size="md" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

// The confirmation hook is provided from useConfirmationModal.js to
// keep this file exporting only components (fast-refresh friendly).
