import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { Route, Switch } from 'react-router'; // react-router v4
import { ConnectedRouter } from 'connected-react-router';
import createStore from '../../redux/store';

import { Pages } from '../index';

const { store, persistor, history } = createStore();

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ConnectedRouter history={history}>
              <Switch>
                <Route exact path="/" render={() => <Pages.Landing />} />
                <Route exact path="/resolver" render={() => <Pages.Resolver />} />
                <Route render={() => <Pages.NotFound />} />
              </Switch>
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </div>
    );
  }
}

export default App;
