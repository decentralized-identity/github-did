import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { Route, Switch } from 'react-router'; // react-router v4
import { ConnectedRouter } from 'connected-react-router';
import createStore from '../../redux/store';

import { Pages } from '../index';
import withTracker from '../../utils/withTracker';


const { store, persistor, history } = createStore();
const TrackedSwitch = withTracker(Switch);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ConnectedRouter history={history}>
              <TrackedSwitch>
                <Route exact path="/" render={() => <Pages.Landing />} />
                <Route exact path="/resolver" render={() => <Pages.Resolver />} />
                <Route exact path="/wallet" render={() => <Pages.Wallet />} />
                <Route path="/sign/:base64EncodedJsonLd" render={() => <Pages.Sign />} />
                <Route path="/verify/:base64EncodedJsonLd" render={() => <Pages.Verify />} />
                <Route path="/encrypt/:base64EncodedJsonLd" render={() => <Pages.Encrypt />} />
                <Route path="/decrypt/:base64EncodedJsonLd" render={() => <Pages.Decrypt />} />
                <Route exact path="/credits" render={() => <Pages.Credits />} />
                <Route render={() => <Pages.NotFound />} />
              </TrackedSwitch>
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </div>
    );
  }
}

export default App;
