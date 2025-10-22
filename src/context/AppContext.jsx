import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentApp, setCurrentApp] = useState({
    id: 1, // Default Security app
    name: 'Security'
  });
  
  const location = useLocation();

  // ✅ useCallback se changeApp function stable banayein
  const changeApp = useCallback((appId, appName) => {
    setCurrentApp({ id: appId, name: appName });
  }, []);

  // ✅ Automatically detect app from URL
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/document') || path === '/document') {
      setCurrentApp({ id: 13, name: 'Document' });
    }
    else if (path.includes('/complaint')) {
      setCurrentApp({ id: 2, name: 'Complaint' });
    }
    else if (path.includes('/security') || path.includes('/default') || path === '/') {
      setCurrentApp({ id: 1, name: 'Security' });
    }
  }, [location]);

  return (
    <AppContext.Provider value={{ currentApp, changeApp }}>
      {children}
    </AppContext.Provider>
  );
};