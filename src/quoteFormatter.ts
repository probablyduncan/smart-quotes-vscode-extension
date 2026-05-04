export const STRAIGHT_DOUBLE = '"';
export const STRAIGHT_SINGLE = "'";
export const OPEN_DOUBLE = "\u201C";
export const CLOSE_DOUBLE = "\u201D";
export const OPEN_SINGLE = "\u2018";
export const CLOSE_SINGLE = "\u2019";

const STRAIGHT_PATTERN = /["']/;
const CURLY_DOUBLE_PATTERN = /[\u201C\u201D]/g;
const CURLY_SINGLE_PATTERN = /[\u2018\u2019]/g;

function isOpeningContext(prev: string): boolean {
	if (prev === "") {
		return true;
	}
	if (/\s/.test(prev)) {
		return true;
	}
	if (prev === "(" || prev === "[" || prev === "{") {
		return true;
	}
	if (prev === OPEN_DOUBLE || prev === OPEN_SINGLE) {
		return true;
	}
	return false;
}

/**
 * Convert straight quotes (") and apostrophes (') in `input` to their curly
 * variants. Already-curly characters are preserved.
 *
 * Direction is inferred from the previously emitted character:
 * - At start-of-string, after whitespace, after an opening bracket, or after
 *   an already-emitted opening curly: open.
 * - Otherwise: close. This means in-word apostrophes (don't) become right
 *   singles (don\u2019t), as does any apostrophe not preceded by whitespace.
 */
export function curl(input: string): string {
	let out = "";
	for (const ch of input) {
		const prev = out.length > 0 ? out[out.length - 1] : "";
		if (ch === STRAIGHT_DOUBLE) {
			out += isOpeningContext(prev) ? OPEN_DOUBLE : CLOSE_DOUBLE;
		} else if (ch === STRAIGHT_SINGLE) {
			out += isOpeningContext(prev) ? OPEN_SINGLE : CLOSE_SINGLE;
		} else {
			out += ch;
		}
	}
	return out;
}

/**
 * Convert curly quotes/apostrophes in `input` back to their straight ASCII
 * equivalents. Already-straight characters are preserved.
 */
export function straighten(input: string): string {
	return input
		.replace(CURLY_DOUBLE_PATTERN, STRAIGHT_DOUBLE)
		.replace(CURLY_SINGLE_PATTERN, STRAIGHT_SINGLE);
}

/**
 * If `input` contains any straight quote/apostrophe, curl everything.
 * Otherwise straighten everything. Mirrors how a bold/italic toggle behaves
 * in word processors: turn it on unless it's fully on, then turn it off.
 */
export function toggle(input: string): string {
	return STRAIGHT_PATTERN.test(input) ? curl(input) : straighten(input);
}
