import { Link, useNavigate } from "react-router-dom";
import "./simulationmode.css";
import { CardSimulation, CardArchive, CardCreate } from "./components/Card";
import { USER_ID } from "./Login";
import { useEffect, useState } from "react";
import { VIEW_STUDENT_ROOM } from "./api";

export const STUDENT_ROOM_ID = "studentRoomID";
export const STUDENT_GAME_CODE = "studentGameCode";
export const STUDENT_ROOM_NAME = "studentRoomName";

export default function SimulationModeStudent() {
  const [userID] = useState(sessionStorage.getItem(USER_ID));
  const [joinRoomData, setJoinRoomData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${VIEW_STUDENT_ROOM}${userID}`)
      .then((response) => response.json())
      .then((data) => {
        setJoinRoomData(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching floors:", error));
  }, [userID]);

  const handleCardClick = (roomID, code, roomName) => {
    // Store the roomID, code, and roomName in session storage
    sessionStorage.setItem(STUDENT_ROOM_ID, roomID);
    sessionStorage.setItem(STUDENT_GAME_CODE, code);
    sessionStorage.setItem(STUDENT_ROOM_NAME, roomName);

    // Navigate to the room's page
    console.log(sessionStorage.getItem(STUDENT_GAME_CODE));
    console.log(sessionStorage.getItem(STUDENT_ROOM_ID));
    console.log(sessionStorage.getItem(STUDENT_ROOM_NAME));

    navigate(`/student/simulation_room`);
  };

  return (
    <main className="Simulation-wrapper">
      <div className="txt-Rooms room-header">Rooms</div>
      <section className="game-card-wrapper">
        {joinRoomData.map((room, index) => (
          <div
            key={index}
            onClick={() =>
              handleCardClick(room.roomID, room.code, room.roomName)
            }
          >
            <CardSimulation
              className="card card-simulation"
              title={room.roomName}
              content="Teacher"
              bannerSrc="/assets/banner/banner_room.jpg"
              progressTitle="Students"
              progressValue={room.members ? room.members.length : 0}
            />
          </div>
        ))}
        <Link to="/student/join_room">
          <CardCreate title="+Join Room" />
        </Link>
      </section>
    </main>
  );
}
