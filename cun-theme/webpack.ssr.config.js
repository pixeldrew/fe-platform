/*eslint-env node */

const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// process ENV
const env = process.env;
const NODE_ENV = env.NODE_ENV || 'development';
const BRAND = env.BRAND || 'cun';

const alias = require('./webpackAliases')(BRAND, 'dist');
const packageName = require('./package.json').name.split('/')[1];

let entry = {
    main: path.resolve(__dirname, 'dist', 'library', 'js', 'ssr')
};

const aem = {

    devtool: 'none',

    entry,

    output: {
        path: path.resolve(__dirname, 'dist', 'jcr_root', 'apps', packageName),
        libraryTarget: 'umd',
        filename: `server.js`,
        library: packageName
    },

    resolve: {
        alias
    },

    plugins: [

        new webpack.NormalModuleReplacementPlugin(
            /\.css$/,
            require.resolve('@carnival-abg/platform/dist/library/js/ssr/null-style')
        ),

        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr|it|en|es|nl/),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        })

    ]
};

const node = Object.assign({}, aem);

node.externals = [nodeExternals()];
node.target = 'node';
delete node.stats;

node.entry = {
    main: path.resolve(__dirname, 'dist', 'components')
};

node.output = {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    filename: `${packageName}.umd.js`,
    library: packageName
};

module.exports = [aem, node];
