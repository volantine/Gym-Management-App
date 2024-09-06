import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./partials/NavBar";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Billing from './pages/Billing';
import Classes from './pages/Classes';
import Equipment from "./pages/Equipment";
import FitnessGoals from './pages/FitnessGoals';
import HealthMetrics from './pages/HealthMetrics';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  if (!isLoggedIn) {
    document.body.style.background = 'url(/image1.jpg)';
  } else {
    document.body.style.background = 'rgb(30,30,30)';
  }

  let routes;
  switch (localStorage.getItem('account_type')) {
    case 'member':
      routes = (
        <>
          <Route exact path="/profile" element={<Profile username={localStorage.getItem('username')}/>} />
          <Route exact path="/schedule" element={<Schedule />} />
          <Route exact path="/fitness-goals" element={<FitnessGoals username={localStorage.getItem('username')} />} />
          <Route exact path="/metrics" element={<HealthMetrics username={localStorage.getItem('username')} />} />
        </>
      );
      break;

    case 'admin':
      routes = (
        <>
          <Route exact path="/equipment" element={<Equipment />} />
          <Route exact path="/classes" element ={<Classes />} />
          <Route exact path="/billing" element ={<Billing />} />
        </>
      );
      break;
  }

  return (
    <Router>
      {isLoggedIn && <NavBar username={localStorage.getItem('username')} setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn ? (
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          {routes}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ): (
        <Routes>
          <Route exact path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;