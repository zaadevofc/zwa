const fs = require('fs');
const path = require('path');

module.exports = (file) => {
  fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`File ${path.basename(file)} refresh!`);
    delete require.cache[file];
    require(require.resolve(file));
  });
};
