/**
 * Unit tests for musicutils
 */

import { normalize_pitch, display_pitch, strip_accidental } from './musicutils';
import {
    SHARP,
    GENERIC_NOTE_NAME,
    LETTER_NAME,
    SOLFEGE_NAME,
    EAST_INDIAN_SOLFEGE_NAME,
    SCALAR_MODE_NUMBER,
    CUSTOM_NAME,
    UNKNOWN_PITCH_NAME,
} from './musicutils';

describe("NORMALIZE TESTS", () => {

    test('Normalize pitch', () => {
        expect(normalize_pitch("C" + SHARP)).toBe('c#');
    });

    test("Display pitch", () => {
        expect(display_pitch("c#")).toBe("C" + SHARP);
    });

})

describe("Strip accidentals", () => {

    test('strip accidental c#', () => {
        expect(strip_accidental("c#")[0]).toBe("c");
    });

    test('strip accidental cbb 0', () => {
        expect(strip_accidental("cbb")[0]).toBe("c");
    });

    test('strip accidental cbb 1', () => {
        expect(strip_accidental("cbb")[1]).toBe(-2);
    });

    test('strip accidental cb 0', () => {
        expect(strip_accidental("cb")[0]).toBe("c");
    });

    test('strip accidental cb 1', () => {
        expect(strip_accidental("cb")[1]).toBe(-1);
    });

    test('strip accidental b 0', () => {
        expect(strip_accidental("b")[0]).toBe("b");
    });

    test('strip accidental b 1', () => {
        expect(strip_accidental("b")[1]).toBe(0);
    });
    
})
