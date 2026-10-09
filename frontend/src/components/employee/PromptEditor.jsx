import React, { useState } from 'react';
import { Play, Trash2, RefreshCw } from 'lucide-react';

const PromptEditor = ({ prompt, setPrompt, onScan, isScanning }) => {
  const maxChars = 3000;

  const handleClear = () => {
    setPrompt('');
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Original Prompt</div>
      </div>
      
      <div className="textarea-container">
        <textarea
          className="prompt-textarea"
          placeholder="Paste your prompt here to check for sensitive information before sending it to an AI chatbot..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.substring(0, maxChars))}
        />
        <div className="char-count">
          {prompt.length} / {maxChars}
        </div>
      </div>

      <div className="actions">
        <button 
          className="btn btn-secondary" 
          onClick={handleClear}
          disabled={isScanning || prompt.length === 0}
        >
          <Trash2 size={16} /> Clear
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onScan}
          disabled={isScanning || prompt.length === 0}
        >
          {isScanning ? (
            <><RefreshCw size={16} className="animate-spin" /> Scanning...</>
          ) : (
            <><Play size={16} /> Scan Prompt</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptEditor;
