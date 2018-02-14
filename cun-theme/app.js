/*eslint-env node */

const PORT = process.env.PORT || 3033;
const BRAND = process.env.BRAND || 'whitelabel';

const moduleAlias = require('module-alias');
const { camelCase } = require('lodash');

const packageName = camelCase(require('./package.json').name.split('/').pop());

// path where content lives in AEM
const publicPath = `/etc/designs/${packageName}/`;

const express = require('express');
const babel = require('babel-core');
const ReactDOMServer = require('react-dom/server');

const webpack = require('webpack');
const wpMiddleware = require('webpack-dev-middleware');
const wpConfig = require('./webpack.config');
const wpHotMiddleware = require('webpack-hot-middleware');

const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const clearRequire = require('clear-require');

const app = express();
const wpCompiler = webpack(wpConfig);

const themeLocation = path.resolve(__dirname, 'themes', BRAND);

// important alias
moduleAlias.addAlias('platform-theme', themeLocation);
require('ignore-styles').default(['.css']);

app.use(wpMiddleware(wpCompiler, {
    serverSideRender: true,
    noInfo: true
}));

app.use(wpHotMiddleware(wpCompiler));

app.use(publicPath, express.static(themeLocation, {fallthrough: true}));

const normalizeAssets = assets => (Array.isArray(assets) ? assets : [assets]);

app.use('/template/:templateName', (req, res) => {

    const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;

    const componentData = '[]';

    const renderedPage = '';

    const {templateName} = req.params;

    const scripts = Object.entries(assetsByChunkName)
        .map(([k, p]) => ([k, normalizeAssets(p)]))
        .filter(([k, p]) => p.indexOf(`js/mediators/${templateName}.js`) + 1)
        .map(([k, p]) => (p.map(p1 => `<script data-webkit-id="${k}" src="/${p1}"></script>`).join('\n')))
        .join('');

    // TODO: Use the Babel AST to read the contents of the mediator searching for mediator.initReact TEMPLATE_COMPONENTS
    // add the data to the SR object
    // TODO: Strip this out and put it in an ejs file
    res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title>${packageName} - ${templateName}</title>
	<script>
	var SR = {components:{data:${componentData}}};
    
	</script>
  </head>
  <body>
  <div id='main'>${renderedPage}</div>
    ${scripts}
  </body>
</html>
`);

});

const server = require('http').createServer(app);

server.listen(PORT);

// Setup babel transform on components for use with SSR
chokidar.watch(['components/**/*.js', 'library/js/**/*.js'], {ignored: ['components/**/test', 'library/js/mediators', 'library/js/vendor']}).on('all', (event, filePath) => {

    const code = babel.transformFileSync(filePath).code;
    const outputPath = path.resolve(__dirname, 'dist', filePath);

    mkdirp.sync(path.dirname(outputPath));

    fs.writeFile(outputPath, code, err => {
        if (err) throw err;
        clearRequire(outputPath.replace(/\.js$/, ''));
    });
});

// copy json and css to output
chokidar.watch(['components/**/*.json', 'components/**/styles/*.css' ]).on('all', (event, filePath) => {
    const outputPath = path.resolve(__dirname, 'dist', filePath);

    mkdirp.sync(path.dirname(outputPath));

    fs.copySync(filePath, outputPath);

    if(!/\.css$/.test(filePath)) {
        clearRequire(outputPath.replace(/\.json$/, ''));
    }
});
