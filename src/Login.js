import React, { useState } from 'react';

const Login = ({ setToken, setUsername }) => {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const response = await fetch('http://tenant1.localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      setUsername(username); // Pass the username to the parent component
    } else {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login; // Ensure this line is present

