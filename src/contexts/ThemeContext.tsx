import { createContext, ReactNode} from "react";
import { usePersistedState } from "../utils/usePersistedState";


type ThemeContextProviderProps = {
  children: ReactNode;
}
type ThemeContextProps = {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextProps);

export function ThemeContextProvider({children}:ThemeContextProviderProps){
  const [theme, setTheme] = usePersistedState('theme', 'light');

  function toggleTheme(){
    setTheme(theme === 'light'?'dark':'light');
  }
  return(
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}