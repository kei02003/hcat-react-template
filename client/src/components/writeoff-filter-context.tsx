import { createContext, useContext, useState, ReactNode } from "react";

export interface WriteOffFilters {
  reason?: string;
  payer?: string;
  department?: string;
  status?: string;
  badDebtFlag?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

interface WriteOffFilterContextType {
  filters: WriteOffFilters;
  setFilter: (key: keyof WriteOffFilters, value: string | boolean | undefined) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const WriteOffFilterContext = createContext<WriteOffFilterContextType | undefined>(undefined);

export function WriteOffFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<WriteOffFilters>({});

  const setFilter = (key: keyof WriteOffFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <WriteOffFilterContext.Provider value={{
      filters,
      setFilter,
      clearFilters,
      hasActiveFilters
    }}>
      {children}
    </WriteOffFilterContext.Provider>
  );
}

export function useWriteOffFilters() {
  const context = useContext(WriteOffFilterContext);
  if (context === undefined) {
    throw new Error('useWriteOffFilters must be used within a WriteOffFilterProvider');
  }
  return context;
}