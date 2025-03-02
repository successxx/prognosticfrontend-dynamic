/*******************************************************
9) EXITOVERLAY (for exit-intent bubble)
*******************************************************/
function ExitOverlay({ message, onClose }) {
  const defaultMsg = "Wait! Are you sure you want to leave?";
  return ReactDOM.createPortal(
    <div className="exitOverlay" onClick={onClose}>
      <div className="iphoneMessageBubble" onClick={(e) => e.stopPropagation()}>
        <button className="exitCloseBtn" onClick={onClose}>
          ×
        </button>
        <div className="iphoneSender">Selina</div>
        <div className="iphoneMessageText">
          {message && message.trim() ? message : defaultMsg}
        </div>
      </div>
    </div>,
    document.body
  );
}
