interface ArcOptions {
	angle1: int,
	angle2: int,
	ctx: CanvasRenderingContext2D,
	radius: int,
	rounding?: int,
	thickness?: int,
	x: int;
	y: int;
}

function arc(options: ArcOptions) {
	const { angle1, angle2, ctx, radius, x, y } = options;

	ctx.beginPath();
	ctx.arc(x, y, radius, angle1, angle2);

	ctx.stroke();
}

export default arc;
