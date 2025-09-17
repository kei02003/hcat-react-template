import { createContext, useContext, useState, ReactNode } from "react";

export interface DenialFilters {
  category?: string;
  reasonCode?: string;
  payer?: string;
  department?: string;
}

interface DenialFilterContextType {
  filters: DenialFilters;
  setFilter: (key: keyof DenialFilters, value: string | undefined) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const DenialFilterContext = createContext<DenialFilterContextType | undefined>(undefined);

export function DenialFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DenialFilters>({});

  const setFilter = (key: keyof DenialFilters, value: string | undefined) => {
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
    <DenialFilterContext.Provider value={{
      filters,
      setFilter,
      clearFilters,
      hasActiveFilters
    }}>
      {children}
    </DenialFilterContext.Provider>
  );
}

export function useDenialFilters() {
  const context = useContext(DenialFilterContext);
  if (context === undefined) {
    throw new Error('useDenialFilters must be used within a DenialFilterProvider');
  }
  return context;
}