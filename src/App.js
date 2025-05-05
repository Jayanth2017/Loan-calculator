import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoanCalculatorDashboard from './components/LoanCalculatorDashboard'; // <--- Check import
import ExchangeRates from './components/ExchangeRates';         // <--- Check import
import AboutPage from './components/AboutPage';             // <--- Check import
import ErrorPage from './components/ErrorPage';             // <--- Check import
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<LoanCalculatorDashboard />} />
            <Route path="/exchange-rates" element={<ExchangeRates />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;