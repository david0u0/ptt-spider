const path = require('path');
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	target: 'electron-renderer',
	entry: {
		index: './frontend/app.tsx'
	},
	resolve: {
		mainFields: ['browser', 'main', 'module'],
		extensions: ['.ts', '.tsx', '.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist/frontend'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/typescript',
							],
						}
					},
				]
			},
			{
				test: /\.tsx$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/typescript',
								'@babel/preset-react'
							],
						}
					},
				]
			}
		]
	},
	mode: 'development'
};
