const path = require('path');
const webpack = require('webpack');


const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;


module.exports = {
    // lintOnSave: false,
    // entry: path.resolve("./app.js"),
    // mode: true,
    
    // configureWebpack: {
    //     plugins: [new BundleAnalyzerPlugin()]
    // },

    // output:{
    //     filename: "app.js",
    //     path: path.resolve("./dist"),
    //     chunkFilename: "[name].js" 
    // },

    // module: {
    //     rules: [
    //         {
    //             test: /\.jsx?$/,
    //             loader: "babel-loader",
    //             exclude: [/node_modules/]
    //         }
    //     ]
    // },

    // plugins: [new BundleAnalyzerPlugin()]

};
