import { Musicutils } from './musicutils';

describe('class Musicutils', () => {
    describe('Validate stripAccidental', () => {
        const mu = new Musicutils();
        test('Test stripAccidental on pitch gbb', () => {
            expect(mu.stripAccidental('gbb')).toEqual(['g', -2]);
        });
        test('Test stripAccidental on pitch d𝄫', () => {
            expect(mu.stripAccidental('d𝄫')).toEqual(['d', -2]);
        });
        test('Test stripAccidental on pitch c♭', () => {
            expect(mu.stripAccidental('c♭')).toEqual(['c', -1]);
        });
        test('Test stripAccidental on pitch a♯', () => {
            expect(mu.stripAccidental('a♯')).toEqual(['a', 1]);
        });
        test('Test stripAccidental on pitch b♮', () => {
            expect(mu.stripAccidental('b♮')).toEqual(['b', 0]);
        });
    });
    describe('Validate normalizePitch', () => {
        const mu = new Musicutils();
        test('Generate normalized pitch of C♭ and verify', () => {
            expect(mu.normalizePitch('C♭')).toEqual('cb');
        });
        test('Generate normalized pitch of C♯ and verify', () => {
            expect(mu.normalizePitch('C♯')).toEqual('c#');
        });
        test('Generate normalized pitch of C♮ and verify', () => {
            expect(mu.normalizePitch('C♮')).toEqual('c');
        });
        test('Generate normalized pitch of C and verify', () => {
            expect(mu.normalizePitch('C𝄫')).toEqual('cbb');
        });
    });
    describe('Validate displayPitch', () => {
        const mu = new Musicutils();
        test('Generate diplay pitch of cb and verify', () => {
            expect(mu.diplayPitch('cb')).toEqual('C♭');
        });
        test('Generate diplay pitch of d# and verify', () => {
            expect(mu.diplayPitch('d#')).toEqual('D♯');
        });
        test('Generate diplay pitch of dbb and verify', () => {
            expect(mu.diplayPitch('dbb')).toEqual('D𝄫');
        });
    });
    describe('Validate isASharp', () => {
        const mu = new Musicutils();
        test('Check if c# is a sharp pitch', () => {
            expect(mu.isASharp('c#')).toEqual(true);
        });
        test('Check if g is a sharp pitch', () => {
            expect(mu.isASharp('g')).toEqual(true);
        });
        test('Check if bb is a sharp pitch', () => {
            expect(mu.isASharp('bb')).toEqual(false);
        });
    });
    describe('Validate findSharpIndex', () => {
        const mu = new Musicutils();
        test('Generate index of the sharp pitch d# and verify', () => {
            expect(mu.findSharpIndex('d#')).toEqual(3);
        });
        test('Generate index of the sharp pitch c# and verify', () => {
            expect(mu.findSharpIndex('c#')).toEqual(1);
        });
        test('Generate index of the sharp pitch gx and verify', () => {
            expect(mu.findSharpIndex('gx')).toEqual(9);
        });
    });
    describe('Validate isAFlat', () => {
        const mu = new Musicutils();
        test('Check if bb is a flat pitch', () => {
            expect(mu.isAFlat('bb')).toEqual(true);
        });
        test('Check if g is a flat pitch', () => {
            expect(mu.isAFlat('g')).toEqual(true);
        });
        test('Check if c# is a sharp pitch', () => {
            expect(mu.isAFlat('c#')).toEqual(false);
        });
        test('Check if a# is a sharp pitch', () => {
            expect(mu.isAFlat('a#')).toEqual(false);
        });
    });
    describe('Validate findFlatIndex', () => {
        const mu = new Musicutils();
        test('Generate index of the flat pitch db and verify', () => {
            expect(mu.findFlatIndex('db')).toEqual(1);
        });
        test('Generate index of the sharp pitch bbb and verify', () => {
            expect(mu.findFlatIndex('bbb')).toEqual(9);
        });
        test('Generate index of the sharp pitch gdb and verify', () => {
            expect(mu.findFlatIndex('gbb')).toEqual(5);
        });
    });
    describe('Validate getPitchType', () => {
        const mu = new Musicutils();
        test('Generate pitch type of bb pitch and verify', () => {
            expect(mu.getPitchType('bb')).toEqual('letter name');
        });
        test('Generate pitch type of do pitch and verify', () => {
            expect(mu.getPitchType('do')).toEqual('solfege name');
        });
        test('Generate pitch type of dha pitch and verify', () => {
            expect(mu.getPitchType('dha')).toEqual('east indian solfege name');
        });
        test('Generate pitch type of aaa pitch and verify', () => {
            expect(mu.getPitchType('aaa')).toEqual('unknown');
        });
    });
});
