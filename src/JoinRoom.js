import "./joinroom.css";
import { Link } from "react-router-dom";
import { USER_ID } from "./Login";
import { useEffect, useState } from "react";
import { JOIN_ROOM } from "./api";
export default function CreateRoom() {
  const [userID, setUserID] = useState(sessionStorage.getItem(USER_ID));
  const [gameCode, setGameCode] = useState();

  const handleInputChange = (event) => {
    setGameCode(event.target.value); // Update gameCode state with the value entered in the text field
  };
  
  const handleJoinClick = () => {
    fetch(`${JOIN_ROOM}${userID}/code/${gameCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Read response as text
      })
      .then((data) => {
        console.log("Response:", data); // Log the response received from the server
      })
      .catch((error) => console.error("Error updating progress:", error));
  };

  return (
    <main className="joinroom-container">
      <section className="card createroom-card joinroom-card">
        <img id="joinroom_bg" src="/assets/background/join_room_background.webp" />
        <h1 id="joinroom_heading" className="createroom-card__heading">Join Room</h1>
        <input
          type="text"
          value={gameCode}
          onChange={handleInputChange} // Update this line
          className="input input-line input-line--dark join-input"
          placeholder="Enter Room Name"
          id="enter_room_name"
        />
        <Link to="/student/simulation_mode">
          <button
            id="join_btn"
            className="btn btn--large btn--primary join-btn"
            onClick={handleJoinClick}
          >
            JOIN NOW
          </button>
        </Link>
        <Link to="/student/simulation_mode">
          <button id="cancel_btn" className=">btn btn--large btn--danger--large cancel-btn">
            CANCEL
          </button>
        </Link>
      </section>
    </main>
  );
}
