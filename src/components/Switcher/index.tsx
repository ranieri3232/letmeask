import { useTheme } from '../../hooks/useTheme';
import {FaMoon, FaSun} from 'react-icons/fa'
import './styles.scss';
export function  Switcher(){
  const {changeTheme, theme} = useTheme();
  return(
    <label className="switch">
      <input type="checkbox" onChange={changeTheme}/>
      <span className="slider"></span>
      <div className="indicator">{theme !== 'light'?<FaMoon  size={20}/>:<FaSun size={20}/>}</div>
      
      
      
    </label>
  );
}