import React, { useEffect, useState } from "react";
import "./components/tab.css";
import "./creategame.css";
import "./components/input.css";
import { Link, useNavigate } from "react-router-dom";
import { API_KEY, MERRIAM_API, CREATE_GAME } from "./api";
import { ROOM_ID } from "./SimulationMode-Teacher";

const fetchWordDefinition = async (word) => {
  try {
    const url = `${MERRIAM_API}${word}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching definition:", error);
    return null;
  }
};

export default function CreateGame() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Spelling");
  const [selectedEnemyWords, setEnemyWords] = useState("");
  const [selectedStudentLife, setStudentlife] = useState("");
  const [isItemOn, setIsItemOn] = useState(false);
  const [isDescriptionOn, setIsDescriptionOn] = useState(false);
  const [isPronunciationOn, setIsPronunciationOn] = useState(false);
  const [isReplayOn, setIsReplayOn] = useState(false);
  const [wordInput, setWordInput] = useState("");
  const [borderColor, setBorderColor] = useState("");
  const [addedWords, setAddedWords] = useState([]);
  const [roomID, setRoomID] = useState(sessionStorage.getItem(ROOM_ID));
  const [simulationName, setSimulationName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    console.log("ROOMID::::", roomID);
  }, [roomID]);

  const toggleSwitchItem = () => setIsItemOn(!isItemOn);
  const toggleSwitchDescription = () => setIsDescriptionOn(!isDescriptionOn);
  const toggleSwitchPronunciation = () =>
    setIsPronunciationOn(!isPronunciationOn);
  const toggleSwitchReplay = () => setIsReplayOn(!isReplayOn);

  const handleEnemyWords = (event) => setEnemyWords(event.target.value);
  const handleStudentLife = (event) => setStudentlife(event.target.value);
  const handleSimulationName = (event) => setSimulationName(event.target.value);
  const handleDeadline = (event) => setDeadline(event.target.value);
  const handleDuration = (event) => setDuration(event.target.value);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleInputChange = (event) => {
    setWordInput(event.target.value);
    setBorderColor("");
    document
      .querySelector(".input.input-box.search-box")
      .classList.remove("animate-error");
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      if (addedWords.length < 10) {
        const data = await fetchWordDefinition(wordInput);
        if (data && data.length > 0 && data[0].meta) {
          setBorderColor("green");
          addWord(wordInput);
        } else {
          setBorderColor("red");
          document
            .querySelector(".input.input-box.search-box")
            .classList.add("animate-error");
        }
      } else {
        alert("You can only add up to 10 words.");
      }
    }
  };

  const addWord = (word) => {
    setAddedWords((prevWords) => [...prevWords, word]);
    setWordInput("");
  };

  const handleSubmit = async () => {
    const words = addedWords.map((word) => ({ word }));
    const requestBody = {
      roomID: parseInt(roomID),
      name: simulationName,
      deadline,
      duration: parseInt(duration),
      items: isItemOn,
      description: isDescriptionOn,
      pronunciation: isPronunciationOn,
      allowReply: isReplayOn,
      words,
    };

    try {
      const response = await fetch(CREATE_GAME, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Handle successful response
        const data = await response.json();
        console.log("Game created successfully:", data);
        navigate("/teacher/simulation_room");
      } else {
        // Handle error response
        console.error("Failed to create game:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Syllable":
        return <div className="tab-content create">This is a tab</div>;
      case "Silent":
        return <div className="tab-content create">Hello</div>;
      default:
        return (
          <div className="tab-content create">
            <div className="textfield-left-container">
              <input
                type="text"
                className="input input-box search-box"
                placeholder="Search Word Dictionary"
                value={wordInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{ borderColor }}
              />
              <p className="txt-words-added">Words Added:</p>
              <section className="book-container added-word">
                <div className="left-page page-container words-container">
                  <div className="book-page">
                    <div className="left-content">
                      <div className="word-search">
                        <input
                          type="text"
                          className="input input-line input-line--light"
                          placeholder="Search words"
                        />
                      </div>
                      <div className="added-list-word">
                        {addedWords.map((word, index) => (
                          <span key={index}>{word}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="textfield-right-container">
              <input
                type="text"
                className="input input-box search-box"
                placeholder="Enter Simulation Name"
                value={simulationName}
                onChange={handleSimulationName}
              />
              <input
                type="datetime-local"
                id="dateTimeInput"
                name="dateTime"
                className="input input-box-form input-select search-box"
                placeholder="Set Deadline"
                value={deadline}
                onChange={handleDeadline}
              />
              <input
                type="text"
                className="input input-box search-box"
                placeholder="Set Words duration"
                value={duration}
                onChange={handleDuration}
              />
              <select
                id="dropdown"
                value={selectedEnemyWords}
                onChange={handleEnemyWords}
                className="input input-box-form input-select search-box"
              >
                <option value="" disabled hidden>
                  Select Number of words per Enemy
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
              <select
                id="dropdown"
                value={selectedStudentLife}
                onChange={handleStudentLife}
                className="input input-box-form input-select search-box"
              >
                <option value="" disabled hidden>
                  Student Life
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
              <div className="checkmark">
                <div
                  className="switch"
                  onClick={toggleSwitchItem}
                  style={{ cursor: "pointer" }}
                >
                  {isItemOn ? (
                    <img src="/assets/misc/Switch_on.svg" alt="Switch On" />
                  ) : (
                    <img src="/assets/misc/Switch_off.svg" alt="Switch Off" />
                  )}
                </div>
                <p className="placeholder">Set Item Usage</p>
              </div>
              <div className="checkmark">
                <div
                  className="switch"
                  onClick={toggleSwitchDescription}
                  style={{ cursor: "pointer" }}
                >
                  {isDescriptionOn ? (
                    <img src="/assets/misc/Switch_on.svg" alt="Switch On" />
                  ) : (
                    <img src="/assets/misc/Switch_off.svg" alt="Switch Off" />
                  )}
                </div>
                <p className="placeholder">Set Description Visibility</p>
              </div>
              <div className="checkmark">
                <div
                  className="switch"
                  onClick={toggleSwitchPronunciation}
                  style={{ cursor: "pointer" }}
                >
                  {isPronunciationOn ? (
                    <img src="/assets/misc/Switch_on.svg" alt="Switch On" />
                  ) : (
                    <img src="/assets/misc/Switch_off.svg" alt="Switch Off" />
                  )}
                </div>
                <p className="placeholder">Set Pronunciation</p>
              </div>
              <div className="checkmark">
                <div
                  className="switch"
                  onClick={toggleSwitchReplay}
                  style={{ cursor: "pointer" }}
                >
                  {isReplayOn ? (
                    <img src="/assets/misc/Switch_on.svg" alt="Switch On" />
                  ) : (
                    <img src="/assets/misc/Switch_off.svg" alt="Switch Off" />
                  )}
                </div>
                <p className="placeholder">Set Allow Replay</p>
              </div>
              <div className="btn-container">
                <button
                  className="btn btn--large btn--danger--large"
                  onClick={() => navigate("/teacher/simulation_room")}
                >
                  Cancel
                </button>
                <button
                  className="btn btn--small btn--primary"
                  onClick={handleSubmit}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="tab-container">
      {/* <p className="txt-creategame">Create Game</p> */}
      <section className="tab-section">
        <div className="tab-btn-container">
          <div
            className={`tab-btn ${activeTab === "Spelling" ? "active" : ""}`}
            onClick={() => handleTabClick("Spelling")}
          >
            Spelling
          </div>
          <div
            className={`tab-btn ${activeTab === "Syllable" ? "active" : ""}`}
            onClick={() => handleTabClick("Syllable")}
          >
            Syllable
          </div>
          <div
            className={`tab-btn ${activeTab === "Silent" ? "active" : ""}`}
            onClick={() => handleTabClick("Silent")}
          >
            Silent
          </div>
        </div>
        {renderContent()}
      </section>
    </main>
  );
}
