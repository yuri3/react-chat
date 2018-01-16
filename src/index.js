import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { CookiesProvider } from 'react-cookie';
import store from './store';
import './index.css';

import MainRoutes from './routes';

import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();

require('dotenv').config();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <CookiesProvider>
        <MainRoutes />
      </CookiesProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
