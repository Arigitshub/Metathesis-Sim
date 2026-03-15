from fastapi import FastAPI, WebSocket
import uvicorn
import asyncio
import numpy as np
import json
from .metathesis_engine import TrisulfideModel

app = FastAPI(title="Metathesis-Sim API")
model = TrisulfideModel()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Trisulfide Equilibrator"}

@app.websocket("/ws/simulate")
async def simulate_endpoint(websocket: WebSocket):
    """
    Streams the molecular simulation state matrix to the React dashboard.
    """
    await websocket.accept()
    
    # Initialize a stubbed 3x3 concentration matrix
    current_state = np.array([[1.0, 0.5, 0.1], 
                              [0.5, 1.0, 0.2], 
                              [0.1, 0.2, 1.0]])

    try:
        while True:
            # Step the simulation forward by 0.1 seconds
            current_state = model.step_simulation(current_state, dt=0.1)
            
            # Broadcast the updated state
            payload = {"state_matrix": current_state.tolist()}
            await websocket.send_text(json.dumps(payload))
            
            # Throttle stream to 10 FPS
            await asyncio.sleep(0.1)
    except Exception as e:
        print(f"Simulation connection closed: {e}")

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
