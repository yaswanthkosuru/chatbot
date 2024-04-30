import React, { useEffect, useState } from "react";
import axios from "axios";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [editTopic, setEditTopic] = useState(null);
  const [user, setuser] = useState();
  useEffect(() => {
    console.log(sessionStorage.getItem("user"));
    setuser(sessionStorage.getItem("user"));
  }, [topics]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = () => {
    const token = sessionStorage.getItem("admintoken");
    console.log("token", token);
    axios
      .get("http://127.0.0.1:8000/topics/", {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  };

  const createTopic = () => {
    const token = sessionStorage.getItem("admintoken");
    axios
      .post(
        "http://127.0.0.1:8000/topics/",
        { name: newTopicName },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      )
      .then((response) => {
        fetchTopics();
        setNewTopicName("");
      })
      .catch((error) => {
        console.error("Error creating topic:", error);
      });
  };

  const updateTopic = (id, newName) => {
    const token = sessionStorage.getItem("admintoken");
    axios
      .put(
        `http://127.0.0.1:8000/topics/${id}/`,
        { name: newName },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      )
      .then((response) => {
        fetchTopics();
        setEditTopic(null);
      })
      .catch((error) => {
        console.error("Error updating topic:", error);
      });
  };

  const deleteTopic = (id) => {
    const token = sessionStorage.getItem("admintoken");
    axios
      .delete(`http://127.0.0.1:8000/topics/${id}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((response) => {
        fetchTopics();
      })
      .catch((error) => {
        console.error("Error deleting topic:", error);
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">
        hi {user ? user : "please login"}
      </h1>
      <h2 className="text-2xl font-bold mb-4">Topics</h2>

      <div className="mb-4 flex">
        <input
          type="text"
          className="border-gray-400 border rounded px-4 py-2 mr-2 flex-grow"
          placeholder="Enter topic name"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={createTopic}
        >
          <i className="fas fa-plus mr-2"></i>Create
        </button>
      </div>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id} className="flex items-center justify-between py-2">
            {editTopic === topic.id ? (
              <input
                type="text"
                className="border-gray-400 border rounded px-2 py-1 mr-2 flex-grow"
                value={topic.name}
                onChange={(e) => updateTopic(topic.id, e.target.value)}
              />
            ) : (
              <span>{topic.name}</span>
            )}
            <div>
              {/* <button
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => setEditTopic(topic.id)}
              >
                <i className="fas fa-edit"></i>
              </button> */}
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => deleteTopic(topic.id)}
              >
                <span>delete</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;
