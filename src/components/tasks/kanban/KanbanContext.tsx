import { createContext, useContext } from 'react';
import { KanbanContextProps } from './types';

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const KanbanProvider = KanbanContext.Provider;

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};