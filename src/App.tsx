import './styles/global.scss';
import { AuthContextProvider } from './contexts/AuthContext';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import { NewRoom } from './pages/NewRoom';
import { Home } from './pages/Home';


import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';
import { ToastContextProvider } from './contexts/ToastContext';

import './styles/responsive.scss';
import './styles/themes.scss';
import { useTheme } from './hooks/useTheme';


function App() {
  const {theme} = useTheme();
  return (
    <div className={`app ${theme}`}>
      <BrowserRouter>
        <AuthContextProvider>
          <ToastContextProvider>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/rooms/new" exact component={NewRoom}/>
              <Route path="/rooms/:id" component={Room}/>
              <Route path="/admin/rooms/:id" component={AdminRoom}/>

            </Switch>
          </ToastContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
    
  );
}

export default App;
