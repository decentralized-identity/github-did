import { connect } from 'react-redux';

import * as actions from './actions';

export default connect(
  ({ did }) => ({ did }),
  {
    ...actions,
  },
);
