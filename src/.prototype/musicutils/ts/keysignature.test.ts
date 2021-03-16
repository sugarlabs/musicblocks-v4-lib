/**
* Unit tests for KeySignature
*/

import { KeySignature } from './keysignature';

describe('KEY SIGNATURE TESTS', () => {

    const ks: KeySignature = new KeySignature('major','c');
    test('closest note tests', () => {
        expect(ks.closest_note('c')[0]).toBe('c');
        expect(ks.note_in_scale('c')).toBe(true);
        expect(ks.closest_note('f#')[0]).toBe('f');
        expect(ks.note_in_scale('f#')).toBe(false);
        expect(ks.closest_note('g#')[0]).toBe('g');
        expect(ks.note_in_scale('g#')).toBe(false);
        expect(ks.closest_note('cb')[0]).toBe('b');
        expect(ks.note_in_scale('cb')).toBe(true);
        expect(ks.closest_note('db')[0]).toBe('c');
        expect(ks.note_in_scale('db')).toBe(false);
        expect(ks.closest_note('n10#')[0]).toBe('n11');
        expect(ks.closest_note('n10x')[0]).toBe('n0');
        expect(ks.closest_note('sol')[0]).toBe('sol');
        expect(ks.closest_note('pa')[0]).toBe('pa');
    });

})