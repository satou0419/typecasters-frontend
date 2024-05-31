import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ALL_FLOORS_ENDPOINT, GET_USER_DETAILS_ENDPOINT } from "./api";
import "./adventuremode.css";

export const FLOOR_ID = "selectedFloor";
export const SECTION_PROGRESS = "sectionProgress";
export const PROGRESS_ID = "progressID";
export const NEXT_FLOOR = "nextFloor";
export const NEXT_SECTION = "nextSection";
export const CURRENT_FLOOR = "currentFloor";
export const CURRENT_SECTION = "currentSection";

export default function AdventureMode() {
  const [FLOOR_DATA, setFloorData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [progressID, setProgressID] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [nextFloor, setNextFloor] = useState();
  const [nextSection, setNextSection] = useState();
  const [currentFloor, setCurrentFloor] = useState();
  const [currentSection, setCurrentSection] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserDetailsString = sessionStorage.getItem("userDetails");
    if (storedUserDetailsString) {
      const storedUserDetails = JSON.parse(storedUserDetailsString);
      fetch(`${GET_USER_DETAILS_ENDPOINT}${storedUserDetails.userID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUserDetails(data);
          if (data.userProgress) {
            setSelectedFloor(data.userProgress.floorId);
            setCurrentFloor(data.userProgress.floorId);
            sessionStorage.setItem(CURRENT_FLOOR, data.userProgress.floorId);

            setSelectedSection(data.userProgress.towerSecProg);
            setCurrentSection(data.userProgress.towerSecProg);
            sessionStorage.setItem(
              CURRENT_SECTION,
              data.userProgress.towerSecProg
            );

            setProgressID(data.userProgress.userProgId);
            sessionStorage.setItem(PROGRESS_ID, data.userProgress.userProgId);
          }
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, []);

  useEffect(() => {
    fetch(GET_ALL_FLOORS_ENDPOINT)
      .then((response) => response.json())
      .then((data) => {
        setFloorData(data);
      })
      .catch((error) => console.error("Error fetching floors:", error));
  }, []);

  useEffect(() => {
    if (userDetails && FLOOR_DATA.length) {
      getNextFloorAndSection();
    }
  }, [userDetails, FLOOR_DATA]);

  const getNextFloorAndSection = () => {
    if (!userDetails || !FLOOR_DATA.length) {
      console.error("User details or floor data not available.");
      return;
    }

    const userFloorId = userDetails.userProgress?.floorId;
    const userSection = userDetails.userProgress?.towerSecProg;

    if (!userFloorId || !userSection) {
      console.error("User progress data incomplete.");
      return;
    }

    const userFloorIndex = FLOOR_DATA.findIndex(
      (floor) => floor.towerFloorId === userFloorId
    );
    const nextFloorIndex = userFloorIndex + 1;

    if (nextFloorIndex < FLOOR_DATA.length) {
      const nextFloor = FLOOR_DATA[nextFloorIndex].towerFloorId;
      const nextSection = FLOOR_DATA[nextFloorIndex].towerSection;
      setNextFloor(nextFloor);
      setNextSection(nextSection);
      sessionStorage.setItem(NEXT_FLOOR, nextFloor);
      sessionStorage.setItem(NEXT_SECTION, nextSection);
    } else {
      console.log("User has completed all floors.");
    }
  };

  const handleFloorClick = (floor) => {
    setSelectedFloor(floor);
    sessionStorage.setItem(FLOOR_ID, floor);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    sessionStorage.setItem(SECTION_PROGRESS, section);

    const sectionFloors = FLOOR_DATA.filter(
      (floor) => floor.towerSection === section
    );

    // Find the first unlocked floor of the section
    const firstUnlockedFloor = sectionFloors.find(
      (floor) => floor.towerFloorId <= currentFloor
    );

    if (firstUnlockedFloor) {
      setSelectedFloor(firstUnlockedFloor.towerFloorId);
      sessionStorage.setItem(FLOOR_ID, firstUnlockedFloor.towerFloorId);
    } else {
      console.error("All floors in this section are locked.");
    }
  };

  const handleEnterClick = () => {
    let selectedFloorData = selectedFloor;
    let selectedSectionData = selectedSection;

    if (!selectedFloorData || !selectedSectionData) {
      selectedFloorData = currentFloor;
      selectedSectionData = currentSection;
    }

    if (selectedFloorData && selectedSectionData && progressID) {
      const lockedFloor = selectedFloorData > currentFloor; // Check if the selected floor is locked

      if (lockedFloor) {
        console.error("You cannot enter a locked floor.");
        return; // Prevent navigation
      }

      sessionStorage.setItem(FLOOR_ID, selectedFloorData);
      sessionStorage.setItem(SECTION_PROGRESS, selectedSectionData);
      sessionStorage.setItem(PROGRESS_ID, progressID);

      console.log(
        "Navigating to: ",
        selectedFloorData,
        selectedSectionData,
        progressID
      );

      navigate("/adventure_spelling", {
        state: {
          floor: selectedFloorData,
          section: selectedSectionData,
          progressId: progressID,
        },
      });
    } else {
      console.error("Please select a floor and section before entering.");
    }
  };

  const renderProgressSections = () => {
    const uniqueSections = Array.from(
      new Set(FLOOR_DATA.map((floor) => floor.towerSection))
    );

    return uniqueSections.map((section) => {
      let sectionStatusClass;
      if (currentSection === null || section > currentSection) {
        sectionStatusClass = "section-locked";
      } else if (section === currentSection) {
        sectionStatusClass = "section-ongoing";
      } else {
        sectionStatusClass = "section-conquered";
      }

      return (
        <span
          key={section}
          className={`section ${sectionStatusClass}`}
          onClick={() => handleSectionClick(section)}
        >
          Section {section}
        </span>
      );
    });
  };

  const renderFloorCards = () => {
    if (selectedSection === null) return null;

    const sectionFloors = FLOOR_DATA.filter(
      (floor) => floor.towerSection === selectedSection
    );
    return sectionFloors.map((floor) => {
      const isLocked = currentFloor ? floor.towerFloorId > currentFloor : false;
      return (
        <div
          key={floor.towerFloorId}
          className={`floor-card ${isLocked ? "floor-card-locked" : ""} ${
            selectedFloor === floor.towerFloorId ? "selected" : ""
          }`}
          onClick={() => !isLocked && handleFloorClick(floor.towerFloorId)}
        >
          <div
            className={
              selectedFloor === floor.towerFloorId
                ? "floor-card-active"
                : "floor-card"
            }
          >
            Floor {floor.towerFloorId}
          </div>
        </div>
      );
    });
  };

  return (
    <main className="adventure-wrapper">
      <section className="upper-adventure">
        <Link to="/dashboard">
          <button 
          id="btn_back"
          className="btn btn--large btn--danger--large btnBack">
            Back
          </button>
        </Link>
        <section className="reward-box">
          <section className="floor-description">
            <div className="inner-box">
              <div className="desc-container">
                <p className="txt-floor">
                  {selectedFloor ? `Floor ${selectedFloor}` : "Select a Floor"}
                </p>
                <p className="txt-rewards">Rewards:</p>
                <div className="items-container">
                  <span className="txt-floor">COMING SOON</span>
                  {/* <div className="reward-item">
                    <div className="reward-item-container"></div>
                  </div>
                  <div className="reward-item">
                    <div className="reward-item-container"></div>
                  </div>
                  <div className="reward-item">
                    <div className="reward-item-container"></div>
                  </div> */}
                </div>
                <button
                  id="btn-enter"
                  className="btn btn--small btn--primary btn-enter"
                  onClick={handleEnterClick}
                >
                  Enter
                </button>
              </div>
            </div>
          </section>
        </section>
        <section className="tower-container">{renderFloorCards()}</section>
      </section>
      <section className="lower-adventure">
        <div className="progress">
          PROGRESS:
          {renderProgressSections()}
        </div>
      </section>
    </main>
  );
}
