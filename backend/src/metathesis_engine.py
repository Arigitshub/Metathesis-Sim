import numpy as np
from scipy.integrate import odeint

class TrisulfideModel:
    """
    Core mathematical engine for simulating Trisulfide Metathesis.
    Provides temporal equilibrium state vectors given an initial concentration matrix.
    """
    def __init__(self, temperature_k=298.15):
        # Program engine to simulate standard room temperature conditions (298.15K)
        self.temp_k = temperature_k
        self.gas_constant = 8.314 # J/(mol*K)
        
        # Inject Activation Energy (E_a) at 298K for Trisulfide Metathesis
        # Lowered E_a to allow cleavage without extreme heat or toxic catalysts
        self.ea_exchange = 45000.0 # J/mol

    def calculate_ss_bond_cleavage_rate(self) -> float:
        """
        Map the frequency at which S-S (sulfur) bonds break and reform dynamically.
        Uses the Arrhenius equation based on the injected Activation Energy.
        """
        # Frequency factor for sulfur-sulfur bond exchanges
        a_factor = 2.5e10 
        cleavage_rate = a_factor * np.exp(-self.ea_exchange / (self.gas_constant * self.temp_k))
        return cleavage_rate

    def step_simulation(self, current_state: np.ndarray, dt: float) -> np.ndarray:
        """
        Calculates the delta equilibrium shift over timestep dt.
        Returns the new concentration state matrix.
        """
        cleavage_rate = self.calculate_ss_bond_cleavage_rate()
        
        # Determine the dynamic equilibrium shift based on bond cleavage frequency
        # (Using a simplified kinetic model for the concentration matrix)
        d_state = -cleavage_rate * current_state * dt
        
        # Reforming bonds (reverse reaction approximation)
        reformation_rate = cleavage_rate * 0.95
        reforming_bonds = reformation_rate * (1.0 - current_state) * dt
        
        new_state = current_state + d_state + reforming_bonds
        return np.clip(new_state, 0.0, 1.0) # concentrations bounded [0, 1]
