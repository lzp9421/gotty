var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: "./src/main.ts",
    output: {
        filename: "./gotty-bundle.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                include: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            // publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: true, // console
                    drop_console: true,
                    pure_funcs: ['console.log'] // 移除console
                },
                output: {
                    comments: false
                }
            },
            parallel: true
        }),
        new MiniCssExtractPlugin({
            filename: "gotty.css"
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
            canPrint: true
        })
    ]
};
