const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackNodeExternals = require('webpack-node-externals');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const postcssPlugins = require('./postcss/processors').processors;
const NODE_ENV = process.env.NODE_ENV || 'development';

const isDevelop = NODE_ENV === 'development';

const extractBundles = bundles => (
    isDevelop ? [] : bundles.map(bundle => new webpack.optimize.CommonsChunkPlugin(bundle))
);

let entry = {
    'js/mediators/home': [path.resolve(__dirname, 'js', 'mediators', 'home')]
};

if (isDevelop) {
    entry = Object.entries(entry).map(([key, value]) => [key, ['react-hot-loader/patch', 'webpack-hot-middleware/client', ...value]]).reduce((a, v) => {
        a[v[0]] = v[1];
        return a;
    }, {})
}

module.exports = {

    devtool: isDevelop ? 'eval-source-map' : 'none',

    entry,

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },

    resolve: {
        alias: {
            'carnival$': path.resolve(__dirname, 'components', 'index.js'),
            'components': path.resolve(__dirname, 'components'),
            'css': path.resolve(__dirname, 'css'),
            'assets': path.resolve(__dirname, 'assets'),
        }
    },

    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|woff2|otf|svg)(\?v=\d+\.\d+\.\d+)?$/,
                include: path.resolve(__dirname, 'assets', 'fonts'),
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: (file) => file.split('assets/')[1],
                        publicPath: '/etc/designs/carnival/'
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                include: path.resolve(__dirname, 'assets', 'images'),
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: (file) => file.split('assets/')[1],
                            publicPath: '/etc/designs/carnival/'
                        }
                    },
                    isDevelop ? null : {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 85
                            }
                        }
                    }
                ].filter(p => p)
            },
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'components'),
                    path.resolve(__dirname, 'js', 'mediators'),
                ],
                loader: 'babel-loader',
                options: {
                    cacheDirectory: '.babel-cache'
                }
            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'css')
                ],
                use: isDevelop ? [
                    'style-loader',
                    {loader: 'css-loader', options: {modules: false, importLoaders: 1}},
                    {loader: 'postcss-loader', options: {sourceMap: true, plugins: postcssPlugins}},
                ] : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader', options: {modules: false, importLoaders: 1}},
                        {loader: 'postcss-loader', options: {sourceMap: false, plugins: postcssPlugins}},
                    ]
                })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),

        isDevelop ? new webpack.HotModuleReplacementPlugin() : null,

        isDevelop ? new webpack.NoEmitOnErrorsPlugin() : null,

        ...extractBundles([
            {name: 'js/vendor', minChunks: ({resource}) => /node_modules/.test(resource)},
            {name: 'js/common', minChunks: ({resource}) => !/node_modules/.test(resource)},
        ]),

        isDevelop ? null : new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 2,
            moveToParents: true,
        }),
        isDevelop ? null : new ExtractTextPlugin({
            filename: function (getPath) {
                return getPath('css/[name].css').replace('css/js', 'css');
            }
        }),
        isDevelop ? null : new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {discardComments: {removeAll: true}},
            canPrint: true
        }),
        isDevelop ? null : new webpack.optimize.UglifyJsPlugin()
    ].filter(p => p)
};

