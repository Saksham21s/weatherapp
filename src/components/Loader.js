import React from 'react';
import '../style/style.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="cube">
          <div className="side front"></div>
          <div className="side back"></div>
          <div className="side left"></div>
          <div className="side right"></div>
          <div className="side top"></div>
          <div className="side bottom"></div>
        </div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loader;