import { handleActions } from 'redux-actions';

import { didResolved } from './actions';

const initialState = {
  version: 0,
  dids: {},
  boxExploreTokens: {},
};

export default handleActions(
  {
    [didResolved]: (state, { payload }) => ({
      ...state,
      ...payload,
      dids: {
        ...state.dids,
        [payload.didDocument.id]: payload.didDocument,
      },
    }),
  },
  initialState,
);
