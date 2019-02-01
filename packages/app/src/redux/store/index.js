import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import storage from 'redux-persist/lib/storage';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import did from '../did';
import snackbar from '../snackbar';

export const history = createBrowserHistory();

const rootReducer = {
  did: did.reducer,
  snackbar: snackbar.reducer,
  router: connectRouter(history),
};

export default (appReducers) => {
  // Persistance configuration
  const persistConfig = {
    key: 'root',
    blacklist: ['did'],
    storage,
  };

  // Store.
  const store = createStore(
    persistReducer(persistConfig, combineReducers({ ...rootReducer, ...appReducers })),
    composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history))),
  );

  // Persistor.
  const persistor = persistStore(store);
  return {
    store,
    persistor,
    history,
  };
};
