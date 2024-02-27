import path from 'path';

export default {
  entry: './index.tsx', // Adjust the path to your TypeScript entry file
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
		  
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript', // Add TypeScript preset
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
	alias: {
		'react': 'preact/compat',
		'react-dom/test-utils': 'preact/test-utils',
		'react-dom': 'preact/compat',
	  },
  },
  devServer: {
    compress: true,
  },
};
