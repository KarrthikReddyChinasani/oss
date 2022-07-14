const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const config = {
  entry: {
    popup: path.join(__dirname, "src/popup.tsx"),
    content: path.join(__dirname, "src/content.ts"),
    background: path.join(__dirname, "src/background.ts"),
  },
  output: { path: path.join(__dirname, "dist"), filename: "[name].js" },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
      "utils": path.resolve(__dirname, 'src', 'utils'),
      "components": path.resolve(__dirname, 'src', 'components'),
      "pages": path.resolve(__dirname, 'src', 'pages')
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      (compiler) => {
        new TerserPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              comparisons: false,
              pure_funcs: ['console.info', 'console.debug'] 
            },
            parse: {},
            mangle: true,
            output: {
              comments: false,
              ascii_only: true,
            },
          }
        }).apply(compiler);
      },
    ],
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
  ],
};

module.exports = config;
