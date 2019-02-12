import { createAction } from 'redux-actions';

export const snackbarMessage = createAction('snackbar/MESSAGE', ({ snackbarMessage }) => ({
  snackbarMessage,
}));
