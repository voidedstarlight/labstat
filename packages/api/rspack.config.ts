import { resolve } from "path";

export default {
	entry: {
		main: "./src/main.ts"
	},
	externals: {
		"node:fs": "commonjs fs",
		"node:crypto": "commonjs crypto",
		"argon2": "argon2",
		"pino": "pino",
		"thread-stream": "thread-stream",
		"pino-worker": "pino-worker",
		"pino-file": "pino-file",
		"pino-pretty": "pino-pretty"
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
			}
		]
	},
	output: {
		path: resolve(process.cwd(), "dist/api")
	},
	resolve: {
		extensions: [".js", ".ts", ".json"]
	},
	target: "node"
};
