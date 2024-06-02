import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardGame, CardArchive } from "./components/Card";
import "./components/card.css";
import "./dashboard.css";
import { fetchUserData } from "./api";
import { USER_TYPE } from "./Login";

export const USER_DETAILS_ID = "userDetailsID";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const storedUserDetails = JSON.parse(sessionStorage.getItem("userDetails")); // Define storedUserDetails
  const [userType, setUserType] = useState(sessionStorage.getItem(USER_TYPE));
  const [userDetailsID, setUserDetailsID] = useState();

  console.log(userType);
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      window.location.href = "/login";
    } else {
      // Fetch user data when component mounts
      fetchUserData(storedUserDetails.userID)
        .then((data) => {
          console.log("Retrieved User Data:", data);
          setUserData(data);

          // Correctly store user_detail_id in sessionStorage
          sessionStorage.setItem(USER_DETAILS_ID, data.user_detail_id);
          console.log("user_detail_id", data.user_detail_id);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  // Helper function to handle progress value
  const getProgressValue = (value) => {
    if (value === -1) return "";
    if (value > 0) return value - 1;
    return value;
  };

  return (
    <main className="dashboard-wrapper">
      <section className="game-card-wrapper">
        <Link to="/adventure_mode"
        id="view_adventure"
        >
          {/* Use userData for progressValue */}
          <CardGame
            title="Adventure"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing"
            progressTitle="Floor Completed"
            progressValue={
              userData ? getProgressValue(userData.userProgress.floorId) : ""
            }
            imageSrc="./assets/banner/banner_adventure.webp"
          />
        </Link>
        <Link to={`/${userType}/simulation_mode`}
        id="view_rooms"
        >
          <CardGame
            title="Room"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing"
            progressTitle="Room"
            progressValue={4} // Placeholder value, replace with actual data if available
            imageSrc="./assets/banner/banner_simulation.png"
          />
        </Link>
      </section>

      <Link to="/archive"
      id="view_archives"
      >
        <CardArchive
          title="Archive"
          content="Conquer the Towers! Collect Words and Badges in Adventure Mode"
          bannerSrc="./assets/banner/banner_adventure.webp"
          badgeProgress={userData && userData.achievement_count}
          wordProgress={userData && userData.words_collected}
        />
      </Link>
    </main>
  );
}
