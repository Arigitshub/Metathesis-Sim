import React, { useState, useEffect } from 'react';

function App() {
  const [simulationState, setSimulationState] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to the Python FastAPI WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/simulate');

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSimulationState(data.state_matrix);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#111', color: '#eee', height: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔬 Metathesis-Sim Dashboard</h1>
      <p>Connection Status: <span style={{ color: connected ? '#0f0' : '#f00' }}>{connected ? 'LIVE' : 'OFFLINE'}</span></p>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
        <h2>Equilibrium State Matrix</h2>
        {simulationState ? (
          <pre>{JSON.stringify(simulationState, null, 2)}</pre>
        ) : (
          <p>Awaiting simulation data from the backend...</p>
        )}
      </div>

      <div style={{ marginTop: '30px', color: '#666' }}>
        <p>A WebGL 3D molecular canvas will be rendered here to visualize the structural breaking/forming of the trisulfide bonds.</p>
      </div>
    </div>
  );
}

export default App;
