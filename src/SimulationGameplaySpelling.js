import React, { useState, useEffect } from "react";
import { MERRIAM_API, API_KEY, AUDIO_PATH } from "./api";
import Modal from "./StartModal";
import GameOverModal from "./GameOverModal";
import { SIMULATION_GAMEPLAY } from "./api";
import { useNavigate } from "react-router-dom";
import { SIMULATION_ID } from "./SimulationRoom-Student";
import { USER_ID } from "./Login";
import { INSERT_WORD_ARCHIVE } from "./api";
import { USER_DETAILS_ID } from "./Dashboard";
export default function SimulationGameplaySpelling() {
  const userDetailsID = sessionStorage.getItem(USER_DETAILS_ID);
  const [currentWord, setCurrentWord] = useState();
  const [flag, setFlag] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isGameOverModalVisible, setIsGameOverModalVisible] = useState(false);
  const navigate = useNavigate();

  const [isCorrect, setIsCorrect] = useState(false);
  const [getSimulation, setGetSimulation] = useState([]);
  const [simulationID] = useState(sessionStorage.getItem(SIMULATION_ID));
  const [insertWord, setInsertWord] = useState(false);
  const [animateShake, setAnimateShake] = useState("");
  const [isEnemyHit, setEnemyIsHit] = useState("");
  const [isMainHit, setMainIsHit] = useState(false);
  const [enemyState, setEnemyState] = useState({
    className: "idle-spring",
    style: {},
  });
  const [mainState, setMainState] = useState({
    className: "idle-main",
    style: {},
  });

  const [hearts, setHearts] = useState(6);
  const [gameOver, setGameOver] = useState(false);

  const [pronunciationStatus, setPronunciationStatus] = useState({
    className: "text-pronunciation",
    style: {},
  });

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordData, setWordData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // New states for spell-check functionality
  const [userInput, setUserInput] = useState("");
  const [isCorrectSpelling, setIsCorrectSpelling] = useState(true);

  useEffect(() => {
    const fetchWordData = async () => {
      if (currentWordIndex >= 10 || hearts <= 0) {
        setGameOver(true);
        setIsGameOverModalVisible(true);
        return;
      }

      if (getSimulation.words && getSimulation.words.length > 0) {
        const currentWord = getSimulation.words[currentWordIndex].word;
        fetchWordDefinition(currentWord);
        setCurrentWord(currentWord);
        setInsertWord(true);
      }
    };

    if (flag === 1) {
      fetch(`${SIMULATION_GAMEPLAY}${simulationID}`)
        .then((response) => response.json())
        .then((data) => setGetSimulation(data))
        .catch((error) => console.error("Error fetching room data:", error));
    }

    fetchWordData();
  }, [flag, getSimulation, currentWordIndex]);

  useEffect(() => {
    if (insertWord === true) {
      console.log("UserID Type", typeof userID);
      console.log("Current Word", currentWord);

      fetch(`${INSERT_WORD_ARCHIVE}/${userDetailsID}/${currentWord}`, {
        method: "POST", // Use POST method for inserting data
      })
        .then((response) => {
          console.log("Response status:", response.status);
          return response.text(); // or response.json() if the response is expected to be JSON
        })
        .then((data) => {
          setInsertWord(false);
          console.log("Response data:", data);
          // Handle the response data
        })
        .catch((error) => {
          if (error instanceof TypeError) {
            console.error("Network error:", error.message);
          } else {
            console.error("Error fetching data:", error.message);
          }
        });
    }
  }, [flag]);

  useEffect(() => {
    playAudio(); // Call playAudio when component mounts
  }, []);

  useEffect(() => {
    playAudio(); // Call playAudio when audioUrl changes
  }, [audioUrl]);

  const handleStartClick = () => {
    setFlag(1);
    setIsModalVisible(false);
  };

  const mainAttackAnimation = () => {
    setMainState({
      className: "attack-main",
      style: {
        transform: "translateX(550px)",
        height: "369px",
        width: "calc(7004px/21)",
      },
    });

    if (isCorrect === true) {
      setTimeout(() => {
        setEnemyIsHit("hit");
        setTimeout(() => {
          setEnemyIsHit("");
        }, 500);
      }, 1300);
      setTimeout(() => {
        setMainState({
          className: "idle-main",
          style: { transform: "translateX(0px)" },
        });
        console.log("Main attack ends");

        setTimeout(() => {
          loadNextWord();
        }, 1500);
      }, 1750);
    } else {
      setTimeout(() => {
        setMainState({
          className: "idle-main",
          style: { transform: "translateX(0px)" },
        });
        console.log("Main attack ends");

        setTimeout(() => {
          loadNextWord();
        }, 1500);
      }, 1750);
    }
  };

  const springEnemyAttackAnimation = () => {
    setEnemyState({
      className: "attack",
      style: { transform: "translateX(-550px)" },
    });

    setTimeout(() => {
      setMainIsHit("hit");
      setTimeout(() => {
        setMainIsHit("");
      }, 500);
    }, 1300);

    setTimeout(() => {
      setEnemyState({
        className: "idle-spring",
        style: { transform: "translateX(0px)" },
      });

      setTimeout(() => {
        setHearts((prevHearts) => prevHearts - 1);
        console.log("Enemy attack ends");

        if (hearts === 1) {
          setGameOver(true);
          setIsGameOverModalVisible(true);
        } else {
          setTimeout(() => {
            loadNextWord();
          }, 1500);
        }
      }, 500);
    }, 1500);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    setIsCorrectSpelling(true); // Reset spelling correctness when user types
  };

  const handleGoClick = () => {
    const correctSpelling = getSimulation.words[currentWordIndex].word;
    const isCorrect =
      userInput.toLowerCase().trim() === correctSpelling.toLowerCase().trim();
    setIsCorrectSpelling(isCorrect);
    setIsCorrect(isCorrect); // Set isCorrect state

    if (isCorrect) {
      mainAttackAnimation();
    } else {
      springEnemyAttackAnimation();
    }
  };

  const loadNextWord = () => {
    setCurrentWordIndex((prevIndex) => prevIndex + 1);
    setUserInput("");
  };

  const fetchWordDefinition = async (word) => {
    try {
      const url = `${MERRIAM_API}${word}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        const pronunciation = firstResult.hwi?.prs[0]?.mw || "";

        const definitions = firstResult.def.map((definitionObj) => {
          return definitionObj.sseq[0][0][1].dt[0][1];
        });

        const definition = definitions.join(", ");

        setWordData({ pronunciation, definition });

        if (firstResult.hwi?.prs[0]?.sound?.audio) {
          const audio = firstResult.hwi.prs[0].sound.audio;
          const subdirectory = audio.startsWith("bix")
            ? "bix"
            : audio.startsWith("gg")
            ? "gg"
            : audio.match(/^[^a-zA-Z]/)
            ? "number"
            : audio.charAt(0);
          const audioUrl = audio
            ? `${AUDIO_PATH}${subdirectory}/${audio}.mp3`
            : "";
          setAudioUrl(audioUrl);
        }
      } else {
        setWordData({
          pronunciation: "",
          definition: "Word is not available.",
        });
        setAudioUrl("");
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
      setWordData({
        pronunciation: "",
        definition: "Error fetching the definition.",
      });
      setAudioUrl("");
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio
        .play()
        .then(() => console.log("Audio is playing"))
        .catch((error) => console.error("Error playing audio:", error));
    } else {
      console.error("No audio URL available");
    }
  };

  const handleGameOverConfirm = () => {
    navigate("/student/simulation_room");
  };

  return (
    <main className="gameplay-container">
      <Modal isVisible={isModalVisible} onConfirm={handleStartClick} />
      <GameOverModal
        isVisible={isGameOverModalVisible}
        score={currentWordIndex}
        onConfirm={handleGameOverConfirm}
      />
      <div className="floor_indicator">
        <span>Simulation {simulationID}</span>
      </div>

      <section className="gameplay-platform">
        <div
          className={`${mainState.className} ${isMainHit} character character-main`}
          style={mainState.style}
        ></div>
        <div
          className={`${enemyState.className} ${isEnemyHit} character  character-enemy`}
          style={enemyState.style}
        ></div>
      </section>

      <section className="gameplay-control">
        <img
          className="border"
          src="./assets/misc/border_control.webp"
          alt="Decorative border"
        />

        <div className="control-item">
          <div className="control-item-container">
            <div className="item-wrapper"></div>
          </div>
        </div>

        <div className="control-input">
          <div className="input-wrapper">
            <button
              className="btn btn--small btn--primary btn-audio"
              onClick={playAudio}
            >
              Audio
            </button>
            <input
              type="text"
              className={`input-answer ${animateShake}`}
              value={userInput}
              onChange={handleInputChange}
            />
            <button
              className="btn btn--medium btn--primary btn-go"
              onClick={handleGoClick}
              disabled={!isCorrectSpelling}
            >
              GO!
            </button>
            <div className="lives-container">
              {[...Array(6 - hearts)].reverse().map((_, index) => (
                <img
                  key={index}
                  src="./assets/icon/ic_lost_heart.png"
                  alt="Lost Heart Icon"
                />
              ))}
              {[...Array(hearts)].map((_, index) => (
                <img
                  key={index}
                  src="./assets/icon/ic_heart.png"
                  alt="Heart Icon"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="control-clue">
          <div className="control-clue-container">
            <div className="clue-wrapper">
              <h3>Word Info's</h3>
              <span className="lbl_pronunciation">Pronunciation</span>
              <div
                className={`text-pronunciation ${pronunciationStatus.className}`}
              >
                <span>{wordData ? wordData.pronunciation : ""}</span>
              </div>
              <span className="lbl_definition">Definition</span>
              {wordData && (
                <div className="text-definition">{wordData.definition}</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
