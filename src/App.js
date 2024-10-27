

import './App.css';
import React, { useState, useEffect } from 'react';
import Login from './Login';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [ws, setWs] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(""); // Track logged-in username

  useEffect(() => {
    if (token && username) { // Updated to use username instead of recipient
      const socket = new WebSocket(`ws://tenant1.localhost:8000/ws/chat/${username}/?token=${token}`);
      setWs(socket);

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        
        console.log("Message received from server:", data); // Log received message
        if (data.error) {
          console.error("Error from server:", data.error);
        } else {
          setMessages((prevMessages) => [...prevMessages, `${data.sender}: ${data.message}`]);
        }
      };

      socket.onclose = () => console.error('WebSocket closed unexpectedly');

      return () => socket.close();
    }
  }, [token, username]); // Added username to dependency array

  const sendMessage = () => {
    if (ws && inputValue.trim() && recipient.trim()) {
      console.log("Sending message to server:", inputValue); // Log sent message
      ws.send(JSON.stringify({ message: inputValue, recipient })); // Add recipient to message payload
      setMessages((prevMessages) => [...prevMessages, `You: ${inputValue}`]); // Add sent message to state
      setInputValue("");
    }
  };

  if (!token) {
    return <Login setToken={setToken} setUsername={setUsername} />;
  }

  return (
    <div>
      <h1>Private Chat</h1>
      <h2>Welcome, {username}!</h2> {/* Show the logged-in username */}
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient's Username"
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
