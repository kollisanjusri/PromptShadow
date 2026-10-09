import React from 'react';

const RiskDistribution = ({ riskData }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Risk Level Distribution</div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {riskData.map(item => (
          <div key={item.label} className="css-bar-container">
            <div className="css-bar-header">
              <span className="label">{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="css-bar-track">
              <div 
                className="css-bar-fill" 
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistribution;
