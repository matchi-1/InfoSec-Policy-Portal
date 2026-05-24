import React, { useCallback, useMemo, useState } from "react";
import Button from "./Button";
import styles from "./ConfirmationModal.module.css";

const InformationModal = ({
  isOpen,
  title,
  message,
  details = [],
  onClose,
  closeLabel = "Close",
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className={styles.title}>{title}</h2>}
        {message && <p className={styles.message}>{message}</p>}

        <div className="mt-4 max-h-[300px] overflow-scroll">
          {Array.isArray(details) && details.length > 0 && (
            <div className={styles.details}>
              {details.map((item, idx) => (
                <div
                  className={styles.detailItem}
                  key={`${item.title ?? "item"}-${idx}`}
                >
                  {item.title && (
                    <p className={styles.detailTitle}>{item.title}</p>
                  )}
                  {Array.isArray(item.lines) && item.lines.length > 0 && (
                    <ul className={styles.detailList}>
                      {item.lines.map((line, li) => (
                        <li className={styles.detailLine} key={`${idx}-${li}`}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="md" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const useInformationModal = () => {
  const [infoState, setInfoState] = useState(null);

  const showInformation = useCallback((content = {}) => {
    setInfoState({
      title: content.title,
      message: content.message,
      details: Array.isArray(content.details) ? content.details : [],
      closeLabel: content.closeLabel,
    });
  }, []);

  const closeInformation = useCallback(() => setInfoState(null), []);

  const informationModal = useMemo(
    () => (
      <InformationModal
        isOpen={Boolean(infoState)}
        title={infoState?.title}
        message={infoState?.message}
        details={infoState?.details ?? []}
        onClose={closeInformation}
        closeLabel={infoState?.closeLabel ?? "Close"}
      />
    ),
    [infoState, closeInformation],
  );

  return {
    showInformation,
    informationModal,
  };
};

export default InformationModal;
