import { resolve } from "path";
import { rspack } from "@rspack/core";

export default {
	entry: {
		canvas: "./src/canvas/canvas.ts",
		charts_graph: "./src/canvas/charts/graph/main.ts",
		charts_label: "./src/canvas/charts/label.ts",
		charts_pie: "./src/canvas/charts/pie/main.ts",
		charts_scatter: "./src/canvas/charts/scatter/main.ts",
		list: "./src/list.ts",
		title: "./src/title.ts"
	},
	experiments: {
		css: true,
		//outputModules: true
	},
	//externalsType: "commonjs",
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
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin({
				module: true,
				minify: false
			})
		]
	},
	output: {
		chunkFormat: "module",
    chunkLoading: "import",
		library: {
			type: "module"
		},
		module: true,
		path: resolve(process.cwd(), "dist"),
		workerChunkLoading: "import",
	},
	resolve: {
		extensions: [".js", ".ts", ".json"]
	}
};
