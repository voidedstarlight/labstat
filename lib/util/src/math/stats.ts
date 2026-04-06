function sum(values: Array<number>): number {
	const first = values.at(0);
	if (!first) return 0;

	return first + sum(values.slice(1));
}

function percentInRange(value: number, min: number, max: number): number {
	/**
	 * Percent position of a value in a range
	 */

	const range = max - min;
	const clamped_value = value - min;

	return clamped_value / range;
}

function mean(...values: Array<number>): number {
	return sum(values) / values.length;
}

function squaredDeviations(
	values: Array<number>, mean_value: number
): Array<number> {
	const first = values.at(0);
	if (!first) return [];

	return [
		(first - mean_value) ** 2,
		...squaredDeviations(values.slice(1), mean_value)
	];
}

function stddev(values: Array<number>, mean_value?: number): number {
	const deviations = squaredDeviations(values, mean_value ?? mean(...values));
	const variance = mean(...deviations);
	return Math.sqrt(variance);
}

export { mean, percentInRange, stddev, sum };
