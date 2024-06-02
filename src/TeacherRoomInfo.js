import React, { useState, useEffect } from "react";
import "./components/tab.css";
import "./teacherroominfo.css";
import { USER_ID } from "./Login";
import { CardStatus, CardSettingF2, CardSetting1F } from "./components/Card";
import { ROOM_ID, ROOM_CODE, ROOM_NAME } from "./SimulationMode-Teacher";
import { VIEW_ROOM_BY_ID, INSERT_STUDENT, GET_USER_ID_BY_USERNAME, UPDATE_ROOM, GET_USER_INFO_BY_ID } from "./api";

export default function TeacherRoomInfo(){
    const roomID = sessionStorage.getItem(ROOM_ID);
    const roomCode = sessionStorage.getItem(ROOM_CODE);
    const [roomName, setRoomName] = useState(sessionStorage.getItem(ROOM_NAME) || '');
    const [userID, setUserID] = useState(sessionStorage.getItem(USER_ID));
    const [roomData, setRoomData] = useState([]);
    const [username, setUsername] = useState();
    const [studentID, setStudentID] = useState();
    const [display, setDisplay] = useState([]);

    useEffect(() => {
        fetch(`${VIEW_ROOM_BY_ID}${roomID}`)
          .then((response) => response.json())
          .then((data) => {
            setRoomData(data);
            console.log("ROOOOOM:::::", data);
            fetchUsernames(data.members);
          })
          .catch((error) => console.error("Error fetching floors:", error));
    }, []);

    const fetchUsernames = async (memberIDs) => {
        try {
            const promises = memberIDs.map(memberID => {
                return fetch(`${GET_USER_INFO_BY_ID}${memberID}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        console.log(response);
                        
                        return response.json();
                    })
                    .then(data => data.username); // Assuming username is part of the response
            });

            const usernames = await Promise.all(promises);
            console.log(usernames);
            setDisplay(usernames);
        } catch (error) {
            console.error("Error fetching usernames:", error);
        }
    };

    const handleRoomUpdateName = (e) => {
        setRoomName(e.target.value);
        console.log(roomName);
    };

    const handleUpdateClick = async () => {
        try {
            const response = await fetch(UPDATE_ROOM, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomID: roomID,
                    roomName: roomName
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(roomName);
            sessionStorage.setItem(ROOM_NAME, roomName);

        } catch (error) {
            console.error("Error updating room:", error.message);
        }
    };

    // const handleDeleteClick = () => {
    //     setStudentID(fetchUserID(username));
    //     fetch(`${INSERT_STUDENT}${studentID}/room/${roomID}`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //     .then((response) => {
    //         if (!response.ok) {
    //           throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         return response.text();
    //     })
    //     .then((data) => {
    //         console.log("Response:", data);
    //     })
    //     .catch((error) => console.error("Error updating progress:", error));
    // };

    const handleUsernameChange = (e) => {
        const value = e.target.value; // Get the updated value from the event
        setUsername(value); // Update the username state
    
        // Since state updates are asynchronous, use `value` directly here if needed
        console.log(value);
    };


    const fetchUserID = async (username) => {
        try {
            const response = await fetch(`${GET_USER_ID_BY_USERNAME}${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStudentID(data);
        } catch (error) {
            console.error("Error fetching userID:", error);
        }
    };

    const handleJoinClick = () => {
        fetchUserID(username);

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

    // if (!roomData) {
    //     return <div>Loading...</div>;
    // }

    // if (!roomData.members) {
    //     return <div>Loading...</div>;
    // }
    
    return(
    <div className="main-container">    
        <div className="leftbox"> 
            <h3>Room Settings</h3>
            {Array.isArray(display) && display.map((member, index) => (
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
                        value={roomName}
                        onChange={handleRoomUpdateName}
                        //onBtn1Click={handleDeleteClick}
                        onBtn2Click={handleUpdateClick}
                        bannerSrc
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
                                Back
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