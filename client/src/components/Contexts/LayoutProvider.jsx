"use client";
import React, { createContext, useState, useContext } from "react";

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ children }) {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  return (
    <LayoutContext.Provider value={{ menu, toggleMenu }}>
      {children}
    </LayoutContext.Provider>
  );
}
