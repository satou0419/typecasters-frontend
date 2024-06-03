import React from "react";
import "./modal.css"; // Add styles for the modal

const StartModal = ({ isVisible, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 id="description">Defeat all the enemies</h2>
        <button id="confirm_btn" className="btn btn--small btn--primary" onClick={onConfirm}>
          Start
        </button>
      </div>
    </div>
  );
};

export default StartModal;
