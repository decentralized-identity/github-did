import { compose } from 'recompose';

import withRedux from './redux';
import withHandlers from './handlers';

export default compose(
  withRedux,
  withHandlers,
);
