import numpy as np
from scipy.integrate import odeint

class TrisulfideModel:
    """
    Core mathematical engine for simulating Trisulfide Metathesis.
    Provides temporal equilibrium state vectors given an initial concentration matrix.
    """
    def __init__(self, temperature_k=298.15):
        self.temp_k = temperature_k
        self.gas_constant = 8.314 # J/(mol*K)
        # Activation energy for typical disulfide/trisulfide exchange (J/mol)
        self.ea_exchange = 50000.0 

    def calculate_rate_constant(self) -> float:
        """Arrhenius equation for the exchange rate."""
        a_factor = 1e10
        k = a_factor * np.exp(-self.ea_exchange / (self.gas_constant * self.temp_k))
        return k

    def step_simulation(self, current_state: np.ndarray, dt: float) -> np.ndarray:
        """
        Calculates the delta equilibrium shift over timestep dt.
        Returns the new concentration state matrix.
        """
        k = self.calculate_rate_constant()
        # Stubbed ODE integration for the dynamic equilibrium
        d_state = -k * current_state * dt
        new_state = current_state + d_state
        return np.maximum(new_state, 0.0) # concentrations cannot go below zero
