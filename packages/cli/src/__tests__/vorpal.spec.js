const vorpal = require('vorpal')();

describe('vorpal', () => {
  it('its a cli tool', () => {
    expect(vorpal).toBeDefined();
  });
});
