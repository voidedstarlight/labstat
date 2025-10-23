import { resolve } from "path";

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
	output: {
		path: resolve(process.cwd(), "dist")
	},
	resolve: {
		extensions: [".js", ".ts", ".json"]
	}
};
