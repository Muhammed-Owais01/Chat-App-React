import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import Login from './Components/Login';
import FriendsList from './Components/FriendsList';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import SignUp from './Components/Signup';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>  
      <div className="App">
        
        <div>
          <Switch>
            {isLoggedIn ? (
              <>
                <Navbar />
                <Route exact path='/'>
                  <Home />
                </Route>
                <Route>
                  
                </Route>
              </>
            ):
              <> 
                <Route exact path='/'>
                  <Login />
                </Route>
                <Route exact path='/signup'>
                  <SignUp />
                </Route>
              </>
              }
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
