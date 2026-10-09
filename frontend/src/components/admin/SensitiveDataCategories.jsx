import React from 'react';

const SensitiveDataCategories = ({ categoryData }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Common Sensitive Data Categories</div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {categoryData.map(item => (
          <div key={item.label} className="css-bar-container">
            <div className="css-bar-header">
              <span className="label">{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="css-bar-track">
              <div 
                className="css-bar-fill" 
                style={{ width: `${item.percentage}%`, backgroundColor: 'var(--accent-primary)' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensitiveDataCategories;
