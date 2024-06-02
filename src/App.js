import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./Login";
import Navigation from "./components/Navigation";
import Dashboard from "./Dashboard";
import Registration from "./Registration";
import Archive from "./Archive";
import InventoryShop from "./InventoryShop";
import GameplayAdventureSpelling from "./GameplayAdventureSpelling";
import { LOGOUT_ENDPOINT } from "./api";
import CreateRoom from "./CreateRoom";
import AdventureMode from "./AdventureMode";
import SimulationModeTeacher from "./SimulationMode-Teacher";
import SimulationRoomTeacher from "./SimulationRoom-Teacher";
import CreateGame from "./CreateGame";
import SimulationModeStudent from "./SimulationMode-Student";
import SimulationRoomStudent from "./SimulationRoom-Student";
import JoinRoom from "./JoinRoom";
import TeacherRoomSettings from "./TeacherRoomSettings";
import TeacherRoomInfo from "./TeacherRoomInfo";
import Settings from "./Settings";
import { CreditProvider } from "./CreditContext";
import SimulationGameplaySpelling from "./SimulationGameplaySpelling";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn");
    const storedUserDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    if (storedIsLoggedIn === "true" && storedUserDetails) {
      setIsLoggedIn(true);
      setUserDetails(storedUserDetails);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUserDetails(null);
        sessionStorage.removeItem("isLoggedIn");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showNavigation =
    isLoggedIn &&
    location.pathname !== "/adventure_spelling" &&
    location.pathname !== "/simulation_gameplay";

  const showAdventureSpelling =
    isLoggedIn || location.pathname !== "/adventure_spelling";

  const showSimulationSpelling =
    isLoggedIn || location.pathname !== "/simulation_gameplay";

  return (
    <CreditProvider>
      <>
        {showNavigation && <Navigation onLogout={handleLogout} />}

        <Routes>
          {isLoggedIn ? (
            <Route path="/" element={<Navigate to="/dashboard" />} />
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
          {isLoggedIn ? (
            <Route path="/login" element={<Navigate to="/dashboard" />} />
          ) : (
            <Route
              path="/login"
              element={
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  setUserDetails={setUserDetails}
                />
              }
            />
          )}
          {isLoggedIn ? (
            <Route
              path="/registration"
              element={<Navigate to="/dashboard" />}
            />
          ) : (
            <Route
              path="/registration"
              element={
                <Registration
                  setIsLoggedIn={setIsLoggedIn}
                  setUserDetails={setUserDetails}
                />
              }
            />
          )}
          {showAdventureSpelling && (
            <Route
              path="/adventure_spelling"
              element={<GameplayAdventureSpelling />}
            />
          )}

          {showSimulationSpelling && (
            <Route
              path="/simulation_gameplay"
              element={<SimulationGameplaySpelling />}
            />
          )}
          {isLoggedIn && (
            <>
              <Route
                path="/dashboard"
                element={<Dashboard userDetails={userDetails} />}
              />
              <Route path="/archive" element={<Archive />} />
              <Route path="/inventory_shop" element={<InventoryShop />} />
              <Route path="/adventure_mode" element={<AdventureMode />} />

              {/* Student Simulation */}
              <Route
                path="student/simulation_mode"
                element={<SimulationModeStudent />}
              />
              <Route
                path="student/simulation_room"
                element={<SimulationRoomStudent />}
              />

              <Route path="student/join_room" element={<JoinRoom />} />
              {/* End of Student Simulation */}

              {/* Teacher Simulation */}
              <Route
                path="teacher/simulation_mode"
                element={<SimulationModeTeacher />}
              />

              <Route path="teacher/create_room" element={<CreateRoom />} />

              <Route
                path="teacher/simulation_room"
                element={<SimulationRoomTeacher />}
              />

              <Route path="teacher/create_game" element={<CreateGame />} />

              <Route
                path="teacher/room_settings"
                element={<TeacherRoomSettings />}
              />
              <Route path="teacher/room_info" element={<TeacherRoomInfo />} />

              {/* End of Teacher Simulation */}
              <Route path="/Settings" element={<Settings />} />
            </>
          )}
        </Routes>
      </>
    </CreditProvider>
  );
}

export default App;
