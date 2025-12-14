import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Landing.css";


export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSignup = () => {
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email must contain @");
      return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup successful! Please login.");
    setShowSignup(false);
  };

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      !storedUser ||
      storedUser.email !== email ||
      storedUser.password !== password
    ) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("email", email);
    navigate("/dashboard");
  };


  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            Stock Dashboard
          </a>
          <div className="ms-auto">
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center">
        <div className="container text-center text-white">
          <h1 className="display-5 fw-bold">
            Real-Time Stock Broker Dashboard
          </h1>
          <p className="lead mt-3">
            Track live stock prices instantly. Subscribe to your favorite stocks
            and stay updated without refreshing.
          </p>
          <div className="mt-4">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => setShowSignup(true)}
            >
              Get Started
            </button>
            <button
              className="btn btn-outline-light btn-lg"
              onClick={() => setShowLogin(true)}
            >
              Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Key Features</h2>
        <div className="row g-4">
          <div className="col-md-3">
            <div className="feature-card">Real-Time Updates</div>
          </div>
          <div className="col-md-3">
            <div className="feature-card">WebSocket Powered</div>
          </div>
          <div className="col-md-3">
            <div className="feature-card">Multi-User Support</div>
          </div>
          <div className="col-md-3">
            <div className="feature-card">Email Login</div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row text-center">
            <div className="col-md-4">Login using Email</div>
            <div className="col-md-4">Subscribe to Stocks</div>
            <div className="col-md-4">View Live Prices</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-white text-center py-3">
        <p className="mb-0">
          © 2025 Stock Broker Client Dashboard | College Mini Project
        </p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="custom-modal">
          <div className="modal-box">
            <h4>Login</h4>
            <input
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-danger">{error}</p>}

            <button className="btn btn-primary w-100" onClick={handleLogin}>
              Login
            </button>

            <button
              className="btn btn-link"
              onClick={() => setShowLogin(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="custom-modal">
          <div className="modal-box">
            <h4>Sign Up</h4>
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-danger">{error}</p>}

            <button className="btn btn-primary w-100" onClick={handleSignup}>
              Create Account
            </button>

            <button
              className="btn btn-link"
              onClick={() => setShowSignup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}