import React, { useCallback, useEffect, useMemo, useState } from "react";
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
          <Button variant="secondary" size="md" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

export const useConfirmationModal = () => {
  const [confirmationState, setConfirmationState] = useState(null);

  const askForConfirmation = useCallback(
    (action, message = DEFAULT_MESSAGE) => {
      if (typeof action !== "function") {
        return;
      }

      setConfirmationState({
        action,
        message: message || DEFAULT_MESSAGE,
      });
    },
    [],
  );

  const closeConfirmation = useCallback(() => {
    setConfirmationState(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    const action = confirmationState?.action;
    if (!action) {
      return;
    }

    setConfirmationState(null);
    await action();
  }, [confirmationState]);

  const confirmationModal = useMemo(
    () => (
      <ConfirmationModal
        isOpen={Boolean(confirmationState)}
        message={confirmationState?.message ?? DEFAULT_MESSAGE}
        onCancel={closeConfirmation}
        onConfirm={handleConfirm}
      />
    ),
    [closeConfirmation, confirmationState, handleConfirm],
  );

  return {
    askForConfirmation,
    confirmationModal,
  };
};
