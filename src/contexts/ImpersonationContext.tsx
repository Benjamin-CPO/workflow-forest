import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";

interface ImpersonatedUser {
  id: number;
  name: string;
  role: string;
}

interface ImpersonationContextType {
  impersonatedUser: ImpersonatedUser | null;
  startImpersonation: (user: ImpersonatedUser) => void;
  stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export const ImpersonationProvider = ({ children }: { children: React.ReactNode }) => {
  const [impersonatedUser, setImpersonatedUser] = useState<ImpersonatedUser | null>(null);

  const startImpersonation = (user: ImpersonatedUser) => {
    setImpersonatedUser(user);
    toast.success(`Now viewing as ${user.name}`);
  };

  const stopImpersonation = () => {
    if (impersonatedUser) {
      toast.success(`Stopped viewing as ${impersonatedUser.name}`);
    }
    setImpersonatedUser(null);
  };

  return (
    <ImpersonationContext.Provider value={{ impersonatedUser, startImpersonation, stopImpersonation }}>
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (context === undefined) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
};