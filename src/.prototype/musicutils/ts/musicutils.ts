import { IMusicutils } from './@types/musicutils';

export class Musicutils implements IMusicutils {
    static readonly SHARP: string = '♯';
    static readonly FLAT: string = '♭';
    static readonly NATURAL: string = '♮';
    static readonly DOUBLESHARP: string = '𝄪';
    static readonly DOUBLEFLAT: string = '𝄫';

    static readonly CHROMATIC_NOTES_SHARP: Array<string> = [
        'c',
        'c#',
        'd',
        'd#',
        'e',
        'f',
        'f#',
        'g',
        'g#',
        'a',
        'a#',
        'b'
    ];

    static readonly CHROMATIC_NOTES_FLAT: Array<string> = [
        'c',
        'db',
        'd',
        'eb',
        'e',
        'f',
        'gb',
        'g',
        'ab',
        'a',
        'bb',
        'b'
    ];

    // Meantone temperaments use 21 notes
    static readonly ALL_NOTES: Array<string> = [
        'c',
        'c#',
        'db',
        'd',
        'd#',
        'eb',
        'e',
        'e#',
        'fb',
        'f',
        'f#',
        'gb',
        'g',
        'g#',
        'ab',
        'a',
        'a#',
        'bb',
        'b',
        'b#',
        'cb'
    ];

    static readonly SCALAR_MODE_NUMBERS: Array<string> = ['1', '2', '3', '4', '5', '6', '7'];
    static readonly SOLFEGE_NAMES: Array<string> = ['do', 're', 'me', 'fa', 'sol', 'la', 'ti'];
    static readonly EAST_INDIAN_NAMES: Array<string> = ['sa', 're', 'ga', 'ma', 'pa', 'dha', 'ni'];

    static readonly EQUIVALENT_FLATS: { [key: string]: string } = {
        'c#': 'db',
        'd#': 'eb',
        'f#': 'gb',
        'g#': 'ab',
        'a#': 'bb',
        'e#': 'f',
        'b#': 'c',
        'cb': 'cb',
        'fb': 'fb'
    };

    static readonly EQUIVALENT_SHARPS: { [key: string]: string } = {
        'db': 'c#',
        'eb': 'd#',
        'gb': 'f#',
        'ab': 'g#',
        'bb': 'a#',
        'cb': 'b',
        'fb': 'e',
        'e#': 'e#',
        'b#': 'b#'
    };

    // This notation only applies to temperaments with 12 semitones.
    static readonly PITCH_LETTERS: Array<string> = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

    // These defintions are only relevant to equal temperament.
    static readonly SOLFEGE_SHARP: Array<string> = [
        'do',
        'do#',
        're',
        're#',
        'me',
        'fa',
        'fa#',
        'sol',
        'sol#',
        'la',
        'la#',
        'ti'
    ];

    static readonly SOLFEGE_FLAT: Array<string> = [
        'do',
        'reb',
        're',
        'meb',
        'me',
        'fa',
        'solb',
        'sol',
        'lab',
        'la',
        'tib',
        'ti'
    ];

    static readonly EAST_INDIAN_SHARP: Array<string> = [
        'sa',
        'sa#',
        're',
        're#',
        'ga',
        'ma',
        'ma#',
        'pa',
        'pa#',
        'dha',
        'dha#',
        'ni'
    ];

    static readonly EAST_INDIAN_FLAT: Array<string> = [
        'sa',
        'reb',
        're',
        'gab',
        'ga',
        'ma',
        'pab',
        'pa',
        'dhab',
        'dha',
        'nib',
        'ni'
    ];

    static readonly SCALAR_NAMES_SHARP: Array<string> = [
        '1',
        '1#',
        '2',
        '2#',
        '3',
        '4',
        '4#',
        '5',
        '5#',
        '6',
        '6#',
        '7'
    ];

    static readonly SCALAR_NAMES_FLAT: Array<string> = [
        '1',
        '2b',
        '2',
        '3b',
        '3',
        '4',
        '4b',
        '5',
        '6b',
        '6',
        '7b',
        '7'
    ];

    static readonly EQUIVALENTS: { [key: string]: Array<string> } = {
        'ax': ['b', 'cb'],
        'a#': ['bb'],
        'a': ['a', 'bbb', 'gx'],
        'ab': ['g#'],
        'abb': ['g', 'fx'],
        'bx': ['c#'],
        'b#': ['c', 'dbb'],
        'b': ['b', 'cb', 'ax'],
        'bb': ['a#'],
        'bbb': ['a', 'gx'],
        'cx': ['d'],
        'c#': ['db'],
        'c': ['c', 'dbb', 'b#'],
        'cb': ['b'],
        'cbb': ['bb', 'a#'],
        'dx': ['e', 'fb'],
        'd#': ['eb', 'fbb'],
        'd': ['d', 'ebb', 'cx'],
        'db': ['c#', 'bx'],
        'dbb': ['c', 'b#'],
        'ex': ['f#', 'gb'],
        'e#': ['f', 'gbb'],
        'e': ['e', 'fb', 'dx'],
        'eb': ['d#', 'fbb'],
        'ebb': ['d', 'cx'],
        'fx': ['g', 'abb'],
        'f#': ['gb', 'ex'],
        'f': ['f', 'e#', 'gbb'],
        'fb': ['e', 'dx'],
        'fbb': ['eb', 'd#'],
        'gx': ['a', 'bbb'],
        'g#': ['ab'],
        'g': ['g', 'abb', 'fx'],
        'gb': ['f#', 'ex'],
        'gbb': ['f', 'e#']
    };

