import { withHandlers } from 'recompose';

import axios from 'axios';

const API_BASE = 'http://localhost:5000/did-box/us-central1/API/v1';

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
