import { compose } from 'recompose';

import withRedux from './redux';
import withHandlers from './handlers';

import snackbarRedux from '../snackbar/redux';

export default compose(
  withRedux,
  snackbarRedux,
  withHandlers,
);
