import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [counts, setCounts] = useState({
    CITC: 0,
    COT: 0,
    CSTE: 0,
    COM: 0,
    CSM: 0,
    CEA: 0,
    SHS: 0,
    EMPLOYEE: 0,
    VISITOR: 0,
    TOTAL: 0
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [nameInput, setNameInput] = useState(''); // State for the input field for Name

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setShowLoginModal(false);
      setLoginError('');
      navigate('/view');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setLoginError('');
    setShowLoginModal(false);
  };

  const handleLogSubmit = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nameInput }) // Send the name as JSON
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Get error response text
            throw new Error(`Error: ${errorMessage}`);
        }

        const result = await response.json();
        if (result.success) {
            alert('Visitor data successfully logged.');
            setNameInput(''); // Clear input after successful submission
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging data: ' + error.message);
    }
};

  return (
    <div className="main-container">
      <div className="top-container">
        {Object.keys(counts).map((key) => (
          <div className="box1" key={key}>
            <label className="box1-label">{key}</label>
            <span className="box1-count">{counts[key]}</span>
          </div>
        ))}
      </div>
      <div className="mid1-container">
        <span className="mid1-text">UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES MONITORING SYSTEM</span>
      </div>
      <div className="mid2-container">
        <div className="box2">
          <label className="box2-label">Enter Name:</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)} // Update nameInput state
            placeholder="Enter Name"
            className="b1"
          />
          <button onClick={handleLogSubmit}>Log Visitor</button> {/* Button to trigger log submission */}
        </div>
        {/* Other input boxes */}
        <div className="box2">
          <label className="box2-label">BOX 2</label>
        </div>
        <div className="box2">
          <label className="box2-label">BOX 3</label>
        </div>
        <div className="box2">
          <label className="box2-label">BOX 4</label>
        </div>
      </div>
      <div className="bottom-container">
        <div className="bottom-left">Total Entry:</div>
        <div className="bottom-middle">Total Exit:</div>
        <div className="bottom-right">
          <button className="view-records-btn" onClick={() => setShowLoginModal(true)}>View Records</button>
        </div>
      </div>

      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">ADMIN LOGIN</h2>
            <label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </label>
            <label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </label>
            {loginError && <p className="error">{loginError}</p>}
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
