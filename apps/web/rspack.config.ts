import { resolve } from "path";
import { rspack } from "@rspack/core";

export default {
	entry: {
		main: "./apps/web/src/route.ts"
	},
	experiments: {
		css: true
	},
	externalsType: "commonjs",
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				use: {
					loader: "builtin:swc-loader",
					options: {
						jsc: {
							parser: {
								decorators: true,
								syntax: "typescript"
							}
						}
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "builtin:lightningcss-loader",
						options: {
							targets: ">0.4%"
						}
					}
				],
				type: "css/auto"
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "apps/web/src/index.html"
		})
	],
	output: {
		path: resolve(process.cwd(), "dist/web")
	},
	resolve: {
		extensions: [".js", ".ts", ".json"]
	}
};