    static readonly CONVERT_DOWN: { [key: string]: string } = {
        c: 'b#',
        cb: 'b',
        cbb: 'a#',
        d: 'cx',
        db: 'c#',
        dbb: 'c',
        e: 'dx',
        eb: 'd#',
        ebb: 'd',
        f: 'e#',
        fb: 'e',
        fbb: 'd#',
        g: 'fx',
        gb: 'f#',
        gbb: 'f',
        a: 'gx',
        ab: 'g#',
        abb: 'g',
        b: 'ax',
        bb: 'a#',
        bbb: 'a'
    };

    static readonly CONVERT_UP: { [key: string]: string } = {
        'cx': 'd',
        'c#': 'db',
        'c': 'dbb',
        'dx': 'e',
        'd#': 'eb',
        'd': 'ebb',
        'ex': 'f#',
        'e#': 'f',
        'e': 'fb',
        'fx': 'g',
        'f#': 'gb',
        'f': 'gbb',
        'gx': 'a',
        'g#': 'ab',
        'g': 'abb',
        'ax': 'b',
        'a#': 'bb',
        'a': 'bbb',
        'bx': 'c#',
        'b#': 'c',
        'b': 'cb'
    };

    // Pitch name types
    static readonly GENERIC_NOTE_NAME = 'generic note name';
    static readonly LETTER_NAME = 'letter name';
    static readonly SOLFEGE_NAME = 'solfege name';
    static readonly EAST_INDIAN_SOLFEGE_NAME = 'east indian solfege name';
    static readonly SCALAR_MODE_NUMBER = 'scalar mode number';
    static readonly CUSTOM_NAME = 'custom name';
    static readonly UNKNOWN_PITCH_NAME = 'unknown';

    /**
     * @remarks Remove an accidental and return the number of half steps that
     * would have resulted from its application to the pitch
     *
     * @param pitch - Upper or lowecase pitch name with accidentals as ASCII or Unicode
     *
     * @returns an array (2-tuple) of the normalized pitch name and the change
     * in half steps represented by the removed accidental
     */
    public stripAccidental(pitch: string): [string, number] {
        if (pitch.length == 1) {
            return [pitch, 0];
        }
        if (pitch.length > 2 && pitch.endsWith('bb')) {
            return [pitch.slice(0, pitch.length - 2), -2];
        }
        if (pitch.endsWith('b')) {
            return [pitch.slice(0, pitch.length - 1), -1];
        }
        if (pitch.endsWith('#')) {
            return [pitch.slice(0, pitch.length - 1), 1];
        }
        if (pitch.endsWith('x')) {
            return [pitch.slice(0, pitch.length - 1), 2];
        }
        // And the Unicode versions...
        if (pitch.endsWith(Musicutils.DOUBLEFLAT)) {
            return [pitch.slice(0, pitch.length - 2), -2];
        }
        if (pitch.endsWith(Musicutils.FLAT)) {
            return [pitch.slice(0, pitch.length - 1), -1];
        }
        if (pitch.endsWith(Musicutils.SHARP)) {
            return [pitch.slice(0, pitch.length - 1), 1];
        }
        if (pitch.endsWith(Musicutils.DOUBLESHARP)) {
            return [pitch.slice(0, pitch.length - 1), 2];
        }
        if (pitch.endsWith(Musicutils.NATURAL)) {
            return [pitch.slice(0, pitch.length - 1), 0];
        }
        return [pitch, 0];
    }

    /**
     * @remarks Internally, we use a standardize form for our pitch letter names:
     *          - Lowercase c, d, e, f, g, a, b for letter names
     *          - #, b, x, and bb for sharp, flat, double sharp, and double flat for accidentals.
     * Note names for temperaments with more than 12 semitones are of the form: n0, n1, ...
     *
     * @param pitch Upper or lowecase pitch name with accidentals as ASCII or Unicode
     *
     * @returns Normalized pitch name
     */
    public normalizePitch(pitch: string): string {
        if (typeof pitch == 'number') {
            return pitch;
        }
        pitch = pitch.toLowerCase();
        pitch = pitch.replace(Musicutils.SHARP, '#');
        pitch = pitch.replace(Musicutils.DOUBLESHARP, 'x');
        pitch = pitch.replace(Musicutils.FLAT, 'b');
        pitch = pitch.replace(Musicutils.DOUBLEFLAT, 'bb');
        pitch = pitch.replace(Musicutils.NATURAL, '');
        return pitch;
    }

