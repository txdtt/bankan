import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
    devtool: 'source-map',

    entry: {
        main: './client/public/scripts/main.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist/'), // Base dist directory
        filename: 'scripts/[name].bundle.js', // Output to scripts/
        publicPath: '/',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './client/public/index.html',
            filename: 'public/index.html', 
            inject: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './client/public/favicon.ico', to: 'public/favicon.ico' },
                { from: './client/public/styles.css',  to: 'public/styles.css' },
                { from: './client/public/signup.html', to: 'public/signup.html' },
                { from: './client/public/board.html',  to: 'public/board.html' },
            ],
        }),
    ],
    mode: 'production',
};
