const path = require('path');

module.exports = (BRAND, dir = __dirname ) => ({
    '@carnival-abg/cun$': path.resolve(dir, 'components', 'index.js'),
    'platform-theme': path.resolve(dir, 'themes', BRAND),
    'cun-theme': path.resolve(dir, 'themes', BRAND)
});
