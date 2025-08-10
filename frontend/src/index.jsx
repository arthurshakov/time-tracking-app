// import React from 'react';
// import { Provider } from 'react-redux';
// import { store } from './store';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './App';
import './assets/font-awesome-4.7.0/css/font-awesome.min.css';
import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
