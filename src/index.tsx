import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './Context/AuthContext';
import { UserProvider } from './Context/UserContext';
import { PopUpProvider } from './Context/PopUpContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <PopUpProvider>
          <App />
        </PopUpProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

