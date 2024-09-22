import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ShopContextProvider from './Context/ShopContext.jsx';

// Render the application and wrap with ShopContextProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </React.StrictMode>
);
