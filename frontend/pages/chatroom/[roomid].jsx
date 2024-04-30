import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatLog = ({ chatlog, currentUser }) => {
  return (
    <div className="flex flex-col gap-2">
      {chatlog?.map((message, index) => (
        <div
          key={index}
          className={`flex items-start ${
            message.user_name === currentUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`bg-gray-200 p-2 rounded-lg max-w-sm ${
              message.user_name === currentUser ? "ml-auto" : "mr-auto"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{message.user_name}</span>
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RoomChat = ({ roomName }) => {
  const [chatLog, setChatLog] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const router = useRouter();
  const [chatSocket, setChatSocket] = useState(null);
  const [roomname, setRoomName] = useState("");
  const [allmessages, setallmessages] = useState();
  const [currentuser, setCurrentuser] = useState();
  useEffect(() => {
    setCurrentuser(sessionStorage.getItem("user"));
  }, []);
  const roomid = router.query.roomid;
  useEffect(() => {
    const fetchmessages = async () => {
      const token = sessionStorage.getItem("admintoken");
      const roomid = router.query.roomid;
      if (!roomid) {
        return;
      }
      const response = await axios.get(
        `http://127.0.0.1:8000/messages/room/${roomid}/`,
        {
          room: roomid,
          content: messageInput,
        },
        {
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json", // Make sure to include Content-Type header
          },
        }
      );
      console.log(response.data, roomid, token);
      setChatLog(response.data);
    };
    fetchmessages();
  }, [roomid]);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/lobby/?user_id=1`
    );
    socket.onopen = function (e) {
      console.log("WebSocket connection established");
      setChatSocket(socket);
    };

    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log(data, "getted from websocket");
      setChatLog((prevChatLog) => [...prevChatLog, ...data]); // Append new message to chat log array
    };
    console.log(chatLog, "updated");
    socket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchRoomName();
  }, [router]);

  const fetchRoomName = () => {
    const token = sessionStorage.getItem("admintoken");
    const roomid = router.query.roomid;
    console.log(router.query, router.query.name, "router query");
    setRoomName(router.query.name);
    if (!roomid) {
      return;
    }
  };

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleMessageSubmit = async () => {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      console.log(sessionStorage.getItem("user"));
      chatSocket.send(
        JSON.stringify({
          content: messageInput,
          user_name: sessionStorage.getItem("user"),
          timestamp: new Date().toISOString(),
        })
      );
      setMessageInput("");
      const roomid = router.query.roomid;

      if (!roomid) {
        return;
      }
      const token = sessionStorage.getItem("admintoken");
      const response = await axios.post(
        "http://127.0.0.1:8000/messages/",
        {
          room: roomid,
          content: messageInput,
        },
        {
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json", // Make sure to include Content-Type header
          },
        }
      );
      console.log(response.data, "Saved messsage successfully");
      console.log(token, "token");
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[80%]">
      <div className="flex-none bg-gray-200  px-4 p-6">
        <h2 className="text-xl font-bold">{roomname}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-100">
        <div
          className="bg-white p-4 rounded-lg shadow-md"
          style={{ minHeight: "500px" }}
        >
          <ChatLog chatlog={chatLog} currentUser={currentuser} />
        </div>
      </div>
      <div className="flex-none bg-gray-200 py-3 px-4">
        <div className="flex items-center">
          <input
            type="text"
            value={messageInput}
            onChange={handleMessageInputChange}
            onKeyUp={handleKeyUp}
            className="flex-1 p-3 bg-white border rounded-full shadow-sm mr-2 focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            type="button"
            onClick={handleMessageSubmit}
            disabled={!messageInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
