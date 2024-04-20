import "./ProgressBar.scss";

export interface ProgressBarProps {
  percentage: number;
  used: number;
  total: number;
  unit: string;
  className: string;
  barColor: string;
}

const ProgressBar = (params: ProgressBarProps) => {
  const { percentage, used, total, unit, className, barColor } = params;
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
