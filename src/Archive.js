import React, { useEffect, useState } from "react";
import "./components/tab.css";
import "./archive.css";
import {
  API_KEY,
  AUDIO_PATH,
  GET_ARCHIVE_WORD_ENDPOINT,
  MERRIAM_API,
  VIEW_WORD_ARCHIVE,
} from "./api";
import { USER_ID } from "./Login";

export default function Archive() {
  const [activeTab, setActiveTab] = useState("word");
  const [selectedWord, setSelectedWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userID, setUserID] = useState(sessionStorage.getItem(USER_ID));
  const [wordArchive, setWordArchive] = useState([]);
  const [currentWordData, setCurrentWordData] = useState({
    pronunciation: "",
    definition: "",
  });
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    fetch(`${VIEW_WORD_ARCHIVE}${userID}`)
      .then((response) => response.json())
      .then((data) => {
        const words = data.map((item) => item.word);
        setWordArchive(words);
      })
      .catch((error) => console.error("Error fetching archive word:", error));
  }, [userID]);

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
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
      setCurrentWordData({
        pronunciation: "",
        definition: "Error fetching the definition.",
      });
      setAudioUrl("");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleWordClick = async (word) => {
    setSelectedWord(word);
    await fetchWordDefinition(word);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderWordList = () => {
    const filteredWords = wordArchive.filter((word) =>
      word.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredWords.map((word) => (
      <p
        key={word}
        className={selectedWord === word ? "word-selected" : ""}
        onClick={() => handleWordClick(word)}
      >
        {word}
      </p>
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "word":
        return (
          <div className="tab-content">
            <section className="book-container">
              <div className="left-page page-container">
                <div className="book-page">
                  <div className="left-content">
                    <div className="word-search">
                      <input
                        type="text"
                        className="input input-line input-line--light search--word"
                        placeholder="Search words"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div 
                    id="word_list"
                    className="word-list">{renderWordList()}</div>
                  </div>
                </div>
              </div>
              <div className="book-spine"></div>
              <section className="right-page page-container">
                <div className="book-page book--container">
                  {selectedWord ? (
                    <div className="word-details">
                      <h2>{selectedWord}</h2>
                      <p>
                        {currentWordData.pronunciation &&
                          `[${currentWordData.pronunciation}]`}
                        {audioUrl && (
                          <button
                            id="btn_audio"
                            className="btn btn--small btn--primary"
                            onClick={() => new Audio(audioUrl).play()}
                          >
                            AUDIO
                          </button>
                        )}
                      </p>
                      <h1>DEFINITION</h1>
                      <p>{currentWordData.definition}</p>
                    </div>
                  ) : (
                    <p>Select a word to see more details.</p>
                  )}
                </div>
              </section>
            </section>
          </div>
        );
      case "achievement":
        return (
          <div className="tab-content achievement-archive">
            <div className="locked-badge-container">
              <img
                className="locked-badge"
                src="./images/locked-badge.png"
                alt="Locked Badge"
              />
            </div>
            <div className="locked-badge-container">
              <img
                className="locked-badge"
                src="./images/locked-badge.png"
                alt="Locked Badge"
              />
            </div>
            <div className="locked-badge-container">
              <img
                className="locked-badge"
                src="./images/locked-badge.png"
                alt="Locked Badge"
              />
            </div>
            <div title="Queen Bee" className="tooltip-wrapper">
              <div className="unlocked-badge-container">
                <img
                  className="unlocked-badge"
                  src="./images/unlocked-badge.png"
                  alt="Unlocked Badge"
                />
              </div>
            </div>
            <div className="locked-badge-container">
              <img
                className="locked-badge"
                src="./images/locked-badge.png"
                alt="Locked Badge"
              />
            </div>
            <div className="locked-badge-container">
              <img
                className="locked-badge"
                src="./images/locked-badge.png"
                alt="Locked Badge"
              />
            </div>
            <div className="locked-badge-container">
              <img
                className="locked-badge"
                src="./images/locked-badge.png"
                alt="Locked Badge"
              />
            </div>
          </div>
        );
      default:
        return <div className="tab-content">Select a tab</div>;
    }
  };

  return (
    <main className="tab-container">
      <section className="tab-section">
        <div className="tab-btn-container">
          <div
            id="btn_word"
            className={`tab-btn ${activeTab === "word" ? "active" : ""}`}
            onClick={() => handleTabClick("word")}
          >
            Word
          </div>
          <div
            id="btn_achievement"
            className={`tab-btn ${activeTab === "achievement" ? "active" : ""}`}
            onClick={() => handleTabClick("achievement")}
          >
            Achievement
          </div>
        </div>

        {renderContent()}
      </section>
    </main>
  );
}
