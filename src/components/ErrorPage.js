import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css'; // Create this CSS file

function ErrorPage() {
  return (
    <div className="error-page-container">
      <h1>Something went wrong in the application.</h1>
      <Link to="/" className="go-home-button">
        GO HOME
      </Link>
    </div>
  );
}

export default ErrorPage;