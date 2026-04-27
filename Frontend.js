import React, { useState } from 'react';
import './App.css';

const EventLock = () => {
  const [secret, setSecret] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [trigger, setTrigger] = useState('');
  const [vaultId, setVaultId] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [unlockedData, setUnlockedData] = useState('');

  const lockData = async () => {
    const res = await fetch('http://localhost:5000/lock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, target_date: targetDate, event_trigger: trigger })
    });
    const data = await res.json();
    setVaultId(data.id);
    setStatusMsg('Data locked. Your Vault ID is ' + data.id);
    setSecret('');
    setTrigger('');
  };

  const checkVault = async () => {
    setUnlockedData('');
    const res = await fetch('http://localhost:5000/unlock/' + vaultId);
    const data = await res.json();
    
    if (data.status === 'unlocked') {
      setStatusMsg('Vault Opened.');
      setUnlockedData(data.secret);
    } else {
      setStatusMsg('Access Denied: ' + data.message);
    }
  };

  return (
    <div className="wrapper">
      <h2>EventLock Vault</h2>
      
      <div className="panel creation-panel">
        <h3>Create New Vault</h3>
        <textarea 
          placeholder="Enter the code or text to hide..." 
          value={secret} 
          onChange={e => setSecret(e.target.value)} 
        />
        <input 
          type="date" 
          value={targetDate} 
          onChange={e => setTargetDate(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Condition (e.g., Election results declared)" 
          value={trigger} 
          onChange={e => setTrigger(e.target.value)} 
        />
        <button onClick={lockData}>Seal Vault</button>
      </div>
      
      <div className="panel access-panel">
        <h3>Access Vault</h3>
        <input 
          type="text" 
          placeholder="Enter Vault ID" 
          value={vaultId} 
          onChange={e => setVaultId(e.target.value)} 
        />
        <button onClick={checkVault}>Attempt Unlock</button>
        
        <p className="status">{statusMsg}</p>
        
        {unlockedData && (
          <div className="revealed-data">
            {unlockedData}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventLock;
