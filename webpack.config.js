//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

//
// Build production bundles with
//
//   npm run build
//
// Run webpack in development mode with
//
//   npm run dev
//

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

function abspath (p) {
    return path.resolve(__dirname, p)
}

module.exports = (env, argv) => ({
    entry: {
        'immortal-db': abspath('src/index.js'),
        ...(argv.mode === 'production' &&
            {'immortal-db.min': abspath('src/index.js')}),
    },
    output: {
        library: 'ImmortalDB',
        libraryTarget: 'umd',
        filename: '[name].js',
        path: abspath('./dist/'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'head',
            template: abspath('./testing/test.html'),
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js(\?.*)?$/i,
            }),
        ]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {
                            corejs: 3,
                            useBuiltIns: 'usage',
                        }]]
                    }
                }
            }
        ]
    },
    devServer: {
        port: 9234,
    },
})
