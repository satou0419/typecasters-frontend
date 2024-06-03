import { Link } from "react-router-dom";
import "./simulationmode.css";
import { CardSimulation, CardCreate } from "./components/Card"; // Removed CardArchive since it's not used
import { useState, useEffect } from "react";
import { USER_ID } from "./Login";
import { VIEW_ROOM } from "./api";

export const ROOM_ID = "roomID";
export const ROOM_NAME = "roomName";
export const ROOM_CODE = "roomCode";

export default function SimulationModeTeacher() {
  const [creatorID] = useState(sessionStorage.getItem(USER_ID));
  const [rooms, setRooms] = useState([]);
  const [roomID, setRoomID] = useState();
  const [roomName, setRoomName] = useState();
  const [roomCode, setRoomCode] = useState();

  useEffect(() => {
    if (creatorID) {
      fetch(`${VIEW_ROOM}${creatorID}`)
        .then((response) => response.json())
        .then((data) => setRooms(data))
        .catch((error) => console.error("Error fetching room dapvta:", error));
    }
  }, [rooms]); // Fixed the dependency array

  const handleCardSimulationClick = (clickedRoom) => {
    setRoomID(clickedRoom.roomID);
    setRoomName(clickedRoom.roomName);
    setRoomCode(clickedRoom.code);
    sessionStorage.setItem(ROOM_ID, clickedRoom.roomID);
    sessionStorage.setItem(ROOM_NAME, clickedRoom.roomName);
    sessionStorage.setItem(ROOM_CODE, clickedRoom.code);
    console.log("ROOM ID:::", clickedRoom.roomID);
    console.log("ROOM NAME:::", clickedRoom.roomName);
    console.log("ROOM CODE:::", clickedRoom.code);
  };

  return (
    <main className="simulation-wrapper">
      <div className="txt-Rooms">Rooms</div>
      <section className="teacher-card-wrapper">
        {Array.isArray(rooms) &&
          rooms.map((room) => (
            <Link
              to="/teacher/simulation_room"
              key={room.roomID}
              onClick={() => handleCardSimulationClick(room)}
            >
              <CardSimulation
                className="card card-simulation"
                title={room.roomName}
                content="Teacher" // Assuming this is static as not provided in JSON
                bannerSrc="/assets/banner/banner_room.jpg" // Assuming this is static as not provided in JSON
                progressTitle="Students"
                progressValue={room.members.length.toString()} // Convert number of members to string
              />
            </Link>
          ))}
        <Link to="/teacher/create_room">
          <CardCreate title="+Create Room" />
        </Link>
      </section>
    </main>
  );
}
