// @flow
import { handleActions } from 'redux-actions';

// Actions.
import { snackbarMessage } from './actions';

// State.
const initialState = {
  version: 0,
};

export default handleActions(
  {
    [snackbarMessage]: (state, { payload }) => ({ ...state, ...payload }),
  },
  initialState,
);
