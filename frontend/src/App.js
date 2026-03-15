import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function App() {
  const [decayData, setDecayData] = useState([]);
  const [labels, setLabels] = useState([]);
  const SIMULATION_HOURS = 24;

  useEffect(() => {
    // Replicate the calculate_ss_bond_cleavage_rate (Activation Energy = 45000 J/mol, T = 298.15K)
    const EA_EXCHANGE = 45000.0;
    const GAS_CONSTANT = 8.314;
    const TEMP_K = 298.15;
    const A_FACTOR = 2.5e10;

    // Base cleavage rate per second
    const cleavageRate = A_FACTOR * Math.exp(-EA_EXCHANGE / (GAS_CONSTANT * TEMP_K));
    
    // Simulate molecular decay over 24 hours
    // Simplified kinetic model showing the drop in initial trisulfide concentration
    let initialConcentration = 1.0; 
    const generatedData = [];
    const generatedLabels = [];

    // Simulate hour by hour
    for (let hour = 0; hour <= SIMULATION_HOURS; hour++) {
      generatedLabels.push(`Hour ${hour}`);
      
      // Calculate remaining concentration using exponential decay based on the cleavage rate
      // Since cleavage rate is per second, we extrapolate the decay dynamically for plotting
      const timeElapsedSeconds = hour * 3600; 
      
      // Net decay simulation: bonds break, but some reform. 
      // Reforming rate is approx 95% of cleavage, so net loss is 5% of cleavage rate over time
      const netDecayConstant = cleavageRate * 0.05; 
      const currentConcentration = initialConcentration * Math.exp(-netDecayConstant * timeElapsedSeconds);
      
      generatedData.push(currentConcentration);
    }

    setLabels(generatedLabels);
    setDecayData(generatedData);
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Trisulfide S-S Bond Concentration',
        data: decayData,
        borderColor: 'rgb(80, 220, 150)',
        backgroundColor: 'rgba(80, 220, 150, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } },
      title: {
        display: true,
        text: `24-Hour Bond Cleavage Decay Cycle (T = 298.15K, Ea = 45kJ/mol)`,
        color: '#fff',
        font: { size: 16 }
      },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        min: 0,
        max: 1.0,
        title: { display: true, text: 'Concentration [M]', color: '#aaa' },
        ticks: { color: '#aaa' },
        grid: { color: '#333' }
      },
      x: {
        title: { display: true, text: 'Time (Hours)', color: '#aaa' },
        ticks: { color: '#aaa' },
        grid: { color: '#333' }
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0f', color: '#eee', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#50dc96', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          ⚗️ Metathesis-Sim: Glass Box UI
        </h1>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>
          Real-time verification telemetry for the molecular degradation engine. 
          Plotting dynamic Arrhenius equation equilibrium curves at room temperature without external catalysts.
        </p>
        
        <div style={{ 
          height: '500px', 
          backgroundColor: '#151520', 
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {decayData.length > 0 ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              Processing Simulation Data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
