import React, { useState, useEffect } from "react";
import "./components/tab.css";
import "./teacherroominfo.css";
import { USER_ID } from "./Login";
import { CardStatus, CardSettingF2, CardSetting1F } from "./components/Card";
import { ROOM_ID, ROOM_CODE, ROOM_NAME } from "./SimulationMode-Teacher";
import { VIEW_ROOM_BY_ID, INSERT_STUDENT, GET_USER_ID_BY_USERNAME } from "./api";

export default function TeacherRoomInfo(){
    const roomID = sessionStorage.getItem(ROOM_ID);
    const roomCode = sessionStorage.getItem(ROOM_CODE);
    const roomName = sessionStorage.getItem(ROOM_NAME);
    const [userID, setUserID] = useState(sessionStorage.getItem(USER_ID));
    const [roomData, setRoomData] = useState([]);
    const [username, setUsername] = useState();
    const [studentID, setStudentID] = useState();

    useEffect(() => {
        fetch(`${VIEW_ROOM_BY_ID}${roomID}`)
          .then((response) => response.json())
          .then((data) => {
            setRoomData(data);
            console.log("ROOOOOM:::::", data);
          })
          .catch((error) => console.error("Error fetching floors:", error));
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        console.log(username);
    };


      const fetchUserID = async (username) => {
        try {
            const response = await fetch(`${GET_USER_ID_BY_USERNAME}${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.userID;
        } catch (error) {
            console.error("Error fetching userID:", error);
        }
    };

    const handleJoinClick = () => {
        setStudentID(fetchUserID(username));
        fetch(`${INSERT_STUDENT}${studentID}/room/${roomID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.text();
        })
        .then((data) => {
            console.log("Response:", data);
        })
        .catch((error) => console.error("Error updating progress:", error));
    };
    
    return(
    <div className="main-container">    
        <div className="leftbox"> 
            <h3>Room Settings</h3>
            {roomData.members.map((member, index) => (
                <section className="cardstatus" key={index}>
                    <CardStatus
                        title={`${member}`} 
                        content="username"
                        bannerSrc="./assets/banner/banner_adventure.webp"
                    />
                </section>
            ))}
        </div>

      <div className="rightbox-info ">
                <section className="info-settings">
                <CardSetting1F
                    title="Settings"
                    placeholder="Update Room Name"
                    btnText1="Delete"
                    btnText2="Save"
                    // onBtn1Click={handleBtn1Click}
                    // onBtn2Click={handleBtn2Click}
                />
                </section>
                <section className="card card-setting card-setting--1f lower-box">
                    <h2 className="card-setting__heading">Add Students</h2>
                    <div className="card-setting__input-container">
                        <input
                            type="text"
                            className="input input-box"
                            placeholder="Add Students"
                            value={username}
                            onChange={handleUsernameChange}
                        />

                        <div className="card-setting__btn-group">
                            <button 
                                className="btn btn--small btn--primary add-btn" 
                                onClick={handleJoinClick}>
                                Add
                            </button>
                        </div>

                        <div className="btn-group-out">
                            <button className="btn btn--small btn--danger">
                                Remove
                            </button>
                            
                            <button className="btn btn--small btn--primary save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                </section>
      </div>
    </div>  
    );
}