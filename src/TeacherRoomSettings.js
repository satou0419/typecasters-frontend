import React, { useState, useEffect } from "react";
import "./components/tab.css";
import "./teacherroomsettings.css";
import { CardStatus, CardSettingF2 } from "./components/Card";
import {
  SIMULATION_GAMEPLAY,
  VIEW_GAME_BY_ROOM,
  GET_USER_INFO_BY_ID,
} from "./api";

import { TEACHER_SIMULATION_ID } from "./SimulationRoom-Teacher";
export default function TeacherRoomSettings() {
  const [gameData, setGameData] = useState({ participants: [] });
  const simulationID = sessionStorage.getItem(TEACHER_SIMULATION_ID);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    fetch(`${SIMULATION_GAMEPLAY}${simulationID}`)
      .then((response) => response.json())
      .then((data) => {
        setGameData(data);
        console.log("Fetched Data:", data); // Log the fetched data
        setGameData(data);
      })
      .catch((error) => console.error("Error fetching room data:", error));
  }, [simulationID]); // Add simulationID to the dependency array

  useEffect(() => {
    // Assume you have a function to fetch usernames by userID
    const fetchUsernames = async () => {
      let newUsernames = {};
      for (let participant of gameData.participants) {
        const response = await fetch(
          `${GET_USER_INFO_BY_ID}${participant.userID}`
        );
        const data = await response.json();
        newUsernames[participant.userID] = data.username; // Assuming API returns {username: "Alice"}
      }
      setUsernames(newUsernames);
    };

    fetchUsernames();
  }, [gameData]);

  return (
    <div className="main-container">
      <div className="leftbox">
        <h3>Students Progress</h3>

        <section className="card-holder">
          {gameData.participants &&
            gameData.participants.map((participant) => (
              <section
                className="cardstatus"
                key={participant.simulationParticipantsID}
              >
                <CardStatus
                  title={`${usernames[participant.userID]}`}
                  content={`Time: ${
                    participant.time ? participant.time : "0:00"
                  }`}
                  bannerSrc="/assets/banner/banner_user.png"
                  progressTitle="Score"
                  progressValue={participant.score}
                  // onClick={handleCardStatusClick}
                />
              </section>
            ))}
        </section>
      </div>

      <div className="rightbox">
        <section className="card card-setting--2f words">
          <h1 className="words-added"> Words Added</h1>
          <div className="overflow">
            {gameData.words &&
              gameData.words.map((words) => <span>{`${words.word}`}</span>)}
          </div>
        </section>

        <section className="cardsetting">
          <CardSettingF2
            title="Settings"
            placeholder1="Update Simulation Name"
            placeholder2="Update Time"
            btnText1="Delete"
            btnText2="Save"
            // onBtn1Click={handleBtn1Click}
            // onBtn2Click={handleBtn2Click}
          />
        </section>
      </div>
    </div>
  );
}
