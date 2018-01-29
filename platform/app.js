/*eslint-env node */

const PORT = process.env.PORT || 3033;
const BRAND = process.env.BRAND || 'whitelabel';

const moduleAlias = require('module-alias');

const packageName = require('./package.json').name.split('/')[1];

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

moduleAlias.addAlias('platform-theme', path.resolve(__dirname, 'themes', BRAND));
require('ignore-styles').default(['.css']);

app.use(wpMiddleware(wpCompiler, {
    serverSideRender: true,
    noInfo: true
}));

app.use(wpHotMiddleware(wpCompiler));

app.use('/components/:componentId', (req, res) => {

    try {
        const module = require(`./dist/components/${ req.params.componentId }`).default;

        res.send(ReactDOMServer.renderToStaticMarkup(module()));
    } catch (e) {
        res.sendStatus(500);

        console.warn(e);
    }

});

app.use(publicPath, express.static(path.resolve(__dirname, 'dist')));

const normalizeAssets = assets => {
    return Array.isArray(assets) ? assets : [assets];
};

app.use('/template/:templateName', (req, res) => {

    const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;

    const scripts = Object.entries(assetsByChunkName)
        .map(([k, p]) => ([k, normalizeAssets(p)]))
        .filter(([k, p]) => p.indexOf(`js/mediators/${req.params.templateName}.js`) + 1)
        .map(([k, p]) => (p.map(p1 => `<script data-webkit-id="${k}" src="/${p1}"></script>`).join('\n')))
        .join('');

    res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title></title>
	<script>var SR = {components:{data:[]}};</script>
  </head>
  <body>
  <div id='main'></div>
    ${scripts}
  </body>
</html>
  `);

});

const server = require('http').createServer(app);

server.listen(PORT);

// Setup babel transform on components for use with SSR
chokidar.watch(['components/**/*.js', 'js/**/*.js'], {ignored: ['components/**/test/*', 'js/mediators']}).on('all', (event, filePath) => {

    const code = babel.transformFileSync(filePath).code;
    const outputPath = path.resolve(__dirname, 'dist', filePath);

    mkdirp.sync(path.dirname(outputPath));

    fs.writeFile(outputPath, code, err => {
        if (err) throw err;
        clearRequire(outputPath.replace(/\.js$/, ''));
    });
});

// copy json and css to output
chokidar.watch(['components/**/*.json', 'components/**/*.css' ]).on('all', (event, filePath) => {
    const outputPath = path.resolve(__dirname, 'dist', filePath);

    mkdirp.sync(path.dirname(outputPath));

    fs.copySync(filePath, outputPath);

    if(!/\.css$/.test(filePath)) {
        clearRequire(outputPath.replace(/\.json$/, ''));
    }
});
