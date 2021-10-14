import { useTheme } from '../../hooks/useTheme';
import { FaMoon, FaSun } from 'react-icons/fa'
import './styles.scss';
export function  Switcher(){
  const {toggleTheme, theme} = useTheme();
  return(
    <label className="switch">
      <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
      <span className="slider"></span>
      <div className="indicator">{theme !== 'light'?<FaMoon color="white" size={20}/>:<FaSun color="yellow" size={20}/>}</div>
    </label>
  );
}