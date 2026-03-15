# Metathesis-Sim: Molecular Degradation Engine

Metathesis-Sim is a computational and visual platform designed to simulate the principles of the circular economy via **Trisulfide Metathesis**—the dynamic breaking and reforming of sulfur-sulfur bonds.

## Architecture

This repository contains a full-stack Python/React environment:
1. **Backend API (`backend/`)**: A FastAPI service powering the degradation math.
2. **Molecular Engine (`metathesis_engine.py`)**: Solves the differential calculus for the S-S bonds.
3. **Decay Dashboard (`frontend/`)**: A React/Chart.js "Glass Box UI" plotting the theoretical 24-hour molecular degradation cycle.
4. **Data Pipeline (`export_pipeline.py`)**: A script to dump the exponential decay curves into structured JSON datasets.

### The Chemistry: Activation Energy ($E_a$) at 298.15K

Unlike traditional chemical recycling that requires industrial smelters, toxic catalysts, and extreme heat, this engine simulates Metathesis under standard room temperature conditions (298.15K).

We accomplish this mathematically by injecting a lowered target **Activation Energy ($E_a = 45,000$ J/mol)**. We then map the **S-S Bond Cleavage Rates** using the Arrhenius frequency factor. The kinetic model dynamically computes the rate of cleavage versus reformation, plotted seamlessly on the frontend React chart.

## Installation

### 1. The FastAPI Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn numpy
```

### 2. The React Dashboard
```bash
cd frontend
npm install
npm install chart.js react-chartjs-2
```

## How to Run

**1. Data Pipeline JSON Export**
Generate a structured `cleavage_data.json` outlining the theoretical 24-hour metathesis cycle:
```bash
cd backend
python export_pipeline.py
```

**2. Real-Time Glass Box Dashboard**
To view the bond cleavage telemetry dynamically:
```bash
cd frontend
npm start
```
