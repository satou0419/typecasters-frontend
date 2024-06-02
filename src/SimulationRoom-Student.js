import { Link } from "react-router-dom";
import "./simulationroom.css";
import "./components/button.css";
import { CardSimulation, CardArchive, CardCreate } from "./components/Card";
import {
  STUDENT_ROOM_ID,
  STUDENT_GAME_CODE,
  STUDENT_ROOM_NAME,
} from "./SimulationMode-Student";
import { VIEW_GAME_BY_ROOM } from "./api";
import { useEffect, useState, useRef } from "react";

export const SIMULATION_ID = "simulationID";

export default function AdventureMode() {
  const [gameData, setGameData] = useState([]);
  const [studentRoomID] = useState(sessionStorage.getItem(STUDENT_ROOM_ID));
  const [studentGameCode] = useState(sessionStorage.getItem(STUDENT_GAME_CODE));
  const [studentRoomName] = useState(sessionStorage.getItem(STUDENT_ROOM_NAME));
  const audioRef = useRef(null);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);

  useEffect(() => {
    console.log(studentRoomID);
    fetch(`${VIEW_GAME_BY_ROOM}${studentRoomID}`)
      .then((response) => response.json())
      .then((data) => {
        setGameData(data);
        console.log("ROOOOOM:::::", data);
      })
      .catch((error) => console.error("Error fetching floors:", error));
  }, [studentRoomID]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [autoPlayIndex]);

  const handleCardClick = (simulation, index) => {
    console.log("Clicked simulation:", simulation);
    sessionStorage.setItem(SIMULATION_ID, simulation.simulationID);
    setAutoPlayIndex(index);
  };

  const renderSimulationCards = (simulations) => {
    return simulations.map((simulation, index) => {
      const isDisabled = simulation.participants.some(
        (participant) => participant.done
      );
      // Calculate the total score of all participants
      const totalScore = simulation.participants.reduce(
        (sum, participant) => sum + participant.score,
        0
      );
      return (
        <Link
          key={index}
          to={isDisabled ? "#" : "/simulation_gameplay"}
          onClick={() => !isDisabled && handleCardClick(simulation, index)}
          className={`card-link ${isDisabled ? "disabled" : ""}`}
        >
          <CardSimulation
            className="card card-simulation"
            title={simulation.name}
            bannerSrc="./assets/banner/banner_adventure.webp"
            progressTitle="Score"
            progressValue={totalScore}
            disabled={isDisabled}
          />
        </Link>
      );
    });
  };

  return (
    <main className="room-wrapper">
      <div className="txt-Rooms">{`${studentRoomName}`}</div>
      <span className="txt-code">{studentGameCode}</span>

      <div className="room-wrapper">
        <section className="room-card-wrapper">
          {renderSimulationCards(gameData)}
        </section>
      </div>
    </main>
  );
}
