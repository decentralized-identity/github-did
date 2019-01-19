import { withHandlers } from 'recompose';

import axios from 'axios';

const API_BASE = window.location.hostname === 'github-did.com'
  ? 'https://github-did.com/api/v1'
  : 'http://localhost:5000/github-did/us-central1/main/api/v1';

export default withHandlers({
  resolveDID: ({ didResolved }) => async (did) => {
    try {
      const { data } = await axios.get(`${API_BASE}/did/${did}`);
      didResolved({ didDocument: data });
    } catch (e) {
      console.error(e);
    }
  },
});
