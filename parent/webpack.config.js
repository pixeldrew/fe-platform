/*eslint-env node */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const ENV = process.env;

const NODE_ENV = ENV.NODE_ENV || 'development';

const isDevelop = NODE_ENV === 'development';

const BRAND = ENV.BRAND || 'whitelabel';

const THEME_LOCATION = path.resolve(__dirname, 'themes', BRAND);

const postcssPlugins = require('./postcss/processors').processors(THEME_LOCATION);

const extractBundles = bundles => (
    isDevelop ? [] : bundles.map(bundle => new webpack.optimize.CommonsChunkPlugin(bundle))
);

let entry = {
    'js/mediators/home': [path.resolve(__dirname, 'js', 'mediators', 'home')],
    'js/mediators/aboutUsPage': [path.resolve(__dirname, 'js', 'mediators', 'aboutUsPage')]
};

if (isDevelop) {
    entry = Object.entries(entry).map(([key, value]) => [key, ['react-hot-loader/patch', 'webpack-hot-middleware/client', ...value]]).reduce((a, v) => {
        a[v[0]] = v[1];
        return a;
    }, {});
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
            carnival$: path.resolve(__dirname, 'components', 'index.js'),
            components: path.resolve(__dirname, 'components'),
            css: path.resolve(__dirname, 'css'),
            assets: path.resolve(__dirname, 'assets'),
            theme: path.resolve(__dirname, 'themes', BRAND)
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
                        name: file => file.split('assets/')[1],
                        publicPath: '/etc/designs/carnival/'
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                include: path.resolve(__dirname, 'assets', 'images'),
                use: [
                    isDevelop ? null : {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 85
                            }
                        }
                    },
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: file => file.split('assets/')[1],
                            publicPath: '/etc/designs/carnival/'
                        }
                    }
                ].filter(p => p)
            },
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'components'),
                    path.resolve(__dirname, 'js', 'mediators'),
                    path.resolve(__dirname, 'js', 'utils')
                ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: '.babel-cache'
                        }
                    },
                    isDevelop ? 'eslint-loader' : null
                ].filter(p => p)

            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'css'),
                    path.resolve(THEME_LOCATION, 'css')
                ],
                use: isDevelop ? [
                    {loader: 'style-loader', options: {sourceMap: true}},
                    {loader: 'css-loader', options: {modules: false, importLoaders: 1, sourceMap: true}},
                    {loader: 'postcss-loader', options: {sourceMap: true, plugins: postcssPlugins}}
                ] : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader', options: {modules: false, importLoaders: 1}},
                        {loader: 'postcss-loader', options: {sourceMap: false, plugins: postcssPlugins}}
                    ]
                })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        }),

        isDevelop ? new webpack.HotModuleReplacementPlugin() : null,

        isDevelop ? new webpack.NoEmitOnErrorsPlugin() : null,

        // isDevelop ? null : new webpack.optimize.AggressiveMergingPlugin({
        //     minSizeReduce: 2,
        //     moveToParents: true
        // }),

        ...extractBundles([
            {name: 'js/vendor', minChunks: ({resource}) => /node_modules/.test(resource)},
            {name: 'js/common', minChunks: 2}
        ]),

        isDevelop ? null : new ExtractTextPlugin({
            allChunks: true,
            filename (getPath) {

                console.log('extracting ', getPath('css/[name].css'));

                return getPath('css/[name].css').replace('css/js/mediators', 'css/pages').replace('js/common', 'css/common');
            }
        }),


        // isDevelop ? null : new OptimizeCssAssetsPlugin({
        //     cssProcessor: require('cssnano'),
        //     cssProcessorOptions: {discardComments: {removeAll: true}},
        //     canPrint: true
        // }),

        isDevelop ? null : new webpack.optimize.UglifyJsPlugin()

    ].filter(p => p),
    stats: {
        usedExports: true,
        optimizationBailout: true,
        entrypoints: true
    }
};
