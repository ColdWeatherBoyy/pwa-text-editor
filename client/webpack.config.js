const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest, GenerateSW } = require("workbox-webpack-plugin");

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
	return {
		mode: "development",
		entry: {
			main: "./src/js/index.js",
			install: "./src/js/install.js",
		},
		output: {
			filename: "[name].bundle.js",
			path: path.resolve(__dirname, "dist"),
		},
		plugins: [
			// html webpack plugin initialization
			new HtmlWebpackPlugin({
				template: "./index.html",
				title: "Jate",
			}),
			// inject manifest plugin initialization for source and destination
			new InjectManifest({
				swSrc: "./src-sw.js",
				swDest: "src-sw.js",
			}),
			// generate SW, used for image caching
			new GenerateSW({
				// excludes images from being cached initially
				exclude: [/\.(?:png|jpg|jpeg|svg)$/],

				// runtime caching for images
				runtimeCaching: [
					{
						urlPattern: /.(?:png|jpg|jpeg|svg)$/,
						handler: "CacheFirst",

						options: {
							cacheName: "images",
							expiration: { maxEntries: 10 },
						},
					},
				],
			}),
			// Webpack PWA Manifest plugin initialization
			new WebpackPwaManifest({
				// sets name and short name for app
				name: "Text Editor",
				short_name: "JATE",
				// sets background color for app
				background_color: "#FFFFFF",
				// sets display as standalone and orientation portrait
				display: "standalone",
				orientation: "portrait",
				// disables fingerprinting
				fingerprints: false,
				// set publicPath
				publicPath: "./",
				// set icon src and destination (and sizes that are saved)
				icons: {
					src: path.resolve("src/images/logo.png"),
					sizes: [96, 120, 152, 167, 180, 1024],
					destination: path.join("assets", "icons"),
				},
			}),
		],

		module: {
			rules: [
				// css loader rules
				{
					test: /\.css$/i,
					use: ["style-loader", "css-loader"],
				},
				// babel loader rules
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
							plugins: [
								"@babel/plugin-proposal-object-rest-spread",
								"@babel/transform-runtime",
							],
						},
					},
				},
			],
		},
	};
};
