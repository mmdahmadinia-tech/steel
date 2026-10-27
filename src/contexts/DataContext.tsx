import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Heat, AuditLog, BackupRecord, mockHeats, mockAuditLogs, mockBackups } from '../data/mockData';

interface DataContextType {
  heats: Heat[];
  auditLogs: AuditLog[];
  backups: BackupRecord[];
  addHeat: (heat: Heat) => void;
  updateHeat: (id: string, heat: Partial<Heat>) => void;
  addAuditLog: (log: AuditLog) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [heats, setHeats] = useState<Heat[]>(mockHeats);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [backups] = useState<BackupRecord[]>(mockBackups);

  const addHeat = (heat: Heat) => {
    setHeats(prev => [heat, ...prev]);
  };

  const updateHeat = (id: string, data: Partial<Heat>) => {
    setHeats(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));
  };

  const addAuditLog = (log: AuditLog) => {
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <DataContext.Provider value={{ heats, auditLogs, backups, addHeat, updateHeat, addAuditLog }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
