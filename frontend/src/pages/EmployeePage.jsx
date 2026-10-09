import React, { useState } from 'react';
import PromptEditor from '../components/employee/PromptEditor';
import SecurityAssessment from '../components/employee/SecurityAssessment';
import ProtectedPrompt from '../components/employee/ProtectedPrompt';
import RecentScanActivity from '../components/employee/RecentScanActivity';
import { mockScanPrompt } from '../services/scanService';

const EmployeePage = () => {
  const [prompt, setPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const results = await mockScanPrompt(prompt);
      setScanResults(results);
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  // If prompt changes, we might want to clear results or keep them until next scan. 
  // For now, let's just keep them to allow side-by-side comparison, or clear if prompt is empty.
  React.useEffect(() => {
    if (prompt === '') {
      setScanResults(null);
    }
  }, [prompt]);

  return (
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-title">AI Prompt Security Scanner</h1>
        <p className="page-subtitle">Inspect prompts for sensitive data before sharing them with AI chatbots.</p>
      </div>

      <div className="two-column">
        <PromptEditor 
          prompt={prompt} 
          setPrompt={setPrompt} 
          onScan={handleScan} 
          isScanning={isScanning} 
        />
        <SecurityAssessment results={scanResults} />
      </div>

      <ProtectedPrompt results={scanResults} />
      
      <RecentScanActivity />
    </main>
  );
};

export default EmployeePage;
