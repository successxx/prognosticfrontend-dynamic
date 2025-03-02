import React from "react";
import ReactDOM from "react-dom";
import styles from "./WebinarView.module.css";

interface ExitOverlayProps {
  message: string;
  onClose: () => void;
}

const ExitOverlay: React.FC<ExitOverlayProps> = ({ message, onClose }) => {
  const defaultMsg = "Wait! Are you sure you want to leave?";

  const handleWrapperClick = () => {
    onClose();
  };

  const handleBubbleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.exitOverlay} onClick={handleWrapperClick}>
      <div className={styles.iphoneMessageBubble} onClick={handleBubbleClick}>
        <button className={styles.exitCloseBtn} onClick={onClose}>
          ×
        </button>
        <div className={styles.iphoneSender}>Selina</div>
        <div className={styles.iphoneMessageText}>
          {message && message.trim() ? message : defaultMsg}
        </div>
      </div>
    </div>
  );
};

export default ExitOverlay;
