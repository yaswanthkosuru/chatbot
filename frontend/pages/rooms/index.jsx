import React, { useState, useEffect } from "react";
import axios from "axios";

const RoomForm = () => {
  const [roomName, setRoomName] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch topics when component mounts
    fetchTopics();
    fetchRooms();
  }, []);

  const fetchTopics = async () => {
    try {
      const token = sessionStorage.getItem("admintoken");
      const response = await axios.get("http://127.0.0.1:8000/topics/", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const token = sessionStorage.getItem("admintoken");
      const response = await axios.get("http://127.0.0.1:8000/rooms/", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setRooms(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const craeteroom = async ({ name, topic }) => {
    const token = sessionStorage.getItem("admintoken");
    try {
      await axios.post(
        "http://127.0.0.1:8000/rooms/",
        { name: name, topic: topic },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      fetchRooms();
      setRoomName("");
      setSelectedTopic("");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleRoomEdit = async (roomId, newName, newTopic) => {
    const token = sessionStorage.getItem("admintoken");
    try {
      await axios.put(
        `http://127.0.0.1:8000/rooms/${roomId}/`,
        { name: newName, topic: newTopic },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      fetchRooms();
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleRoomDelete = async (roomId) => {
    const token = sessionStorage.getItem("admintoken");
    try {
      await axios.delete(`http://127.0.0.1:8000/rooms/${roomId}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await craeteroom({ name: roomName, topic: selectedTopic });
  };

  return (
    <div className="w-1/2 mx-auto">
      <h2 className="text-2xl font-bold">Create Room</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex justify-center items-center"
      >
        <label className="block mb-4">
          <span className="text-gray-700">Room Name:</span>
          <input
            type="text"
            value={roomName}
            onChange={handleRoomNameChange}
            className="border-gray-400 border rounded px-4 py-2 mr-2 flex-grow"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Select Topic:</span>
          <select
            value={selectedTopic}
            onChange={handleTopicChange}
            className="border-gray-400 border rounded px-4 py-2 mr-2 flex-grow"
          >
            <option value="">Select</option>
            {topics?.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Submit
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Rooms</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {rooms.map((room) => (
              <li
                key={room.id}
                className="flex justify-between items-center border-b border-gray-400 py-2"
              >
                <span>{room.name}</span>
                <div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 mr-2 rounded"
                    onClick={() =>
                      handleRoomEdit(room.id, room.name, room.topic)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                    onClick={() => handleRoomDelete(room.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomForm;
