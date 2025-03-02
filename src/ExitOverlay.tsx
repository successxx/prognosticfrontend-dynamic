import React from "react";
import styles from "./WebinarView.module.css";
import { createPortal } from "react-dom";

interface ExitOverlayProps {
  message: string;
  onClose: () => void;
}

const ExitOverlay: React.FC<ExitOverlayProps> = ({ message, onClose }) => {
  return (
    <div className={styles.exitOverlay} onClick={onClose}>
      <div
        className={styles.iphoneMessageBubble}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.exitCloseBtn} onClick={onClose}>
          ×
        </button>
        <div className={styles.iphoneSender}>Selina</div>
        <div className={styles.iphoneMessageText}>{message}</div>
      </div>
    </div>
  );
};

export default ExitOverlay;
