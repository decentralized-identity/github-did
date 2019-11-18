// eslint-disable-next-line
const request = require('supertest');

const app = require('../../app');

describe('DID', () => {
  describe('GET /did/:did', () => {
    it('should resolve a did', async () => {
      const res = await request(app)
        .get('/api/v1/did/did:github:OR13')
        .set('Accept', 'application/json');
      expect(res.body.id).toBe('did:github:OR13');
    });
  });
});
