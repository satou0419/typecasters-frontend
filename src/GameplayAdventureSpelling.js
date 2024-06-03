import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./components/Modal"; // Import the Modal component

import {
  API_KEY,
  AUDIO_PATH,
  GET_ENEMIES_BY_FLOOR_ID_ENDPOINT,
  GET_USER_ITEMS_ENDPOINT,
  INSERT_WORD_ARCHIVE,
  ITEM_USED,
  MERRIAM_API,
  UPDATE_USER_PROGRESS_ENDPOINT,
} from "./api";

import { USER_DETAILS_ID } from "./Dashboard";
import "./gameplay.css";
import "./components/animation.css";

import {
  FLOOR_ID,
  PROGRESS_ID,
  NEXT_FLOOR,
  NEXT_SECTION,
  CURRENT_FLOOR,
} from "./AdventureMode";

import { useNavigate } from "react-router-dom";
import StartModal from "./StartModal";

export default function GameplayAdventureSpelling() {
  //Flag as an initiator....
  //If flag is 0, don't render the data
  //If it is 1, fetch the data

  const userDetailsID = sessionStorage.getItem(USER_DETAILS_ID);
  const [nextPlay, setNextPlay] = useState(true);
  const [flag, setFlag] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigate = useNavigate(); //use to navigate to other pages

  //#region Floor and Progress Tracking

  const progressID = parseInt(sessionStorage.getItem(PROGRESS_ID), 10); // Gets the current progress ID

  const nextFloor = parseInt(sessionStorage.getItem(NEXT_FLOOR), 10); // Gets the next floor to conquer
  const nextSection = parseInt(sessionStorage.getItem(NEXT_SECTION), 10);

  const enteredFloor = parseInt(sessionStorage.getItem(FLOOR_ID), 10); // Gets the entered floor
  const currentFloor = parseInt(sessionStorage.getItem(CURRENT_FLOOR), 10); // Gets the current floor
  const isCleared = enteredFloor < currentFloor; // Checks if the it is a cleared floor
  const [isConquered, setIsConquered] = useState(false); // Checks if the floor has been conquered
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    console.log("Enter: ", enteredFloor);
    console.log("Current: ", currentFloor);
    console.log("DDD", userDetailsID);
  }, [enteredFloor]);

  useEffect(() => {
    console.log("CLEAR:::", isCleared);
    console.log("INSERT:::", insertWord);
  });

  // Handling Conquered conditions
  // If it is conquered but and not yet cleared, then save the progress
  // If conquered but has been already cleared, redirect to AdventureSpelling component
  useEffect(() => {
    if (isConquered === true && isCleared === false) {
      fetch(`${UPDATE_USER_PROGRESS_ENDPOINT}${progressID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          towerSecProg: nextSection,
          floorId: nextFloor,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text(); // Read response as text
        })
        .then((data) => {
          console.log("Response:", data); // Log the response received from the server
          if (data === "User Progress Updated!") {
            console.log("Updated Progress: Updated Successful");
            // Navigate after 3 seconds
            setTimeout(() => {
              navigate("/adventure_mode");
            }, 3000);
          } else {
            console.error(
              "Error updating progress: Unexpected response -",
              data
            );
          }
        })
        .catch((error) => console.error("Error updating progress:", error));
    } else if (isConquered === true && isCleared === true) {
      console.log("Floor already conquered!!!");
    }
  }, [isConquered]);

  //#endregion

  //#region Input Management
  const [inputDisabled, setInputDisabled] = useState(false); // State to disable the input
  const [goButtonDisabled, setGoButtonDisabled] = useState(false); // State to disable the GO! button
  const [audioButtonDisabled, setAudioButtonDisabled] = useState(false); // State to disable the audio button
  const [userInput, setUserInput] = useState(""); // State to store user input
  const [autoFocusValue, setAutoFocusValue] = useState(true);
  const inputRef = useRef(null); // Create a ref for the input element

  const disableInputs = () => {
    setGoButtonDisabled(true);
    setAudioButtonDisabled(true);
    setInputDisabled(true);
  };

  const enableInputs = () => {
    setGoButtonDisabled(false);
    setAudioButtonDisabled(false);
    setInputDisabled(false);

    // Check if completed state is false before setting focus
    if (!completed && inputRef.current) {
      inputRef.current.focus(); // Focus on the input
    }
  };

  //#endregion

  //#region Animation Management
  const [animateShake, setAnimateShake] = useState("");
  const [isEnemyHit, setEnemyIsHit] = useState(""); // State to manage if character is hit
  const [isMainHit, setMainIsHit] = useState(false); // State to manage if character is hit
  const [enemyState, setEnemyState] = useState({
    className: "idle-spring",
    style: {},
  });
  const [mainState, setMainState] = useState({
    className: "idle-main",
    style: {},
  });

  const mainAttackAnimation = () => {
    setMainState({
      className: "attack-main",
      style: {
        transform: "translateX(550px)",
        height: "408px",
        width: "calc(8568px/21)",
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
          setNextPlay(true);
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
          setNextPlay(true);
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
        // setTimeout(() => {
        //   setNextPlay(true);
        // }, 1500);
        console.log("Incorrect Word:", userInput);

        // Enable input and refocus after animation completes
        setTimeout(() => {
          inputRef.current && inputRef.current.focus(); // Focus on the input if it exists
        }, 100); // Adjust the delay as needed

        // Enable buttons after animation completes

        if (hearts === 1) {
          setGameOver(true);
        }
      }, 500);
    }, 1500);
  };
  //#endregion

  //#region User Items Management
  const [userItems, setUserItems] = useState([]);
  useEffect(() => {
    if (flag === 1) {
      const storedUserDetails = JSON.parse(
        sessionStorage.getItem("userDetails")
      );
      if (storedUserDetails) {
        console.log("User ID: ", storedUserDetails.userID);
        setUserID(storedUserDetails.userID);

        // Fetch user items using userID
        fetch(`${GET_USER_ITEMS_ENDPOINT}${storedUserDetails.userID}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("User items:", data);
            // Store the fetched user items in state variable
            setUserItems(data);
          })
          .catch((error) => console.error("Error fetching user items:", error));
      }
    }
  }, [flag]);
  //#endregion

  const [hearts, setHearts] = useState(6); // State to store remaining heart count
  const [gameOver, setGameOver] = useState(false); // State to track game over
  const [enemies, setEnemies] = useState([]);

  //#region Archive Management
  const [userID, setUserID] = useState();
  const [isCorrect, setIsCorrect] = useState(false);
  const [insertWord, setInsertWord] = useState(false);
  const [currentWord, setCurrentWord] = useState();

  useEffect(() => {
    console.log("Insert Word Status: ", insertWord);
    console.log("IS CLEARED: ", isCleared);

    if (insertWord === true && isCleared == false) {
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
  }, [insertWord]);

  useEffect(() => {
    if (flag === 0) {
      disableInputs();
    }
  }, [flag]);

  //#endregion

  const handleStartClick = () => {
    setFlag(1);
    setIsModalVisible(false);
  };

  //#region Reload Management
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault(); // Prevent the default browser unload behavior
      event.returnValue = ""; // A standard way to trigger the browser's built-in navigation confirmation dialog
      // You can try setting a custom message like "You have unsaved changes!" but modern browsers might not display it.
      return "You have unsaved changes!"; // This may not work in all browsers but is still recommended
    };

    // Adding the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array ensures this effect is only run on mount and unmount
  //#endregion
  //#region Merriam Management

  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWordData, setCurrentWordData] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioElement, setAudioElement] = useState(null);

  const fetchWordDefinition = async (word) => {
    try {
      const url = `${MERRIAM_API}${word}?key=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        const pronunciation = firstResult.hwi?.prs[0]?.mw || "";
        const definition =
          firstResult.def?.[0]?.sseq?.[0]?.[0]?.[1]?.dt?.[0]?.[1] ||
          "No definition found";
        const audio = firstResult.hwi?.prs[0]?.sound?.audio;

        const subdirectory = audio?.startsWith("bix")
          ? "bix"
          : audio?.startsWith("gg")
          ? "gg"
          : audio?.match(/^[^a-zA-Z]/)
          ? "number"
          : audio?.charAt(0);

        const audioUrl = audio
          ? `${AUDIO_PATH}${subdirectory}/${audio}.mp3`
          : "";

        setCurrentWordData({ pronunciation, definition });
        setAudioUrl(audioUrl);
      } else {
        setCurrentWordData({
          pronunciation: "",
          definition: "Word is not available.",
        });
        setAudioUrl("");
        console.log(`Current Word: ${word} is not available`);
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
      setCurrentWordData({
        pronunciation: "",
        definition: "Error fetching the definition.",
      });
      setAudioUrl("");
      console.error("Fetch word definition error:", error);
    }
  };

  //#endregion

  // Effect to fetch enemies when enteredFloor changes
  useEffect(() => {
    if (flag === 1 && enteredFloor) {
      disableInputs();
      fetchEnemies(enteredFloor);
    }
  }, [enteredFloor, flag]);

  // Effect to fetch word definition when enemies or currentEnemyIndex changes
  useEffect(() => {
    if (
      flag === 1 &&
      enemies.length > 0 &&
      currentEnemyIndex < enemies.length
    ) {
      const enemy = enemies[currentEnemyIndex];
      const words = enemy.words;
      if (words.length > 0) {
        setCurrentWordIndex(0);
        fetchWordDefinition(words[0]);
      }

      // Logging enemy and words
      console.log(`Enemy ${enemy.enemyId}:`);
      words.forEach((word, index) => {
        console.log(`${index + 1}. ${word}`);
        setCurrentWord(word);
      });
    }
  }, [enemies, currentEnemyIndex, flag]);

  // Effect to handle audioUrl changes
  useEffect(() => {
    const handleAudioEnded = () => {
      console.log("Audio playback ended");
      setNextPlay(false);
      enableInputs();
    };

    if (nextPlay === true) {
      if (audioUrl && audioElement) {
        if (isCorrect === true) {
          setUserInput("");
        }
        console.log("Audio playback started"); // Log when audio playback starts
        audioElement.src = audioUrl;
        audioElement.play();
        setInputDisabled(false);
        if (inputRef.current) {
        }
        setAutoFocusValue(true);

        // Add event listener for 'ended' event
        audioElement.addEventListener("ended", handleAudioEnded);
      }
    }
    // Cleanup function to remove the event listener
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, [audioUrl, audioElement, nextPlay, isCorrect]); // Include audioElement as a dependency

  // Effect to create audio element
  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);

    return () => {
      audio.pause();
    };
  }, []);

  // Function to fetch enemies
  const fetchEnemies = (floorId) => {
    const endpoint = `${GET_ENEMIES_BY_FLOOR_ID_ENDPOINT}?floor_id=${floorId}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setEnemies(data);
      })
      .catch((error) => {
        console.error("Error fetching enemies:", error);
      });
  };

  //#region Handling Answer

  const handleGoClick = () => {
    //#region Empty Answer
    if (userInput.trim() === "") {
      // Alert the user or handle the empty input case
      console.log("Please enter a word before submitting.");
      setAnimateShake("animate-shake");
      setTimeout(() => {
        if (!completed) {
          // Use optional chaining to safely access inputRef.current
          setAnimateShake(""); // Set animateShake only if inputRef.current exists and game is not completed
        }
      }, 500);
      setTimeout(() => {
        if (!completed) {
          // Use optional chaining to safely access inputRef.current
          enableInputs();
        }
      }, 500);

      return;
    }

    const incrementScore = () => {
      setScore((prevScore) => prevScore + 1);
    };

    const words = enemies[currentEnemyIndex].words;
    const currentWord = words[currentWordIndex];

    if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
      // Correct word handling

      incrementScore();
      setInsertWord(true);
      mainAttackAnimation();
      setIsCorrect(true);
      // setFlag(0);
      setInsertWord(true);
      console.log("Insert Status: ", insertWord);
      setPronunciationStatus({
        className: "text-pronunciation-lock",
      });

      setTimeout(() => {
        // Enable input, set focus after animation completes
        setTimeout(() => {
          setInputDisabled(false);
        }, 1500);

        // Check if all words of the enemy are defeated
        if (currentWordIndex === words.length - 1) {
          setInsertWord(true);
          // setFlag(0);

          console.log(
            `Enemy ${enemies[currentEnemyIndex].enemyId} defeated! Total words: ${words.length}`
          );
          if (currentEnemyIndex < enemies.length - 1) {
            setCurrentEnemyIndex(currentEnemyIndex + 1);
            setEnemyState({
              className: "explode",
              style: { height: "128px", width: "calc(1536px / 12)" },
            });

            setTimeout(() => {
              setEnemyState({
                className: "idle-spring",
              });
            }, 3500);
          } else {
            console.log("All enemies are defeated!");
            // Add logic for completing the game if needed
            setIsConquered(true);
            setCompleted(true);
            setGameOver(true);
          }
        }
      }, 1500);

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        fetchWordDefinition(words[currentWordIndex + 1]);
      }

      // Disable input, GO! button, and audio button
      disableInputs();
    } else {
      setIsCorrect(false);
      if (isCorrect === false) {
        mainAttackAnimation(); // Start mainAttackAnimation

        // Wait for mainAttackAnimation to complete before starting springEnemyAttackAnimation
        setTimeout(() => {
          springEnemyAttackAnimation(); // Start springEnemyAttackAnimation after a delay
        }, 2300 /* duration of mainAttackAnimation */);
      }

      // Disable inputs and buttons during the animation
      // disableInputs();
    }
  };
  //#endregion

  const handleAudioClick = () => {
    if (audioUrl && audioElement) {
      audioElement.src = audioUrl;
      audioElement.play();
      setTimeout(() => {
        setInputDisabled(false);
      }, 500);
    }
  };

  const [itemID, setItemID] = useState();
  const [pronunciationStatus, setPronunciationStatus] = useState({
    className: "text-pronunciation-lock",
    style: {},
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsItemModalVisible(true);
    // console.log("Item clicked:", itemId);
    // const id = itemId.itemId;
    setItemID(item.itemId.itemId);
    // console.log("id", id);
  };
  // Assuming you have the userID available

  // useEffect(() => {
  //   console.log(itemID);
  // });
  // Define the data to send in the POST request
  const confirmItemUse = () => {
    if (selectedItem) {
      const id = selectedItem.itemId;
      const postData = {
        userID: userID,
        itemID: selectedItem.itemId,
      };

      // Make the POST request
      fetch(`${ITEM_USED}/${userID}/${itemID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to use item");
          }
          console.log("Item used successfully");
          // Update the quantity of the used item in the userItems state
          const updatedUserItems = userItems.map((item) => {
            if (item.itemId === selectedItem.itemId) {
              return {
                ...item,
                item: item.quantity - 1, // Decrease the quantity by 1 after using the item
              };
            }
            return item;
          });
          setUserItems(updatedUserItems); // Update the userItems state with the updated quantity

          // Handle item effects locally
          if (selectedItem.itemId === 1) {
            setHearts((prevHearts) => Math.min(prevHearts + 1, 6));
            console.log("Heart added!");
          } else if (selectedItem.itemId === 2) {
            setHearts((prevHearts) => Math.min(prevHearts + 3, 6));
            console.log("Hearts added!");
          } else if (selectedItem.itemId === 3) {
            setPronunciationStatus({
              className: "",
            });
          }
        })
        .catch((error) => {
          console.error("Error using item:", error);
        })
        .finally(() => {
          setIsItemModalVisible(false);
          setSelectedItem(null);
        });
    }
  };

  const cancelItemUse = () => {
    setIsItemModalVisible(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        navigate("/adventure_mode");
      }, 5000);

      // Cleanup the timeout if the component unmounts or if gameOver changes
      return () => clearTimeout(timer);
    }
  }, [gameOver, navigate]);

  //#region JSX
  // Render game over message if game over
  if (gameOver) {
    return (
      <div className="game-over">
        <span>Game Over</span>
        <span>{score}</span>
      </div>
    );
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleGoClick();
    }
  };

  return (
    <main className="gameplay-container">
      <StartModal isVisible={isModalVisible} onConfirm={handleStartClick} />
      {/* Rest of your component */}
      <div className="floor_indicator">
        <span>FLOOR {enteredFloor}</span>
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
            <div className="item-wrapper">
              {userItems.map((item) => (
                <div
                  key={item.userItemId}
                  className="item-container"
                  onClick={() => handleItemClick(item)} // Add onClick handler
                >
                  <img
                    src={`./assets/items/${item.itemId.image_path}`}
                    alt={item.item_name}
                  />
                  <div className="item-qty">{`${item.quantity}x`}</div>
                </div>
              ))}
              {[...Array(3 - userItems.length)].map((_, index) => (
                <div key={`default-${index}`} className="item-container"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="control-input">
          <div className="input-wrapper">
            <button
              className="btn btn--small btn--primary btn-audio"
              onClick={handleAudioClick}
              disabled={audioButtonDisabled}
            >
              Audio
            </button>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              autoFocus={autoFocusValue}
              onKeyDown={handleKeyDown}
              disabled={inputDisabled}
              className={`input-answer ${animateShake}`}
              ref={inputRef}
            />
            <button
              className="btn btn--medium btn--primary btn-go"
              onClick={handleGoClick}
              disabled={goButtonDisabled}
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
              <h3 id="lbl_word_info">Word Info's</h3>
              <span className="lbl_pronunciation">Pronunciation</span>
              <div
                className={`text-pronunciation ${pronunciationStatus.className}`}
              >
                <span>{currentWordData?.pronunciation.toString()}</span>
              </div>
              <span className="lbl_definition">Definition</span>
              <div className="text-definition">
                {currentWordData?.definition.toString()}
              </div>
            </div>
          </div>
        </div>
      </section>
      {isItemModalVisible && (
        <Modal
          modalTitle="Confirm Item Use"
          modalContent="Do you want to use this item?"
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Confirm"
          cancelClick={cancelItemUse}
          confirmClick={confirmItemUse}
        />
      )}
    </main>
  );
}
