import { createContext, ReactNode, useEffect, useState } from "react";


type ThemeContextProviderProps = {
  children: ReactNode;
}
type ThemeContextProps = {
  theme: string;
  changeTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextProps);

export function ThemeContextProvider({children}:ThemeContextProviderProps){
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    console.log(theme);
  }, []);

  function changeTheme(){
    if(theme === 'light'){
      setTheme('dark');
    }else{
      setTheme('light');
    }
  }
  return(
    <ThemeContext.Provider value={{theme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}