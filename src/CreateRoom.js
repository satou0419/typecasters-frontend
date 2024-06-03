import "./createroom.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { USER_ID } from "./Login";
import { CREATE_ROOM } from "./api";
import { useState } from "react";
import { Modal } from './components/Modal';
import "./components/animation.css";


export default function CreateRoom() {
  const [userID, setUserID] = useState(sessionStorage.getItem(USER_ID));
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  console.log(userID);

  const handleCreateRoom = async () => {
    try {
      const creatorID = userID;
      const roomName = document.getElementById("roomName").value;

      if (!roomName) {
        setIsEmpty(true);
        setTimeout(() => setIsEmpty(false), 500); 
        console.error("Please fill all fields");
        return;
      }else{
        setIsModalOpen(true); // Show the modal
      }

      const updateUserURL = `${CREATE_ROOM}`;

      const response = await fetch(updateUserURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorID: creatorID,
          roomName: roomName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      console.log("Room Created Successfully");
      console.log(response.data);
      // Navigate('/teacher/simulation_mode');
    } catch (error) {
      console.error("Error creating room!");
    }
  };

      const handleCancelCreate = () => {
        setIsModalOpen(false);
        console.log("Cancelled Room Creation")
      };

      // const handleCreate = () => {
      //   setIsModalOpen(true); // Show the modal
      // };

      const handleConfirmCreate = () => {
        navigate('/teacher/simulation_mode');
        setIsModalOpen(false); // Hide the modal
        console.log("Room Created!") // Navigate to the specified route
      };

  return (
    <main className="createroom-container">
      <section className="card createroom-card">
      <h1 id="createroom_heading" className="createroom-card__heading">Create Room</h1>
        <input
          type="text"
          className={`input input-line input-line--dark ${
            isEmpty ? "animate-shake" : ""
          }`}
          placeholder="Enter Room Name"
          id="roomNamed"
        />
        <Link to="/teacher/simulation_mode">
          <button
            id="createroom_btn"
            className="btn btn--large btn--primary"
            onClick={handleCreateRoom}
          >
            CREATE
          </button>
        </Link>
        <button id="cancel_btn" className=">btn btn--large btn--danger--large">CANCEL</button>
      </section>
      {isModalOpen && (
        <Modal
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Confirm"
          modalTitle="Create Room"
          modalContent="Are you sure you want to create the room?"
          confirmClick={handleConfirmCreate}
          cancelClick={handleCancelCreate}
        />
      )}
    </main>
  );
}
