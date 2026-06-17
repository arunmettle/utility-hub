import { createContext, useContext, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { Tool } from '../utils/toolsData';

interface ToolFiltersContextValue {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  filteredTools: Tool[];
}

const ToolFiltersContext = createContext<ToolFiltersContextValue | undefined>(undefined);

export function ToolFiltersProvider({
  value,
  children,
}: {
  value: ToolFiltersContextValue;
  children: ReactNode;
}) {
  return <ToolFiltersContext.Provider value={value}>{children}</ToolFiltersContext.Provider>;
}

export function useToolFilters() {
  const context = useContext(ToolFiltersContext);

  if (!context) {
    throw new Error('useToolFilters must be used within a ToolFiltersProvider');
  }

  return context;
}
