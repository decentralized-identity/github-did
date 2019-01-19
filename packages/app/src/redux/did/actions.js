import { createAction } from 'redux-actions';

export const didResolved = createAction('DID/RESOLVED', ({ didDocument }) => ({
  didDocument,
}));
