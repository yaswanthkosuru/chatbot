import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const RoomForm = () => {
  const [userRooms, setUserRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserRooms();
  }, []);

  const fetchUserRooms = async () => {
    try {
      const token = sessionStorage.getItem("admintoken");
      const response = await axios.get("http://127.0.0.1:8000/userrooms/", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setUserRooms(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user rooms:", error);
    }
  };

  const handleJoinRoom = (roomId) => {
    // Add logic here to handle joining the room
    console.log("Joining room with ID:", roomId);
  };

  return (
    <div className="w-1/2 mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Rooms Availible</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {userRooms.map((room) => (
            <li
              key={room.id}
              className="flex justify-between items-center border-b border-gray-400 py-2"
            >
              <span>{room.name}</span>
              <Link
                href={{
                  pathname: `/chatroom/${room.id}`,
                  query: { name: room.name }, // Pass room name as a query parameter
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                // onClick={() => handleJoinRoom(room.id)}
              >
                Join
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomForm;
