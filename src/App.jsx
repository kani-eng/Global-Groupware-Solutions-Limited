import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css"; // Ensure CSS file is linked

const API_BASE_URL = "https://reqres.in/api";

// 🔹 Login Component
const Login = ({ setToken }) => {
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <div className="password-container">
        <input 
          type={showPassword ? "text" : "password"} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

// 🔹 Users List Component
const UsersList = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users?page=1`);
        setUsers(res.data.data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
  };

  return (
    <div className="users-container">
      <button className="logout-btn" onClick={onLogout}>Logout</button>
      <h2>Users List</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error &&
        users.map((user) => (
          <div key={user.id} className="user-card">
            <img src={user.avatar} alt={user.first_name} />
            <div className="user-details">
              <span className="user-name">{user.first_name} {user.last_name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <div className="user-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          </div>
        ))}
    </div>
  );
};

// 🔹 Main App Component
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/users" /> : <Login setToken={setToken} />} />
        <Route path="/users" element={token ? <UsersList onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
