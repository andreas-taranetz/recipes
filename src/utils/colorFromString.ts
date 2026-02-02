/**
 * Generates a consistent HSL color from a string
 * @param str - Input string (e.g., recipe title)
 * @returns HSL color string like "hsl(210, 70%, 60%)"
 */
export function colorFromString(str: string): string {
	// Simple hash function to generate a numeric hash value from the string
	let hashValue = 0;
	for (let i = 0; i < str.length; i++) {
		hashValue = str.charCodeAt(i) + ((hashValue << 5) - hashValue);
	}

	// Convert to positive number and get hue (0-360)
	const hue = Math.abs(hashValue) % 360;

	// Use pleasant saturation and lightness values
	const saturation = 65;
	const lightness = 55;

	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
