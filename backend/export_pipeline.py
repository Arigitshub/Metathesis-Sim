import json
from src.metathesis_engine import TrisulfideModel

def export_cleavage_data(filename="cleavage_data.json", hours=24):
    """
    Simulates the Trisulfide Metathesis reaction over a 24-hour cycle
    and exports the JSON cleavage rate exponential decay dataset.
    """
    model = TrisulfideModel(temperature_k=298.15)
    cleavage_rate = model.calculate_ss_bond_cleavage_rate()
    net_decay_constant = cleavage_rate * 0.05
    
    decay_curve = []
    initial_concentration = 1.0
    
    for hour in range(hours + 1):
        time_elapsed_seconds = hour * 3600
        current_concentration = initial_concentration * (2.71828 ** (-net_decay_constant * time_elapsed_seconds))
        
        decay_curve.append({
            "hour": hour,
            "seconds_elapsed": time_elapsed_seconds,
            "concentration_molarity": round(current_concentration, 6)
        })
        
    export_payload = {
        "metadata": {
            "simulation_type": "Trisulfide Metathesis",
            "temperature_k": 298.15,
            "activation_energy_j_mol": 45000.0,
            "cleavage_rate_constant": cleavage_rate
        },
        "decay_curve": decay_curve
    }
    
    with open(filename, 'w') as f:
        json.dump(export_payload, f, indent=4)
        
    print(f"✅ Successfully exported theoretical 24-hour decay curve to {filename}")

if __name__ == "__main__":
    export_cleavage_data()
