'use client';

import * as React from 'react';

interface OptimisticProviderProps<T> {
  children: React.ReactNode;
  value: T;
}

const OptimisticContext = React.createContext<any>(undefined);

export function OptimisticProvider<T>({ children, value }: OptimisticProviderProps<T>) {
  const [optimisticValue, setOptimisticValue] = React.useState(value);

  const update = React.useCallback((newValue: T) => {
    setOptimisticValue(newValue);
  }, []);

  return (
    <OptimisticContext.Provider value={{ value: optimisticValue, update }}>
      {children}
    </OptimisticContext.Provider>
  );
}

export function useOptimistic<T>() {
  const context = React.useContext(OptimisticContext);
  if (context === undefined) {
    throw new Error('useOptimistic must be used within an OptimisticProvider');
  }
  return context as {
    value: T;
    update: () => void;
  };
}
