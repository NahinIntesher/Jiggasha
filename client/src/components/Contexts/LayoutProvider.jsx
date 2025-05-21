// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const LayoutContext = createContext();

// Custom hook for consuming context
export const useLayout = () => useContext(LayoutContext);

// Create the provider component
export function LayoutProvider({ children }) {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(prev => !prev);
  };

  return (
    <LayoutContext.Provider value={{ menu, toggleMenu }}>
      {children}
    </LayoutContext.Provider>
  );
}
