var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./src/main.ts",
    output: {
        filename: "./gotty-bundle.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
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
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};
