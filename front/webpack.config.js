const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "js/script.js"),
    product: path.join(__dirname, "js/product.js"),
    confirmation: path.join(__dirname, "js/confirmation.js"),
    cart: path.join(__dirname, "js/cart.js"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./images/*",
          to: "images/[name][ext]",
        },
        {
          from: "./images/icons/*",
          to: "images/icons/[name][ext]",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "./html/index.html"),
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      filename: "product.html",
      template: path.join(__dirname, "./html/product.html"),
      chunks: ["product"],
    }),
    new HtmlWebpackPlugin({
      filename: "confirmation.html",
      template: path.join(__dirname, "./html/confirmation.html"),
      chunks: ["confirmation"],
    }),
    new HtmlWebpackPlugin({
      filename: "cart.html",
      template: path.join(__dirname, "./html/cart.html"),
      chunks: ["cart"],
    }),
  ],
  stats: "minimal",
  mode: "development",
  // devtool: "source-map",
  devServer: {
    liveReload: true,
    open: true,
    // static: path.resolve(__dirname, "./dist"),
    // port: 4000,
  },
};
