const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        background: path.join(__dirname, "src/background/index.ts"),
        content: path.join(__dirname, "src/content-script/index.tsx"),
        popup: path.join(__dirname, "src/popup/index.tsx")
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "js/[name].js",
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: ['raw-loader', 'sass-loader'],
            },
            {
                test: /\.(jpg|png|svg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "public"),
                    to: path.join(__dirname, "dist"),
                },
                {
                    from: path.join(__dirname, "src/_locales"),
                    to: path.join(__dirname, "dist/_locales"),
                },
                {
                    from: path.join(__dirname, "src/popup/popup.html"),
                    to: path.join(__dirname, "dist"),
                },
            ]
        }),
    ],
    devtool: 'cheap-module-source-map',
    cache: true,
    watchOptions: {
        poll: true,
    },
}
