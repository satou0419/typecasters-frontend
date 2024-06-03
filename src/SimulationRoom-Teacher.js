import { Link } from "react-router-dom";
import "./simulationroom.css";
import "./components/button.css";
import { CardSimulation, CardArchive, CardCreate } from "./components/Card";

import { ROOM_ID, ROOM_CODE, ROOM_NAME } from "./SimulationMode-Teacher";
import { VIEW_GAME_BY_ROOM } from "./api";
import { useEffect, useState } from "react";

export const TEACHER_SIMULATION_ID = "teacherSimulationID";
export default function SimulationRoomTeacher() {
  const roomID = sessionStorage.getItem(ROOM_ID);
  const roomCode = sessionStorage.getItem(ROOM_CODE);
  const roomName = sessionStorage.getItem(ROOM_NAME);
  const [gameData, setGameData] = useState([]);

  useEffect(() => {
    fetch(`${VIEW_GAME_BY_ROOM}${roomID}`)
      .then((response) => response.json())
      .then((data) => {
        setGameData(data);
        sessionStorage.setItem(TEACHER_SIMULATION_ID, data[0].simulationID);
      })
      .catch((error) => console.error("Error fetching floors:", error));
  }, []);

  return (
    <main className="simulation-wrapper">
      <Link to="/teacher/room_info">
        <button id="room_info_btn" className="btn btn--small btn--primary btn-info">
          Room Information
        </button>
      </Link>

      <div className="txt-Rooms">{`Simulation - =${roomName}==${roomCode}`}</div>

      <div className="teacher-card-wrapper">
        <section id="created_games" className="simulation-card-wrapper">
          {gameData.map((game, index) => (
            <Link to="/teacher/room_settings">
              <CardSimulation
                key={index}
                className="card card-simulation"
                title={game.name}
                bannerSrc={game.bannerSrc || "/assets/banner/banner_quiz.webp"}
                progressTitle="Students Done"
                progressValue={game.participants ? game.participants.length : 0}
              />
            </Link>
          ))}
          <Link to="/teacher/create_game">
            <CardCreate title="+Create Game" />
          </Link>
        </section>
      </div>
    </main>
  );
}
