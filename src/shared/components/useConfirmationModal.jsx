import { useCallback, useMemo, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const DEFAULT_MESSAGE = "Are you sure you want to continue?";

const normalizeConfirmationOptions = (options) => {
  if (typeof options === "string") {
    return { message: options };
  }

  return options ?? {};
};

export const useConfirmationModal = () => {
  const [confirmationState, setConfirmationState] = useState(null);

  const askForConfirmation = useCallback(
    (action, content = DEFAULT_MESSAGE) => {
      if (typeof action !== "function") return;

      const normalizedContent = normalizeConfirmationOptions(content);

      setConfirmationState({
        action,
        message: normalizedContent.message || DEFAULT_MESSAGE,
      });
    },
    [],
  );

  const closeConfirmation = useCallback(() => setConfirmationState(null), []);

  const handleConfirm = useCallback(async () => {
    const action = confirmationState?.action;
    if (!action) return;

    setConfirmationState(null);
    await action();
  }, [confirmationState]);

  const confirmationModal = useMemo(
    () => (
      <ConfirmationModal
        isOpen={Boolean(confirmationState)}
        message={confirmationState?.message}
        onCancel={closeConfirmation}
        onConfirm={handleConfirm}
      />
    ),
    [closeConfirmation, confirmationState, handleConfirm],
  );

  return { askForConfirmation, confirmationModal };
};

export default useConfirmationModal;
