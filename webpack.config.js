const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "src/index.html" }),
    new MiniCssExtractPlugin(),
    new StyleExtHtmlWebpackPlugin()
  ]
};
