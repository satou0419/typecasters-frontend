import React, { useState } from "react";
import "./components/tab.css";
import "./archive.css";

const wordList = [
  "Happy",
  "Jump",
  "Run",
  "House",
  "Water",
  "Sad",
  "Walk",
  "Skip",
  "Native",
  "Fire",
];

export default function Archive() {
  const [activeTab, setActiveTab] = useState("word");
  const [selectedWord, setSelectedWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderWordList = () => {
    const filteredWords = wordList.filter((word) =>
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
                    <div className="word-list">{renderWordList()}</div>
                  </div>
                </div>
              </div>
              <div className="book-spine"></div>
              <section className="right-page page-container">
                <div className="book-page book--container">
                  {selectedWord ? (
                    <div className="word-details">
                      <h2>{selectedWord}</h2>
                      <p>More information about {selectedWord}...</p>
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
              <img className="locked-badge" src="./images/locked-badge.png" alt="Locked Badge" />
            </div>
            <div className="locked-badge-container">
              <img className="locked-badge" src="./images/locked-badge.png" alt="Locked Badge" />
            </div>
            <div className="locked-badge-container">
              <img className="locked-badge" src="./images/locked-badge.png" alt="Locked Badge" />
            </div>
            <div title="Queen Bee" className="tooltip-wrapper">
              <div className="unlocked-badge-container">
                <img className="unlocked-badge" src="./images/unlocked-badge.png" alt="Unlocked Badge" />
              </div>
            </div>
            <div className="locked-badge-container">
              <img className="locked-badge" src="./images/locked-badge.png" alt="Locked Badge" />
            </div>
            <div className="locked-badge-container">
              <img className="locked-badge" src="./images/locked-badge.png" alt="Locked Badge" />
            </div>
            <div className="locked-badge-container">
              <img className="locked-badge" src="./images/locked-badge.png" alt="Locked Badge" />
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
            className={`tab-btn ${activeTab === "word" ? "active" : ""}`}
            onClick={() => handleTabClick("word")}
          >
            Word
          </div>
          <div
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
