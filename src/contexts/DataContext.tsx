import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Heat, defaultHeats } from '../data/mockData';
import { useAuth } from './AuthContext';

interface DataContextType {
  heats: Heat[];
  loading: boolean;
  error: string | null;
  addHeat: (heat: Heat) => Promise<void>;
  updateHeat: (id: string, data: Partial<Heat>) => Promise<void>;
  deleteHeat: (id: string) => Promise<void>;
  deleteAllHeats: () => Promise<void>;
  getNextHeatId: () => Promise<string>;
  refreshHeats: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// بررسی در دسترس بودن Backend
async function checkBackendAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [heats, setHeats] = useState<Heat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  // بررسی Backend در ابتدا
  useEffect(() => {
    const init = async () => {
      const available = await checkBackendAvailability();
      setBackendAvailable(available);

      if (available && token) {
        await fetchHeatsFromAPI();
      } else {
        loadHeatsFromLocalStorage();
      }

      setLoading(false);
    };

    init();
  }, [token]);

  // Fetch از API
  const fetchHeatsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/heats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch heats');
      }

      const data = await response.json();
      setHeats(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch heats';
      setError(errorMessage);
      console.error('Fetch heats error:', err);
      loadHeatsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load از localStorage
  const loadHeatsFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('steelmetrics_heats');
      if (saved) {
        setHeats(JSON.parse(saved));
      } else {
        setHeats(defaultHeats);
        localStorage.setItem('steelmetrics_heats', JSON.stringify(defaultHeats));
      }
    } catch (e) {
      console.error('Load from localStorage error:', e);
      setHeats(defaultHeats);
    }
  };

  // Save به localStorage
  const saveToLocalStorage = (newHeats: Heat[]) => {
    setHeats(newHeats);
    localStorage.setItem('steelmetrics_heats', JSON.stringify(newHeats));
  };

  // Helper function for API calls
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, [token]);

  // Add new heat
  const addHeat = async (heat: Heat) => {
    try {
      setError(null);

      if (backendAvailable && token) {
        if (heats.some(h => h.heatId === heat.heatId)) {
          throw new Error(`Heat ID ${heat.heatId} already exists`);
        }

        await apiCall('/heats', {
          method: 'POST',
          body: JSON.stringify({
            heatId: heat.heatId,
            date: heat.date,
            shift: heat.shift,
            steelGrade: heat.steelGrade,
          }),
        });

        if (heat.eafData) {
          await apiCall(`/heats/${heat.heatId}/eaf`, {
            method: 'POST',
            body: JSON.stringify(heat.eafData),
          });
        }

        if (heat.lfData) {
          await apiCall(`/heats/${heat.heatId}/lf`, {
            method: 'POST',
            body: JSON.stringify(heat.lfData),
          });
        }

        if (heat.ccmData) {
          await apiCall(`/heats/${heat.heatId}/ccm`, {
            method: 'POST',
            body: JSON.stringify(heat.ccmData),
          });
        }

        await fetchHeatsFromAPI();
      } else {
        if (heats.some(h => h.heatId === heat.heatId)) {
          throw new Error(`Heat ID ${heat.heatId} already exists`);
        }
        saveToLocalStorage([heat, ...heats]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add heat';
      setError(errorMessage);
      throw err;
    }
  };

  // Update heat
  const updateHeat = async (id: string, data: Partial<Heat>) => {
    try {
      setError(null);

      if (backendAvailable && token) {
        await apiCall(`/heats/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            eafStatus: data.eafStatus,
            lfStatus: data.lfStatus,
            ccmStatus: data.ccmStatus,
            warnings: data.warnings,
          }),
        });

        if (data.eafData) {
          const heat = heats.find(h => h.id === id);
          if (heat) {
            await apiCall(`/heats/${heat.heatId}/eaf`, {
              method: 'POST',
              body: JSON.stringify(data.eafData),
            });
          }
        }

        if (data.lfData) {
          const heat = heats.find(h => h.id === id);
          if (heat) {
            await apiCall(`/heats/${heat.heatId}/lf`, {
              method: 'POST',
              body: JSON.stringify(data.lfData),
            });
          }
        }

        if (data.ccmData) {
          const heat = heats.find(h => h.id === id);
          if (heat) {
            await apiCall(`/heats/${heat.heatId}/ccm`, {
              method: 'POST',
              body: JSON.stringify(data.ccmData),
            });
          }
        }

        await fetchHeatsFromAPI();
      } else {
        const newHeats = heats.map(h => h.id === id ? { ...h, ...data } : h);
        saveToLocalStorage(newHeats);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update heat';
      setError(errorMessage);
      throw err;
    }
  };

  // Delete heat
  const deleteHeat = async (id: string) => {
    try {
      setError(null);

      if (backendAvailable && token) {
        await apiCall(`/heats/${id}`, {
          method: 'DELETE',
        });
        await fetchHeatsFromAPI();
      } else {
        const newHeats = heats.filter(h => h.id !== id);
        saveToLocalStorage(newHeats);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete heat';
      setError(errorMessage);
      throw err;
    }
  };

  // Delete all heats
  const deleteAllHeats = async () => {
    try {
      setError(null);

      if (backendAvailable && token) {
        await apiCall('/heats', {
          method: 'DELETE',
        });
        await fetchHeatsFromAPI();
      } else {
        saveToLocalStorage([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete all heats';
      setError(errorMessage);
      throw err;
    }
  };

  // Get next heat ID
  const getNextHeatId = async (): Promise<string> => {
    try {
      if (backendAvailable && token) {
        const data = await apiCall('/heats/next-id');
        return data.nextHeatId;
      } else {
        const nums = heats.map(h => parseInt(h.heatId)).filter(n => !isNaN(n));
        const max = nums.length > 0 ? Math.max(...nums) : 0;
        return String(max + 1);
      }
    } catch (err) {
      const nums = heats.map(h => parseInt(h.heatId)).filter(n => !isNaN(n));
      const max = nums.length > 0 ? Math.max(...nums) : 0;
      return String(max + 1);
    }
  };

  // Refresh heats
  const refreshHeats = async () => {
    if (backendAvailable && token) {
      await fetchHeatsFromAPI();
    } else {
      loadHeatsFromLocalStorage();
    }
  };

  return (
    <DataContext.Provider value={{
      heats,
      loading,
      error,
      addHeat,
      updateHeat,
      deleteHeat,
      deleteAllHeats,
      getNextHeatId,
      refreshHeats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
