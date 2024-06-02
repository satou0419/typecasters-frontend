import React, { useState } from "react";
import "./modal.css";

export const Modal = ({
  cancelButtonLabel,
  confirmButtonLabel,
  modalTitle,
  modalContent,
  cancelClick,
  confirmClick // Pass the toggleModal function as a prop
}) => (
  <section>
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h1 id="lbl_modal" className="modal-title">{modalTitle}</h1>
        <p className="modal-message">{modalContent}</p>
        <div className="btn-container">
          <button
            onClick={cancelClick}
            id="btn_cancel"
            className="btn btn--small btn--danger modal-btn"
          >
            {cancelButtonLabel}
          </button>
          <button
            onClick={confirmClick}
            id="btn_confirm"
            className="btn btn--small btn--primary modal-btn"
          >
            {confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  </section>
);

export const Message = ({
  confirmButtonLabel,
  messageTitle,
  modalContent,
  confirmClick // Pass the toggleModal function as a prop
}) => (
  <section>
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h1 id="lbl_modal" className="message-title">{messageTitle}</h1>
        <p className="modal-message">{modalContent}</p>
        <div className="btn-container">
          <button
            onClick={confirmClick}
            id="btn_confirm"
            className="btn btn--small btn--primary message-btn"
          >
            {confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  </section>
);

const App = () => {
  const [modal, setModal] = useState(false);

  // // // Define function to toggle modal visibility
  // const toggleModal = () => {
  //   setModal(!modal);
  // };


  const buttonClick = () => {
    console.log("Clicked")
  }

  return (
    <div>
      {/* Render other components */}
      <Modal
        cancelButtonLabel="Cancel"
        confirmButtonLabel="Confirm"
        modalTitle="Hello Modal"
        modalContent="Lorem ipsum dolor sit amet"
        confirmClick={buttonClick}
        cancelClick={buttonClick}
      />
      <Message
        confirmButtonLabel="Confirm"
        messageTitle="Hello Modal"
        modalContent="Lorem ipsum dolor sit amet"
        confirmClick={buttonClick}
      />
    </div>
  );
};

export default App;
