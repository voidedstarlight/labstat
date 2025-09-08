declare module "figlet/importable-fonts/Slant.js" {
	const slant: string;
	export default slant;
}

declare module "figlet" {
	function figlet(text: string, options: unknown, callback: unknown): unknown;
	namespace figlet {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const parseFont: (name: string, data: unknown) => void;
	}

	export default figlet;
}
