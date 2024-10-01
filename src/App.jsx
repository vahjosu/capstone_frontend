import React, { useState, useEffect } from 'react';
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
    TOTAL: 0, // Total count based on Time In minus Time Out
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [nameInput1, setNameInput1] = useState(''); // For Time In
  const [nameInput2, setNameInput2] = useState(''); // For Time Out

  const navigate = useNavigate();

  useEffect(() => {
    fetchTotalVisitors(); // Fetch the total visitors on component mount
  }, []);

  const fetchTotalVisitors = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logs/count');
      if (!response.ok) {
        throw new Error(`Error fetching total visitors: ${response.statusText}`);
      }
      const data = await response.json();
      
      const total = Number(data.totalRemaining);
      setCounts((prevCounts) => ({
        ...prevCounts,
        TOTAL: !isNaN(total) ? total : 0,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCounts = async () => {
    const colleges = ['CITC', 'COT', 'CSTE', 'COM', 'CSM', 'CEA', 'SHS', 'EMPLOYEE', 'VISITOR'];

    try {
      const counts = await Promise.all(
        colleges.map(async (college) => {
          const response = await fetch(`http://localhost:8000/api/logs/count/${college}`);
          if (!response.ok) throw new Error(`Error fetching ${college} count: ${response.statusText}`);
          const data = await response.json();
          
          console.log(`Fetched count for ${college}:`, data); // Log fetched data

          return { college, count: Number(data.totalRemaining) }; // Convert to number
        })
      );

      const countsObject = counts.reduce((acc, { college, count }) => {
        acc[college] = !isNaN(count) ? count : 0; // Ensure count is a number
        return acc;
      }, {});

      console.log('Counts Object:', countsObject); // Log the final counts object

      setCounts((prevCounts) => ({ ...prevCounts, ...countsObject }));
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleTimeInSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/timein', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput1, logType: "Time In" }), // Include logType
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${errorMessage}`);
      }

      const result = await response.json();
      if (result.success) {
        alert('Visitor data successfully logged as Time In.');
        setNameInput1(''); // Clear input after successful submission
        fetchTotalVisitors(); // Update total count after successful submission
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging data: ' + error.message);
    }
  };

  const handleTimeOutSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/timeout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput2, logType: "Time Out" }), // Include logType
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${errorMessage}`);
      }

      const result = await response.json();
      if (result.success) {
        alert('Visitor Time Out successfully logged.');
        setNameInput2(''); // Clear input after successful submission
        fetchTotalVisitors(); // Update total count after successful submission
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging Time Out: ' + error.message);
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
          <input
            type="text"
            value={nameInput1}
            onChange={(e) => setNameInput1(e.target.value)}
            placeholder="Enter Name"
            className="b1"
          />
          <button onClick={handleTimeInSubmit}>Time In</button>

          <input
            type="text"
            value={nameInput2}
            onChange={(e) => setNameInput2(e.target.value)}
            placeholder="Enter Name"
            className="b1"
          />
          <button onClick={handleTimeOutSubmit}>Time Out</button>
        </div>
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
