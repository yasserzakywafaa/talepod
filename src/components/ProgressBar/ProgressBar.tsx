import React from "react";

import "./ProgressBar.scss";

const ProgressBar = (props) => {
  const { percentage, used, total, unit, className, barColor } = props;
  const dynamicStyles = {
    width: `${percentage}%`,
    backgroundColor: barColor,
  };

  return (
    <div className={`progress-bar-wrapper ${className}`}>
      {used && total && (
        <div className="progress-bar-info">
          <span className="progress-bar-info-total">{`${used} / ${total}`}</span>
          <span className="progress-bar-info-unit">{unit && unit}</span>
        </div>
      )}
      <span className="progress-bar-text">
        {!isNaN(percentage) && `${percentage}%`}
      </span>
      <div style={dynamicStyles} className="progress-bar"></div>
    </div>
  );
};

export default ProgressBar;
