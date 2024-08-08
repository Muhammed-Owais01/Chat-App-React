import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import Login from './Components/Login';
import FriendsList from './Components/FriendsList';
import Home from './Components/Home';
import Navbar from './Components/Navbar';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>  
      <div className="App">
        <Navbar />
        <div>
          <Switch>
            {isLoggedIn ? (
              <>
                <Route exact path='/'>
                  <Home />
                </Route>
                <Route>
                  
                </Route>
              </>
            ): 
              <Route>
                <Login />
              </Route>}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
