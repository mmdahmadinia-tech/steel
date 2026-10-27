import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Heat, defaultHeats } from '../data/mockData';

interface DataContextType {
  heats: Heat[];
  addHeat: (heat: Heat) => void;
  updateHeat: (id: string, data: Partial<Heat>) => void;
  getNextHeatId: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [heats, setHeats] = useState<Heat[]>(() => {
    const saved = localStorage.getItem('steelmetrics_heats');
    return saved ? JSON.parse(saved) : defaultHeats;
  });

  const saveHeats = (newHeats: Heat[]) => {
    setHeats(newHeats);
    localStorage.setItem('steelmetrics_heats', JSON.stringify(newHeats));
  };

  const addHeat = (heat: Heat) => {
    saveHeats([heat, ...heats]);
  };

  const updateHeat = (id: string, data: Partial<Heat>) => {
    const newHeats = heats.map(h => h.id === id ? { ...h, ...data } : h);
    saveHeats(newHeats);
  };

  const getNextHeatId = (): string => {
    const nums = heats.map(h => parseInt(h.heatId)).filter(n => !isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 1249;
    return String(max + 1);
  };

  return (
    <DataContext.Provider value={{ heats, addHeat, updateHeat, getNextHeatId }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within DataProvider');
  return context;
}
