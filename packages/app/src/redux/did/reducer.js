import { handleActions } from 'redux-actions';

import { didResolved, set } from './actions';

const initialState = {
  version: 0,
  resolving: false,
  dids: {},
};

export default handleActions(
  {
    [set]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
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
