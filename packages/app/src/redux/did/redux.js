import { connect } from 'react-redux';

import { didResolved } from './actions';

export default connect(
  ({ did }) => ({ did }),
  {
    didResolved,
  },
);
