let loaded: Promise;

async function loadFont(
	name: string,
	url: string,
	weight: int
)	{
	const font = new FontFace(name, `url(${url})`, {
		display: "swap",
		weight
	});

	await font.load();

	document.fonts.add(font);
}

function loadFonts() {
	loaded ??= loadFont(
		"Poppins",
		"https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2",
		700
	);

	return loaded;
}

export default loadFonts;
