import { describe, expect, test } from "vitest";
import { curl, straighten, toggle } from "../src/quoteFormatter";

describe("curl", () => {
	test.for([
		["\"Hey\"", "\u201CHey\u201D"],
		["\"Hey", "\u201CHey"],
		["Hey\"", "Hey\u201D"],
		["'Hey'", "\u2018Hey\u2019"],
		["'Hey", "\u2018Hey"],
		["Hey'", "Hey\u2019"],
		["\"Hey,\" she said.", "\u201CHey,\u201D she said."],
		["And then: \"What?!\"", "And then: \u201CWhat?!\u201D"],
		["\"Hey! Don't do that!\"", "\u201CHey! Don\u2019t do that!\u201D"],
		[
			"\"She said, 'hi' to me.\"",
			"\u201CShe said, \u2018hi\u2019 to me.\u201D",
		],
		["\"'Hi,' is what he told me.\"", "\u201C\u2018Hi,\u2019 is what he told me.\u201D"],
		["\"'Hi'\"", "\u201C\u2018Hi\u2019\u201D"],
		["don't", "don\u2019t"],
		["'cause I said so", "\u2018cause I said so"],
		["(\"quoted\")", "(\u201Cquoted\u201D)"],
		["", ""],
		["no quotes here", "no quotes here"],
	])("curl(%j) -> %j", ([input, expected]) => {
		expect(curl(input)).toBe(expected);
	});

	test("preserves already-curly characters", () => {
		const input = "\u201CHey\u201D and \u2018there\u2019";
		expect(curl(input)).toBe(input);
	});

	test("mixed straight and curly: only straight chars are converted", () => {
		const input = "\u201CHey,\u201D 'she' said.";
		expect(curl(input)).toBe("\u201CHey,\u201D \u2018she\u2019 said.");
	});
});

describe("straighten", () => {
	test.for([
		["\u201CHey\u201D", "\"Hey\""],
		["\u2018Hey\u2019", "'Hey'"],
		["\u201CShe said, \u2018hi\u2019 to me.\u201D", "\"She said, 'hi' to me.\""],
		["don\u2019t", "don't"],
		["", ""],
		["no quotes here", "no quotes here"],
	])("straighten(%j) -> %j", ([input, expected]) => {
		expect(straighten(input)).toBe(expected);
	});

	test("preserves already-straight characters", () => {
		const input = "\"Hey\" and 'there'";
		expect(straighten(input)).toBe(input);
	});

	test("round-trips: curl then straighten returns the original", () => {
		const inputs = [
			"\"Hey,\" she said.",
			"\"Hey! Don't do that!\"",
			"\"She said, 'hi' to me.\"",
			"\"'Hi'\"",
		];
		for (const input of inputs) {
			expect(straighten(curl(input))).toBe(input);
		}
	});
});

describe("toggle", () => {
	test("curls when input contains any straight quote", () => {
		expect(toggle("\"Hey\"")).toBe("\u201CHey\u201D");
	});

	test("curls when input contains any straight apostrophe", () => {
		expect(toggle("don't")).toBe("don\u2019t");
	});

	test("curls when input mixes straight and curly", () => {
		expect(toggle("\u201CHey\u201D and 'there'")).toBe(
			"\u201CHey\u201D and \u2018there\u2019",
		);
	});

	test("straightens when input is fully curly", () => {
		expect(toggle("\u201CHey\u201D and \u2018there\u2019")).toBe(
			"\"Hey\" and 'there'",
		);
	});

	test("straightens (no-op) when input has no quotes at all", () => {
		expect(toggle("no quotes here")).toBe("no quotes here");
	});

	test("toggling twice round-trips a straight string", () => {
		const input = "\"Hey! Don't do that!\"";
		expect(toggle(toggle(input))).toBe(input);
	});
});
