import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Heat } from '../data/mockData';
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

export function DataProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [heats, setHeats] = useState<Heat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function for API calls
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('لطفاً ابتدا وارد شوید');
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

  // Fetch all heats
  const fetchHeats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/heats');
      setHeats(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت اطلاعات ذوب‌ها';
      setError(errorMessage);
      console.error('Fetch heats error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Initial load
  useEffect(() => {
    if (token) {
      fetchHeats();
    } else {
      setLoading(false);
    }
  }, [token, fetchHeats]);

  // Add new heat
  const addHeat = async (heat: Heat) => {
    try {
      setError(null);
      
      // Check for duplicate Heat ID
      if (heats.some(h => h.heatId === heat.heatId)) {
        throw new Error(`Heat ID ${heat.heatId} قبلاً ثبت شده است`);
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

      // Save EAF/LF/CCM data if present
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

      // Refresh heats list
      await fetchHeats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ثبت ذوب';
      setError(errorMessage);
      throw err;
    }
  };

  // Update heat
  const updateHeat = async (id: string, data: Partial<Heat>) => {
    try {
      setError(null);
      
      await apiCall(`/heats/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          eafStatus: data.eafStatus,
          lfStatus: data.lfStatus,
          ccmStatus: data.ccmStatus,
          warnings: data.warnings,
        }),
      });

      // Save unit-specific data
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

      // Refresh heats list
      await fetchHeats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در به‌روزرسانی ذوب';
      setError(errorMessage);
      throw err;
    }
  };

  // Delete heat
  const deleteHeat = async (id: string) => {
    try {
      setError(null);
      await apiCall(`/heats/${id}`, {
        method: 'DELETE',
      });
      await fetchHeats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در حذف ذوب';
      setError(errorMessage);
      throw err;
    }
  };

  // Delete all heats
  const deleteAllHeats = async () => {
    try {
      setError(null);
      await apiCall('/heats', {
        method: 'DELETE',
      });
      await fetchHeats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در حذف همه ذوب‌ها';
      setError(errorMessage);
      throw err;
    }
  };

  // Get next heat ID
  const getNextHeatId = async (): Promise<string> => {
    try {
      const data = await apiCall('/heats/next-id');
      return data.nextHeatId;
    } catch (err) {
      throw new Error('خطا در دریافت شماره ذوب بعدی');
    }
  };

  // Refresh heats
  const refreshHeats = async () => {
    await fetchHeats();
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
