import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
    devtool: 'source-map',

    entry: {
        main: './frontend/public/scripts/main.ts',
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
            template: './frontend/public/index.html',
            filename: 'public/index.html', // Keeps index.html inside dist/public/
            inject: true, // Automatically injects scripts
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './frontend/public/favicon.ico', to: 'public/favicon.ico' },
                { from: './frontend/public/styles.css', to: 'public/styles.css' },
            ],
        }),
    ],
    mode: 'production',
};
