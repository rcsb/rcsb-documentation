const path = require('path');

module.exports = {
  entry: './src/components/Documentation.js', // Adjust the path to your main component file
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    library: 'Documentation',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Include .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  }
};
