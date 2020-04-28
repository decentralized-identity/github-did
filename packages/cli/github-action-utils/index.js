const fs = require('fs');

// Export all files in the folder as strings
fs.readdirSync(__dirname + '/').forEach(file => {
  if (file !== 'index.js') {
    const content = fs.readFileSync(__dirname + '/' + file).toString();
    exports[file] = content;
  }
});