    /**
     * @remarks The internal pitch name is converted to unicode, e.g., cb --> C♭
     *
     * @param pitch - Upper or lowecase pitch name with accidentals as ASCII or Unicode
     * @returns Pretty pitch name
     */
    public diplayPitch(pitch: string): string {
        // Ignore pitch numbers and pitch expressed as Hertz
        if (typeof pitch == 'number') {
            return pitch;
        }
        let pitch_to_display: string = pitch[0].toUpperCase();
        if (pitch.length > 2 && pitch.slice(1, 3) == 'bb') {
            pitch_to_display += Musicutils.DOUBLEFLAT;
        } else if (pitch.length > 1) {
            if (pitch[1] == '#') {
                pitch_to_display += Musicutils.SHARP;
            } else if (pitch[1].toLowerCase() == 'x') {
                pitch_to_display += Musicutils.DOUBLESHARP;
            } else if (pitch[1].toLowerCase() == 'b') {
                pitch_to_display += Musicutils.FLAT;
            }
        }
        return pitch_to_display;
    }

    /**
     * @remarks Is the pitch a sharp or not flat?
     *
     * @param pitchName - The pitch name to test
     *
     * @returns Result of the test
     */
    public isASharp(pitchName: string): boolean {
        return pitchName.endsWith('#') || Musicutils.PITCH_LETTERS.includes(pitchName);
    }

    /**
     * @remarks Return the index value of the pitch name
     *
     * @param pitchName - The pitch name to test
     *
     * @returns Index into the chromatic scale with sharp notes
     */
    public findSharpIndex(pitchName: string): number {
        if (Musicutils.CHROMATIC_NOTES_SHARP.includes(pitchName)) {
            return Musicutils.CHROMATIC_NOTES_SHARP.indexOf(pitchName);
        }
        if (Musicutils.CONVERT_UP.hasOwnProperty(pitchName)) {
            const new_pitchName = Musicutils.CONVERT_UP[pitchName];
            if (Musicutils.CHROMATIC_NOTES_SHARP.includes(new_pitchName)) {
                return Musicutils.CHROMATIC_NOTES_SHARP.indexOf(new_pitchName);
            }
        }
        console.log('Could not find sharp index for', pitchName);
        return 0;
    }

    /**
     * @remarks Is the pitch a flat or not sharp?
     *
     * @param pitchName - The pitch name to test
     *
     * @returns Result of the test
     */
    public isAFlat(pitchName: string): boolean {
        return pitchName.endsWith('b') || Musicutils.PITCH_LETTERS.includes(pitchName);
    }

    /**
     * @remarks Return the index value of the pitch name
     *
     * @param pitchName - The pitch name to test
     *
     * @returns Index into the chromatic scale with sharp notes
     */
    public findFlatIndex(pitchName: string): number {
        if (Musicutils.CHROMATIC_NOTES_FLAT.includes(pitchName)) {
            return Musicutils.CHROMATIC_NOTES_FLAT.indexOf(pitchName);
        }
        if (Musicutils.CONVERT_DOWN.hasOwnProperty(pitchName)) {
            const new_pitchName = Musicutils.CONVERT_DOWN[pitchName];
            if (Musicutils.CHROMATIC_NOTES_FLAT.includes(new_pitchName)) {
                return Musicutils.CHROMATIC_NOTES_FLAT.indexOf(new_pitchName);
            }
        }
        console.log('Could not find flat index for', pitchName);
        return 0;
    }

    /**
     * @remarks Pitches can be specified as a letter name, a solfege name, etc.
     * @param pitchName - The pitch name to test
     * @returns The type of the pitch (letter name, solfege name, generic note name,
     * or east indian solfege name).
     */
    public getPitchType(pitchName: string): string {
        pitchName = this.normalizePitch(pitchName);
        if (Musicutils.CHROMATIC_NOTES_SHARP.includes(pitchName)) {
            return Musicutils.LETTER_NAME;
        }
        if (Musicutils.CHROMATIC_NOTES_FLAT.includes(pitchName)) {
            return Musicutils.LETTER_NAME;
        }
        if (Musicutils.EQUIVALENT_SHARPS.hasOwnProperty(pitchName)) {
            return Musicutils.LETTER_NAME;
        }
        if (Musicutils.EQUIVALENT_FLATS.hasOwnProperty(pitchName)) {
            return Musicutils.LETTER_NAME;
        }
        pitchName = this.stripAccidental(pitchName)[0];
        if (pitchName[0] == 'n' && Number(pitchName.slice(1)) % 1 != 0) {
            return Musicutils.GENERIC_NOTE_NAME;
        }
        if (Musicutils.SOLFEGE_NAMES.includes(pitchName)) {
            return Musicutils.SOLFEGE_NAME;
        }
        if (Musicutils.EAST_INDIAN_NAMES.includes(pitchName)) {
            return Musicutils.EAST_INDIAN_SOLFEGE_NAME;
        }
        if (Musicutils.SCALAR_MODE_NUMBERS.includes(pitchName)) {
            return Musicutils.SCALAR_MODE_NUMBER;
        }
        return Musicutils.UNKNOWN_PITCH_NAME;
    }
}
