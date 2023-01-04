import { useState, createContext } from "react";

export const AppContext = createContext(null);

const AppProvider = ({ children }) => {

  const [loggedUser, setLoggedUser] = useState({});
  return (
    <AppContext.Provider value={{
      loggedUser,
      setLoggedUser,
    }}>
      {children}
    </AppContext.Provider >
  );
}

export default AppProvider;