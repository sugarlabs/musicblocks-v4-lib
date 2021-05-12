/*
 * Copyright (c) 2021, Walter Bender. All rights reserved.
 * Copyright (c) 2021, Anindya Kundu. All rights reserved.
 *
 * Licensed under the AGPL-3.0 License.
 */

import { IScale } from './@types/scale';
import {
    isAFlat,
    isASharp,
    getPitchType,
    normalizePitch,
    findSharpIndex,
    findFlatIndex,
    stripAccidental,
    EAST_INDIAN_SOLFEGE_NAME,
    CHROMATIC_NOTES_SHARP,
    CHROMATIC_NOTES_FLAT,
    SCALAR_MODE_NUMBERS,
    UNKNOWN_PITCH_NAME,
    SCALAR_MODE_NUMBER,
    SCALAR_NAMES_SHARP,
    SCALAR_NAMES_FLAT,
    EAST_INDIAN_SHARP,
    EQUIVALENT_SHARPS,
    GENERIC_NOTE_NAME,
    EAST_INDIAN_NAMES,
    EQUIVALENT_FLATS,
    EAST_INDIAN_FLAT,
    PITCH_LETTERS,
    SOLFEGE_SHARP,
    SOLFEGE_NAMES,
    SOLFEGE_NAME,
    SOLFEGE_FLAT,
    CONVERT_DOWN,
    LETTER_NAME,
    EQUIVALENTS,
    CUSTOM_NAME,
    CONVERT_UP,
    ALL_NOTES
} from './musicUtils';
import {
    ItemNotFoundError,
    ItemNotFoundDefaultError,
    InvalidArgumentError,
    InvalidArgumentDefaultError
} from './errors';

/**
 * A scale is a selection of notes in an octave.
 */
export class Scale implements IScale {
    static readonly TWELVE2TWENTYONE = {
        n0: ['n0', 'n0'], // c
        n1: ['n1', 'n2'], // c#, db
        n2: ['n3', 'n3'], // d
        n3: ['n4', 'n5'], // d# eb
        n4: ['n6', 'n6'], // e
        n5: ['n9', 'n9'], // f
        n6: ['n10', 'n11'], // f#, gb
        n7: ['n12', 'n12'], // g
        n8: ['n13', 'n14'], // g#, ab
        n9: ['n15', 'n15'], // a
        n10: ['n16', 'n17'], // a#, bb
        n11: ['n18', 'n18'] // b
    } as {
        [key: string]: [string, string];
    };

    /** Any pitch defined by the temperament. */
    private _key: string;
    /** One of the modes defined in `this.MUSICAL_MODES`. */
    private _mode: string;
    /** Number of semitones in the scale. */
    private _numberOfSemitones: number;
    /** Array of generic note names. */
    private _noteNames: string[];
    /** Solfege notes in scale. */
    private _solfegeNotes: string[];
    /** Scalar mode numbers in current mode. */
    private _scalarModeNumbers: string[];
    /** East Indian solfeges in current mode. */
    private _eastIndianSolfegeNotes: string[];
    /** Array of note names in the scale. */
    private _scale: string[];
    /** Custom note names. */
    private _customNoteNames: string[];
    /** Array of octave deltas corresponding to notes. */
    private _octaveDeltas: number[];

    /**
     * @remarks
     * When defining a scale, we need the half steps pattern that defines the selection and a
     * starting note, e.g., C or F#.
     *
     * @param halfStepsPattern - A list of integer values that define how many half steps to take
     * between each note in the scale, e.g., [2, 2, 1, 2, 2, 2, 1] defines the steps for a Major
     * scale.
     * @param startingIndex - An index into the half steps defining an octave that determines from
     * where to start building the scale, e.g., 0 for C and 7 for G in a 12-step temperament.
     * Defaults to `0`.
     * @param numberOfSemitones - If the `halfStepsPattern` is an empty list, then use the number
     * of semitones instead. (Or trigger a mapping from 12 to 21.) Defaults to `12`.
     * @param preferSharps - If we are mapping from 12 to 21 semitones, we need to know whether or
     * not to prefer sharps or flats. Defaults to `true`.
     */
    constructor(
        halfStepsPattern: number[] | null = null,
        startingIndex: number = 0,
        numberOfSemitones: number = 12,
        preferSharps: boolean = true,
        key: string = 'c'
    ) {
        // Calculate the number of semitones by summing up the half steps.
        if (halfStepsPattern === null) {
            this._numberOfSemitones = numberOfSemitones;
            halfStepsPattern = [];
            for (let i = 0; i < this._numberOfSemitones; i++) {
                halfStepsPattern.push(1);
            }
        } else {
            this._numberOfSemitones = 0;
            for (const step of halfStepsPattern) {
                this._numberOfSemitones += step;
            }
        }

        // Define generic note names that map to temperament.
        this._noteNames = [];
        for (let i = 0; i < this._numberOfSemitones; i++) {
            this._noteNames.push(`n${i}`);
        }

        this._mode = '';
        this._halfSteps = [];
        this._solfegeNotes = [];
        this._scalarModeNumbers = [];
        this._eastIndianSolfegeNotes = [];

        this.key = key;

        let i = startingIndex % this._noteNames.length;
        let octave = 0;
        this._scale = [this._noteNames[i]];
        this._octaveDeltas = [octave];
        for (const step of halfStepsPattern) {
            i += step;
            if (i >= this._numberOfSemitones) {
                octave++;
                i -= this._numberOfSemitones;
            }
            this._scale.push(this._noteNames[i]);
            this._octaveDeltas.push(octave);
        }

        /*
         * We defined the number of semitones based on the half steps pattern but we may want to map
         * from a 12 step scale to anotther scale, e.g. 21 step scale.
         */
        if (this._numberOfSemitones !== numberOfSemitones && numberOfSemitones == 21) {
            const j = preferSharps ? 0 : 1;
            for (const [i, note] of this._scale.entries()) {
                this._scale[i] = Scale.TWELVE2TWENTYONE[note][j];
            }

            // And regenerate the semitone scale.
            this._numberOfSemitones = numberOfSemitones;
            this._noteNames = [];
            for (let i = 0; i < this._numberOfSemitones; i++) {
                this._noteNames.push(`n${i}`);
            }
        }
    }

    /**
     * State of fixed Solfege.
     *
     * @remarks
     * - Fixed Solfege means that the mapping between Solfege and letter names is fixed: do == c,
        re == d, ...
     * - Moveable (not fixed) Solfege means that do == the first note in the scale, etc.
     *
     * @param state - State to set Fixed Solfege: `true` or `false`.
     */
    public set fixedSolfege(state: boolean) {
        this._fixedSolfege = state;
    }

    /**
     * State of fixed Solfege.
     */
    public get fixedSolfege(): boolean {
        return this._fixedSolfege;
    }

    /**
     * Normalizes the scale by converting double sharps and double flats.
     *
     * @param scale - The notes in a scale.
     * @returns The same scale where the notes have been converted to just sharps, flats, and
     * naturals.
     */
    public normalizeScale(scale: string[]): string[] {
        /*
         * At this point, the scale includes the first note of the next octave. Hence, for example
         * the Latin modes have 8 notes.
         */
        if (scale.length < 9) {
            // Convert to preferred accidental.
            if (!this._preferSharps(this._key, this._mode) && this._key.includes('#')) {
                scale.forEach((note: string, i: number) => {
                    if (note.includes('b')) {
                        if (note in EQUIVALENT_SHARPS) {
                            scale[i] = EQUIVALENT_SHARPS[note];
                        }
                    }
                });
            }

            // For Latin scales, we cannot skip notes.
            if (scale.length === 8) {
                for (let i = 0; i < scale.length - 1; i++) {
                    const idx1: number = PITCH_LETTERS.indexOf(scale[i][0]);
                    let idx2: number = PITCH_LETTERS.indexOf(scale[i + 1][0]);
                    if (idx2 < idx1) {
                        idx2 += 7;
                    }
                    if (idx2 - idx1 > 1) {
                        if (scale[i + 1] in CONVERT_DOWN) {
                            scale[i + 1] = CONVERT_DOWN[scale[i + 1]];
                        }
                    }
                }
            }

            // And ensure there are no repeated letter names.
            for (let i = 0; i < scale.length - 1; i++) {
                let newCurrentNote: string = '',
                    newNextNote: string;
                if (i === 0 && scale[i][0] === scale[i + 1][0]) {
                    if (scale[i + 1] in CONVERT_UP) {
                        newNextNote = CONVERT_UP[scale[i + 1]];
                        scale[i + 1] = newNextNote;
                    }
                } else if (scale[i][0] === scale[i + 1][0]) {
                    if (scale[i] in CONVERT_DOWN) {
                        newCurrentNote = CONVERT_DOWN[scale[i]];
                    }

                    /*
                     * If changing the current note makes it the same as the previous note, then we
                     * need to change the next note instead.
                     */
                    if (newCurrentNote[0] !== scale[i - 1][0]) {
                        scale[i] = newCurrentNote;
                    } else {
                        if (scale[i + 1] in CONVERT_UP) {
                            newNextNote = CONVERT_UP[scale[i + 1]];
                            scale[i + 1] = newNextNote;
                        }
                    }
                }
            }
        } else {
            // Convert to preferred accidental.
            if (this._key.includes('#')) {
                scale.forEach((note: string, i: number) => {
                    if (note.includes('b')) {
                        if (note in EQUIVALENT_SHARPS) {
                            scale[i] = EQUIVALENT_SHARPS[note];
                        }
                    }
                });
            }
        }

        let convertUp: boolean = false;
        let convertDown: boolean = false;
        for (let i = 0; i < scale.length; i++) {
            const note = scale[i];
            if (note.includes('x')) {
                convertUp = true;
                break;
            }
            if (scale[i].length > 2) {
                convertDown = true;
            }
        }
        if (convertUp) {
            scale.forEach((note: string, i: number) => {
                if (note.includes('x')) {
                    scale[i] = CONVERT_UP[note];
                }
                if (scale[i] in EQUIVALENT_FLATS) {
                    scale[i] = EQUIVALENT_FLATS[scale[i]];
                }
            });
        } else if (convertDown) {
            scale.forEach((note: string, i: number) => {
                if (note.length > 2) {
                    scale[i] = CONVERT_DOWN[note];
                }
                if (note in EQUIVALENT_SHARPS) {
                    scale[i] = EQUIVALENT_SHARPS[scale[i]];
                }
            });
        }
        return scale;
    }

    /**
     * Given a list of names, map them to the current mode.
     *
     * @param sourceList - List of names, e.g., Solfege names.
     * @returns List of names mapped to the mode.
     */
    private _modeMapList(sourceList: string[]): string[] {
        const returnList: string[] = [];
        const modeLength = this.modeLength;
        const offset = 'cdefgab'.indexOf(this._scale[0][0]);
        for (let i = 0; i < this._scale.length; i++) {
            let j = 'cdefgab'.indexOf(this._scale[i][0]) - offset;
            if (j < 0) {
                j += sourceList.length;
            }
            if (modeLength < 8) {
                // We ensured a unique letter name for each note when we built the scale.
                returnList.push(sourceList[j]);
            } else {
                // Some letters are repeated, so we need the accidentals.
                returnList.push(
                    sourceList[j] +
                        ['bb', 'b', '', '#', 'x'][stripAccidental(this._scale[i])[1] + 2]
                );
            }
        }
        returnList[returnList.length - 1] = returnList[0];
        return returnList;
    }

    /**
     * Create a Solfege mapping of the scale ("fixed Solfege == true")
     *
     * @example
     * Major: ['do', 're', 'me', 'fa', 'sol', 'la', 'ti', 'do']
     * Major Pentatonic: ['do', 're', 'me', 'sol', 'la', 'do']
     * Minor Pentatonic: ['do', 'me', 'fa', 'sol', 'ti', 'do']
     * Whole Tone: ['do', 're', 'me', 'sol', 'la', 'ti', 'do']
     *
     * @remarks
     * Solfege assignment only works for temperaments of 12 semitones.
     *
     * @throws {ItemNotFoundError}
     * Thrown if solfeges for temperaments with `this._numberOfSemitones` do not exist.
     */
    private _assignSolfegeNoteNames() {
        this._solfegeNotes = [];

        if (this._numberOfSemitones === 12 || this._numberOfSemitones === 21) {
            this._solfegeNotes = this._modeMapList(SOLFEGE_NAMES);
        } else {
            throw new ItemNotFoundError(
                `No Solfege for temperaments with ${this._numberOfSemitones} semitones.`
            );
        }
    }

    /**
     * East Indian Solfege.
     *
     * @remarks
     * Solfege assignment only works for temperaments of 12 semitones.
     *
     * @throws {ItemNotFoundError}
     * Thrown if East Indian solfeges for temperaments with `this._numberOfSemitones` do not exist.
     */
    private _assignEastIndianSolfegeNoteNames(): void {
        this._eastIndianSolfegeNotes = [];

        if (this._numberOfSemitones === 12 || this._numberOfSemitones === 21) {
            this._eastIndianSolfegeNotes = this._modeMapList(EAST_INDIAN_NAMES);
        } else {
            throw new ItemNotFoundError(
                `No East Indian Solfege for temperaments with ${this._numberOfSemitones} semitones.`
            );
        }
    }

    /**
     * @remarks
     * - Scalar mode numbers refer to the available notes in the mode.
     * - Assignment only works for temperaments of 12 semitones.
     *
     * @throws {ItemNotFoundError}
     * Thrown if mode numbers for temperaments with `this._numberOfSemitones` do not exist.
     */
    private _assignScalarModeNumbers(): void {
        this._scalarModeNumbers = [];

        if (this._numberOfSemitones === 12 || this._numberOfSemitones === 21) {
            this._scalarModeNumbers = this._modeMapList(SCALAR_MODE_NUMBERS);
        } else {
            throw new ItemNotFoundError(
                `No mode numbers for temperaments with ${this._numberOfSemitones} semitones.`
            );
        }
    }


    /**
     * Returns the number of notes in the scale.
     *
     * @remarks
     * The number of semitones is the number of notes in the temperament.
     *
     * @returns The length of the `_noteNames` array.
     *
     * @readonly
     */
    public get numberOfSemitones(): number {
        return this._noteNames.length;
    }

    /**
     * Returns the notes defined by the temperament.
     *
     * @remarks
     * The notes defined by the temperament are used to build the scale.
     *
     * @readonly
     */
    public get noteNames(): string[] {
        return this._noteNames;
    }

    /**
     * Custom note names defined by user.
     *
     * @remarks
     * Names should not end with b or x or they will cause collisions with the flat (b) and
     * doublesharp (x) accidentals.
     *
     * @param customNames - A list of custom names.
     *
     * @throws {InvalidArgumentError}
     * Thrown if unique custom names aren't supplied for the each item of the mode.
     */
    public set customNoteNames(customNames: string[]) {
        if (customNames.length !== this.modeLength) {
            throw new InvalidArgumentError(
                'A unique name must be assigned to every note in the mode.'
            );
        }

        /*
         * Check if all strings in the list are unique.
         *
         * Create an empty set of strings. Iterate for each string in the list, querying if it has
         * previously been parsed (i.e. it is present in the set). If it is a first occurrence, add
         * it to the set (if it is encountered again, it'll be caught in the previous query step
         * when the duplicate string is parsed).
         *
         */
        const nameSet: Set<string> = new Set<string>();
        for (const name of customNames) {
            if (nameSet.has(name)) {
                throw new InvalidArgumentError(
                    'A unique name must be assigned to every note in the mode.'
                );
            }
            nameSet.add(name);
        }

        this._customNoteNames = customNames.slice(0);
    }

    /**
     * Custom note names defined by user.
     */
    public get customNoteNames(): string[] {
        return this._customNoteNames;
    }


    /**
     * Returns the notes in the scale.
     *
     * @param pitchFormat - Array of letter names in the teperament.
     *
     * @throws {InvalidArgumentError}
     * Thrown if `pitchFormat` length does not match number of semitones.
     */
    public getScale(pitchFormat?: string[]): string[] {
        if (pitchFormat === undefined) {
            return this._scale;
        }

        if (pitchFormat.length === this._numberOfSemitones) {
            const scale: string[] = [];
            for (let i = 0; i < this._scale.length; i++) {
                scale.push(pitchFormat[this._noteNames.indexOf(this._scale[i])]);
            }
            return scale;
        }

        throw new InvalidArgumentError('pitch format does not match number of semitones');
    }

    /**
     * Returns the notes in the scale and the octave deltas.
     *
     * @remarks
     * The notes in the scale are a subset of the notes defined by the temperament.
     * The octave deltas (either 0 or 1) are used to mark notes above B#, which would be in the next
     * octave, e.g., G3, A3, B3, C4...
     *
     * @param pitchFormat - Array of letter names in the teperament.
     * @returns an array (2-tuple) of the notes in the scale and the octave deltas.
     *
     * @throws {InvalidArgumentError}
     * Thrown if `pitchFormat` length does not match number of semitones.
     */
    public getScaleAndOctaveDeltas(pitchFormat?: string[]): [string[], number[]] {
        return [this.getScale(pitchFormat), this._octaveDeltas];
    }

    /**
     * The solfege names of the notes found in the scale
     */
    public get solfegeNotes(): string[] {
        return this._solfegeNotes;
    }

    /**
     * How many (scalar) notes are in the scale?
     */
    public get modeLength(): number {
        return this._scale.length - 1;
    }

    /**
     * The East Indian solfege names of the notes found in the scale
     */
    public get eastIndianSolfegeNotes(): string[] {
        return this._eastIndianSolfegeNotes;
    }

    /**
     * The scalar mode numbers
     */
    public get scalarModeNumbers(): string[] {
        return this._scalarModeNumbers;
    }

    /**
     * Convert from a source name, e.g., Solfege, to a note name.
     *
     * @param pitchName _ Source note name.
     * @param sourceList - List of source names.
     * @returns Converted name string or `null` if cannot be converted.
     */
    private _nameConverter(pitchName: string, sourceList: string[]): string | null {
        if (sourceList.includes(pitchName)) {
            const i = sourceList.indexOf(pitchName);
            try {
                return this.convertToGenericNoteName(this._scale[i]);
            } catch (err) {
                return err.defaultValue;
            }
        }

        let delta: number;
        [pitchName, delta] = stripAccidental(pitchName);
        if (sourceList.includes(pitchName)) {
            let i = sourceList.indexOf(pitchName);
            let noteName: string;
            try {
                noteName = this.convertToGenericNoteName(this._scale[i]);
            } catch (err) {
                noteName = err.defaultValue;
            }

            i = this._noteNames.indexOf(noteName);
            i += delta;
            if (i < 0) {
                i += this._numberOfSemitones;
            }
            if (i > this._numberOfSemitones - 1) {
                i -= this._numberOfSemitones;
            }

            return this._noteNames[i];
        }

        return null;
    }

    /**
     * Checks pitch type, including test for custom names.
     *
     * @param pitchName - pitch name to test
     * @returns pitch type, e.g., LETTER_NAME, SOLFEGE_NAME, etc.
     */
    public pitchNameType(pitchName: string): string {
        let originalNotation = getPitchType(pitchName);
        if (originalNotation === UNKNOWN_PITCH_NAME) {
            const strippedPitch = stripAccidental(pitchName)[0];
            if (this._customNoteNames.includes(strippedPitch)) {
                originalNotation = CUSTOM_NAME;
            }
        }
        return originalNotation;
    }

    /**
     * Converts from a letter name used by 12-semitone temperaments to a generic note name as
     * defined by the temperament.
     *
     * @remarks
     * Only for temperaments with 12 semitones.
     *
     * @param pitchName - name of pitch.
     * @returns An array (2-tuple) of
     *  - Generic note name.
     *  - Error code.
     *
     * @throws {ItemNotFoundDefaultError<string>}
     * Thrown if the supplied pitch name does not match any type.
     */
    public convertToGenericNoteName(pitchName: string): string {
        pitchName = normalizePitch(pitchName);
        const originalNotation = this.pitchNameType(pitchName);

        // Maybe it is already a generic name.
        if (originalNotation === GENERIC_NOTE_NAME) {
            return pitchName;
        }

        if (this._numberOfSemitones === 21) {
            if (ALL_NOTES.includes(pitchName)) {
                return this._noteNames[ALL_NOTES.indexOf(pitchName)];
            }
        }

        if (originalNotation === LETTER_NAME) {
            // Look for a letter name, e.g., g# or ab.
            if (pitchName.includes('#') && isASharp(pitchName)) {
                return this._noteNames[findSharpIndex(pitchName)];
            }

            if (isAFlat(pitchName)) {
                return this._noteNames[findFlatIndex(pitchName)];
            }

            // Catch cb, bx, etc.
            if (pitchName in EQUIVALENT_SHARPS) {
                return this._noteNames[CHROMATIC_NOTES_SHARP.indexOf(EQUIVALENT_SHARPS[pitchName])];
            }

            if (pitchName in EQUIVALENT_FLATS) {
                return this._noteNames[findFlatIndex(EQUIVALENT_FLATS[pitchName])];
            }

            if (pitchName in EQUIVALENTS) {
                return this._noteNames[
                    EQUIVALENTS[pitchName][0].includes('#')
                        ? findSharpIndex(EQUIVALENTS[pitchName][0])
                        : findFlatIndex(EQUIVALENTS[pitchName][0])
                ];
            }
        }

        if (originalNotation === SOLFEGE_NAME) {
            // Look for a Solfege name.
            if (this._fixedSolfege) {
                const noteName = this._nameConverter(pitchName, this._solfegeNotes);
                if (noteName !== null) {
                    return noteName;
                }
            } else {
                if (pitchName.includes('#') && SOLFEGE_SHARP.includes(pitchName)) {
                    return this._noteNames[SOLFEGE_SHARP.indexOf(pitchName)];
                }

                if (SOLFEGE_FLAT.includes(pitchName)) {
                    return this._noteNames[SOLFEGE_FLAT.indexOf(pitchName)];
                }
            }
        }

        if (originalNotation === CUSTOM_NAME) {
            // Look for a Custom name.
            if (this._customNoteNames.length > 0) {
                const noteName = this._nameConverter(pitchName, this._customNoteNames);
                if (noteName !== null) {
                    return noteName;
                }
            }

            if (this._fixedSolfege) {
                const strippedPitch = stripAccidental(pitchName)[0];
                const noteName = this._nameConverter(strippedPitch, this._customNoteNames);
                if (noteName !== null) {
                    return noteName;
                }
            } else {
                const strippedPitch = stripAccidental(pitchName)[0];
                if (pitchName.includes('#') && this._customNoteNames.includes(strippedPitch)) {
                    let i = this._customNoteNames.indexOf(strippedPitch) + 1;
                    if (i > this._noteNames.length) {
                        i = 0;
                    }
                    return this._noteNames[i];
                }
                if (SCALAR_NAMES_FLAT.includes(pitchName)) {
                    let i = this._customNoteNames.indexOf(strippedPitch) - 1;
                    if (i > 0) {
                        i = this._noteNames.length;
                    }
                    return this._noteNames[i];
                }
            }
        }

        if (originalNotation === EAST_INDIAN_SOLFEGE_NAME) {
            // Look for a East Indian Solfege name.
            if (this._fixedSolfege) {
                const noteName = this._nameConverter(pitchName, this._eastIndianSolfegeNotes);
                if (noteName !== null) {
                    return noteName;
                }
            } else {
                if (pitchName.includes('#') && EAST_INDIAN_SHARP.includes(pitchName)) {
                    return this._noteNames[EAST_INDIAN_SHARP.indexOf(pitchName)];
                }

                if (EAST_INDIAN_FLAT.includes(pitchName)) {
                    return this._noteNames[EAST_INDIAN_FLAT.indexOf(pitchName)];
                }
            }
        }

        if (originalNotation === SCALAR_MODE_NUMBER) {
            // Look for a scalar mode number
            if (this._fixedSolfege) {
                const noteName = this._nameConverter(pitchName, this._scalarModeNumbers);
                if (noteName !== null) {
                    return noteName;
                }
            } else {
                if (pitchName.includes('#') && SCALAR_NAMES_SHARP.includes(pitchName)) {
                    return this._noteNames[SCALAR_NAMES_SHARP.indexOf(pitchName)];
                }

                if (SCALAR_NAMES_FLAT.includes(pitchName)) {
                    return this._noteNames[SCALAR_NAMES_FLAT.indexOf(pitchName)];
                }
            }
        }

        throw new ItemNotFoundDefaultError<string>(`Pitch name ${pitchName} not found.`, pitchName);
    }

    /**
     * Convert from a generic note name as defined by the temperament to a letter name used by
     * 12-semitone temperaments.
     *
     * @remarks
     * Only for temperaments with 12 semitones.
     *
     * @param noteName - Generic note name.
     * @param preferSharps - Prefer sharps over flats?
     * @returns An array (2-tuple) of
     *  - Letter name.
     *  - Error code.
     *
     * @throws {InvalidArgumentDefaultError<[string]>}
     * Thrown if the supplied note is not a sharp or flat and the number of semitones is neither 21
     * nor 12.
     * @throws {ItemNotFoundDefaultError<[string]>}
     * Thrown if the supplied note is not a part of notes in the mode.
     */
    private _genericNoteNameToLetterName(noteName: string, preferSharps: boolean = true): [string] {
        noteName = normalizePitch(noteName);

        // Maybe it is already a letter name?
        if (isASharp(noteName)) {
            return [noteName];
        }

        if (isAFlat(noteName)) {
            return [noteName];
        }

        if (this._numberOfSemitones === 21) {
            return [ALL_NOTES[this._noteNames.indexOf(noteName)]];
        }

        if (this._numberOfSemitones !== 12) {
            throw new InvalidArgumentDefaultError<[string]>(
                `Cannot convert ${noteName} to a letter name.`,
                [noteName]
            );
        }

        if (this._noteNames.includes(noteName)) {
            return [
                preferSharps
                    ? CHROMATIC_NOTES_SHARP[this._noteNames.indexOf(noteName)]
                    : CHROMATIC_NOTES_FLAT[this._noteNames.indexOf(noteName)]
            ];
        }

        throw new ItemNotFoundDefaultError<[string]>(`Note name ${noteName} not found.`, [
            noteName
        ]);
    }

    /**
     * Converts a note name to letter name.
     *
     * @param noteName - Note name
     * @param targetList - List of notes based on the temperament.
     * @returns An array (2-tuple) of
     *  - Letter name.
     *  - Error code.
     *
     * @throws {InvalidArgumentDefaultError<[string]>}
     * Thrown if note not in list of notes based on temperament and number of semitones in not 12.
     * @throws {ItemNotFoundError<[string]>}
     * Thrown if the closet note could not be found, or note is not a part of list of note names in
     * the mode.
     */
    private _convertFromNoteName(noteName: string, targetList: string[]): [string] {
        noteName = normalizePitch(noteName);

        // Maybe it is already in the list?
        if (targetList.includes(noteName)) {
            return [noteName];
        }

        if (this._numberOfSemitones !== 12) {
            throw new InvalidArgumentDefaultError<[string]>(
                `Cannot convert ${noteName} to a letter name.`,
                [noteName]
            );
        }

        if (this._noteNames.includes(noteName)) {
            // First find the corresponding letter name.
            const letterName = CHROMATIC_NOTES_SHARP[this._noteNames.indexOf(noteName)];
            // Next, find the closest note in the scale.
            try {
                const [_, i, distance] = this.closestNote(letterName);
                if (distance === 0) {
                    return [targetList[i]];
                }
                // Remove any accidental.
                const [targetNote, delta] = stripAccidental(targetList[i]);
                // Add back in the appropriate accidental.
                return [targetNote + ['bb', 'b', '', '#', 'x'][delta + distance + 2]];
            } catch (err) {
                throw new ItemNotFoundDefaultError<[string]>(
                    'Cannot find closest note to ' + letterName,
                    [noteName]
                );
            }
        }

        throw new ItemNotFoundDefaultError<[string]>(`Note name ${noteName} not found.`, [
            noteName
        ]);
    }

    /**
     * Returns a moveable solfege note based on the temperament.
     *
     * @param noteName - Upper or lowecase pitch name with accidentals as ASCII or Unicode.
     * @param sharpScale - List of sharp notes.
     * @param flatScale - List of flat notes.
     * @param preferSharps - Prefer sharps over flats?
     * @returns An array (2-tuple) of
     *  - Note name in one of the lists
     *  - Error code.
     *
     * @throws {InvalidArgumentDefaultError<[string]>}
     * Thrown if note not a sharp or flat note and the number of semitones in not 12, or note is not
     * a part of list of note names of the mode.
     */
    private _findMoveable(
        noteName: string,
        sharpScale: string[],
        flatScale: string[],
        preferSharps: boolean
    ): [string] {
        noteName = normalizePitch(noteName);

        if (sharpScale.includes(noteName)) {
            return [noteName];
        }

        if (flatScale.includes(noteName)) {
            return [noteName];
        }

        if (this._numberOfSemitones !== 12) {
            throw new InvalidArgumentDefaultError<[string]>('Cannot convert noteName', [noteName]);
        }

        if (this._noteNames.includes(noteName)) {
            return [
                preferSharps
                    ? sharpScale[this._noteNames.indexOf(noteName)]
                    : flatScale[this._noteNames.indexOf(noteName)]
            ];
        }

        throw new InvalidArgumentDefaultError<[string]>(`Cannot convert ${noteName}`, [noteName]);
    }

    /**
     * Convert from a generic note name as defined by the temperament to a letter name used by
     * 12-semitone temperaments.
     *
     * @remarks
     * Only for temperaments with 12 semitones.
     *
     * @param noteName - Generic note name.
     * @param preferSharps - Prefer sharps over flats?
     * @returns An array (2-tuple) of
     *  - Letter name.
     *  - Error code.
     *
     * @throws {InvalidArgumentDefaultError<[string]>}
     * Thrown if the supplied note is not a sharp or flat and the number of semitones is neither 21
     * nor 12.
     * @throws {ItemNotFoundDefaultError<[string]>}
     * Thrown if the supplied note is not a part of notes in the mode.
     */
    private _genericNoteNameToLetterName(noteName: string, preferSharps: boolean = true): [string] {
        noteName = normalizePitch(noteName);

        // Maybe it is already a letter name?
        if (isASharp(noteName)) {
            return [noteName];
        }

        if (isAFlat(noteName)) {
            return [noteName];
        }

        if (this._numberOfSemitones === 21) {
            return [ALL_NOTES[this._noteNames.indexOf(noteName)]];
        }

        if (this._numberOfSemitones !== 12) {
            throw new InvalidArgumentDefaultError<[string]>(
                `Cannot convert ${noteName} to a letter name.`,
                [noteName]
            );
        }

        if (this._noteNames.includes(noteName)) {
            return [
                preferSharps
                    ? CHROMATIC_NOTES_SHARP[this._noteNames.indexOf(noteName)]
                    : CHROMATIC_NOTES_FLAT[this._noteNames.indexOf(noteName)]
            ];
        }

        throw new ItemNotFoundDefaultError<[string]>(`Note name ${noteName} not found.`, [
            noteName
        ]);
    }

    /**
     * Converts from a generic note name as defined by the temperament to a solfege note used by
     * 12-semitone temperaments.
     *
     * @remarks
     * Only for temperaments with 12 semitones.
     *
     * @param noteName - Generic note name.
     * @param preferSharps - Prefer sharps over flats?
     * @returns An array (2-tuple) of
     *  - Solfege note.
     *  - Error code.
     */
    private _genericNoteNameToSolfege(noteName: string, preferSharps: boolean = true): [string] {
        let res: [string], res1: [string];
        try {
            res = this._convertFromNoteName(noteName, this._solfegeNotes);
        } catch (err) {
            res = err.defaultValue;
        }
        try {
            res1 = this._findMoveable(noteName, SOLFEGE_SHARP, SOLFEGE_FLAT, preferSharps);
        } catch (err) {
            res1 = err.defaultValue;
        }
        return this._fixedSolfege ? res : res1;
    }

    /**
     * Converts from a generic note name as defined by the temperament to an East Indian solfege
     * note used by 12-semitone temperaments.
     *
     * @remarks
     * Only for temperaments with 12 semitones.
     *
     * @param noteName - Generic note name.
     * @param preferSharps - Prefer sharps over flats?
     * @returns An array (2-tuple) of
     *  - East Indian solfege note.
     *  - Error code.
     */
    private _genericNoteNameToEastIndianSolfege(
        noteName: string,
        preferSharps: boolean = true
    ): [string] {
        let res: [string], res1: [string];
        try {
            res = this._convertFromNoteName(noteName, this._eastIndianSolfegeNotes);
        } catch (err) {
            res = err.defaultValue;
        }
        try {
            res1 = this._findMoveable(noteName, EAST_INDIAN_SHARP, EAST_INDIAN_FLAT, preferSharps);
        } catch (err) {
            res1 = err.defaultValue;
        }
        return this._fixedSolfege ? res : res1;
    }

    /**
     * Converts from a generic note name as defined by the temperament to a scalar mode number used
     * by 12-semitone temperaments.
     *
     * @remarks
     * Only for temperaments with 12 semitones.
     *
     * @param noteName - Generic note name.
     * @param preferSharps - Prefer sharps over flats?
     * @returns An array (2-tuple) of
     *  - Scalar mode number.
     *  - Error code.
     */
    private _genericNoteNameToScalarModeNumber(
        noteName: string,
        preferSharps: boolean = true
    ): [string] {
        let res: [string], res1: [string];
        try {
            res = this._convertFromNoteName(noteName, this._scalarModeNumbers);
        } catch (err) {
            res = err.defaultValue;
        }
        try {
            res1 = this._findMoveable(
                noteName,
                SCALAR_NAMES_SHARP,
                SCALAR_NAMES_FLAT,
                preferSharps
            );
        } catch (err) {
            res1 = err.defaultValue;
        }
        return this._fixedSolfege ? res : res1;
    }

    /**
     * Converts from a generic note name as defined by the temperament to a custom_noteName used by
     * 12-semitone temperaments.
     *
     * @remarks
     * Only for temperaments with 12 semitones.
     *
     * @param noteName - Generic note name.
     * @returns An array (2-tuple) of
     *  - Custom name.
     *  - Error code.
     */
    private _genericNoteNameToCustomNoteName(noteName: string): [string] {
        try {
            return this._convertFromNoteName(noteName, this._customNoteNames);
        } catch (err) {
            return err.defaultValue;
        }
    }


    /**
     * Given a modal number, returns the corresponding pitch in the scale (and any change in octave).
     *
     * @param modalIndex - The modal index specifies an index into the scale.
     * If the index is >= mode length or < 0, a relative change in octaveis also calculated.
     * @returns
     * An array (2-tuple) of
     *  - The pitch that is the result of indexing the scale by the modal index.
     *  - The relative change in octave due to mapping the modal index to the mode length.
     */
    public modalPitchToLetter(modalIndex: number): [string, number] {
        const modeLength = this.modeLength;
        modalIndex = Math.floor(Number(modalIndex));
        let deltaOctave = Math.floor(modalIndex / modeLength);

        if (modalIndex < 0) {
            deltaOctave--;
            while (modalIndex < 0) {
                modalIndex += modeLength;
            }
        }

        while (modalIndex > modeLength - 1) {
            modalIndex -= modeLength;
        }

        return [this._scale[modalIndex], deltaOctave];
    }

    /**
     * Given a pitch, checks to see if it is in the scale.
     *
     * @param target - The target pitch specified as a pitch letter, e.g., c#, fb.
     * @returns `true` if the note is in the scale, `false` otherwise.
     */
    public noteInScale(target: string): boolean {
        try {
            return this.closestNote(target)[2] === 0;
        } catch (err) {
            return err.defaultValue[2] === 0;
        }
    }

    /**
     * Ensures that an index value is within the range of the temperament.
     *
     * @example
     * i == 12 would be mapped to 0 with a change in octave +1 for a temperament with 12 semitones.
     *
     * @param i - Index value into semitones.
     * @param deltaOctave - Any previous change in octave that needs to be preserved.
     * @returns
     * An array (2-tuple) of
     *  - The index mapped to semitones.
     *  - Any additonal change in octave due to mapping.
     */
    private _mapToSemitoneRange(i: number, deltaOctave: number): [number, number] {
        while (i < 0) {
            i += this._numberOfSemitones;
            deltaOctave--;
        }

        while (i > this._numberOfSemitones - 1) {
            i -= this._numberOfSemitones;
            deltaOctave++;
        }

        return [i, deltaOctave];
    }

    /**
     * Given a starting pitch, adds a semitone transform and return the resultant pitch (and any
     * change in octave).
     *
     * @param startingPitch - The starting pitch specified as a pitch letter, e.g., c#, fb.
     * @param numberOfHalfSteps - Half steps are steps in the notes defined by the temperament.
     * @returns
     * An array (3-tuple) of
     *  - The pitch that is the number of half steps from the starting pitch.
     *  - The relative change in octave between the starting pitch and the new pitch.
     *  - Error code.
     *
     * @throws {ItemNotFoundDefaultError<[string, number]>}
     * Thrown if the starting pitch is not a part of list of note names of the mode.
     */
    public semitoneTransform(startingPitch: string, numberOfHalfSteps: number): [string, number] {
        startingPitch = normalizePitch(startingPitch);
        const originalNotation = this.pitchNameType(startingPitch);
        let deltaOctave = 0;

        if (this._numberOfSemitones === 12) {
            if (originalNotation === LETTER_NAME) {
                if (isASharp(startingPitch)) {
                    let i = findSharpIndex(startingPitch);
                    i += numberOfHalfSteps;
                    [i, deltaOctave] = this._mapToSemitoneRange(i, deltaOctave);
                    return [CHROMATIC_NOTES_SHARP[i], deltaOctave];
                }

                if (isAFlat(startingPitch)) {
                    let i = findFlatIndex(startingPitch);
                    i += numberOfHalfSteps;
                    [i, deltaOctave] = this._mapToSemitoneRange(i, deltaOctave);
                    return [CHROMATIC_NOTES_FLAT[i], deltaOctave];
                }

                const [strippedPitch, delta] = stripAccidental(startingPitch);
                try {
                    const noteName = this._noteNames.includes(strippedPitch)
                        ? strippedPitch
                        : this.convertToGenericNoteName(strippedPitch);
                    if (this._noteNames.includes(noteName)) {
                        let i = this._noteNames.indexOf(noteName);
                        i += numberOfHalfSteps;
                        [i, deltaOctave] = this._mapToSemitoneRange(i + delta, deltaOctave);
                        return [this._noteNames[i], deltaOctave];
                    }
                } catch (err) {
                    throw new ItemNotFoundDefaultError<[string, number]>(
                        `Cannot find ${startingPitch} in note names.`,
                        [startingPitch, 0]
                    );
                }
            }

            let res: string;
            try {
                res = this.convertToGenericNoteName(startingPitch);
            } catch (err) {
                res = err.defaultValue;
            }
            const noteName = res;
            const [strippedPitch, delta] = stripAccidental(noteName); // startingPitch
            if (this._noteNames.includes(strippedPitch)) {
                let i = this._noteNames.indexOf(strippedPitch);
                i += numberOfHalfSteps;
                [i, deltaOctave] = this._mapToSemitoneRange(i + delta, deltaOctave);

                if (originalNotation === SOLFEGE_NAME) {
                    return [
                        this._genericNoteNameToSolfege(
                            this._noteNames[i],
                            startingPitch.includes('#')
                        )[0],
                        deltaOctave
                    ];
                }

                if (originalNotation === EAST_INDIAN_SOLFEGE_NAME) {
                    return [
                        this._genericNoteNameToEastIndianSolfege(
                            this._noteNames[i],
                            startingPitch.includes('#')
                        )[0],
                        deltaOctave
                    ];
                }

                if (originalNotation === SCALAR_MODE_NUMBER) {
                    return [
                        this._genericNoteNameToScalarModeNumber(
                            this._noteNames[i],
                            startingPitch.includes('#')
                        )[0],
                        deltaOctave
                    ];
                }

                return [this._noteNames[i], deltaOctave];
            }

            throw new ItemNotFoundDefaultError<[string, number]>(
                `Cannot find ${startingPitch} in note names.`,
                [startingPitch, 0]
            );
        }

        const [strippedPitch, delta] = stripAccidental(startingPitch);
        /*
         * If there are 21 semitones, assume c, c#, db, d, d#, eb... but still go from c# to d or db
         * to c.
         */
        if (this._numberOfSemitones === 21) {
            /**
             * When there both sharps and flats in a scale, we skip some of the accidental as we
             * navigate the semitones.
             *
             * @todo Describe what this is doing.
             *
             * @param delta
             * @param j
             * @returns
             */
            const __calculateIncrement = (delta: number, j: number) => {
                return (delta === 0 && j % 3 === 2) ||
                    (delta === 1 && j % 3 === 1) ||
                    (delta === -1 && j % 3 === 2)
                    ? 2
                    : 1;
            };

            if (ALL_NOTES.includes(startingPitch)) {
                let i = ALL_NOTES.indexOf(startingPitch);
                if (numberOfHalfSteps > 0) {
                    for (let j = 0; j < numberOfHalfSteps; j++) {
                        i += __calculateIncrement(delta, j);
                    }
                } else {
                    for (let j = 0; j < -numberOfHalfSteps; j++) {
                        i -= __calculateIncrement(delta, j);
                    }
                }
                [i, deltaOctave] = this._mapToSemitoneRange(i, deltaOctave);
                return [ALL_NOTES[i], deltaOctave];
            }

            if (this._noteNames.includes(strippedPitch)) {
                let i = this._noteNames.indexOf(strippedPitch);
                if (numberOfHalfSteps > 0) {
                    for (let j = 0; j < numberOfHalfSteps; j++) {
                        i += __calculateIncrement(delta, j);
                    }
                } else {
                    for (let j = 0; j < -numberOfHalfSteps; j++) {
                        i -= __calculateIncrement(delta, j);
                    }
                }
                [i, deltaOctave] = this._mapToSemitoneRange(i, deltaOctave);
                return [this._noteNames[i], deltaOctave];
            }
        }

        if (this._noteNames.includes(strippedPitch)) {
            let i = this._noteNames.indexOf(strippedPitch);
            i += numberOfHalfSteps;
            [i, deltaOctave] = this._mapToSemitoneRange(i + delta, deltaOctave);
            return [this._noteNames[i], deltaOctave];
        }

        throw new ItemNotFoundDefaultError<[string, number]>(
            `Cannot find ${startingPitch} in note names.`,
            [startingPitch, 0]
        );
    }

    /**
     * Given a generic note name, converts it to a pitch name type.
     *
     * @param pitchName - Source generic note name.
     * @param targetType - One of the predefined types, e.g., LETTER_NAME, SOLFEGE_NAME, etc.
     * @param preferSharps - If there is a choice, should we use a sharp or a flat?
     * @returns Converted note name.
     */
    public genericNoteNameConvertToType(
        pitchName: string,
        targetType: string,
        preferSharps: boolean = true
    ): string {
        return this._restoreFormat(pitchName, targetType, preferSharps);
    }

    /**
     * Format convertor.
     *
     * @todo could be done with a dictionary?
     *
     * @param pitchName - Pitch name to convert.
     * @param originalNotation - Pitch name notation type.
     * @param preferSharps - Prefer sharps over flat?
     * @returns Converted name.
     */
    private _restoreFormat(
        pitchName: string,
        originalNotation: string,
        preferSharps: boolean
    ): string {
        if (originalNotation === GENERIC_NOTE_NAME) {
            return pitchName;
        }

        if (originalNotation === LETTER_NAME) {
            try {
                return this._genericNoteNameToLetterName(pitchName, preferSharps)[0];
            } catch (err) {
                return err.defaultValue[0];
            }
        }

        if (originalNotation === SOLFEGE_NAME) {
            return this._genericNoteNameToSolfege(pitchName, preferSharps)[0];
        }

        if (originalNotation === CUSTOM_NAME) {
            return this._genericNoteNameToCustomNoteName(pitchName)[0];
        }

        if (originalNotation === SCALAR_MODE_NUMBER) {
            return this._genericNoteNameToScalarModeNumber(pitchName)[0];
        }

        if (originalNotation === EAST_INDIAN_SOLFEGE_NAME) {
            return this._genericNoteNameToEastIndianSolfege(pitchName)[0];
        }

        return pitchName;
    }

    /**
     * Calculates the distance between two notes in semitone steps.
     *
     * @param pitchA - Pitch name one of two.
     * @param octaveA - Octave number one of two.
     * @param pitchB - Pitch name two of two.
     * @param octaveB - Octave number two of two.
     * @returns Distance calculated in scalar steps.
     */
    public semitoneDistance(
        pitchA: string,
        octaveA: number,
        pitchB: string,
        octaveB: number
    ): number {
        return this._pitchToNoteNumber(pitchB, octaveB) - this._pitchToNoteNumber(pitchA, octaveA);
    }

    /**
     * Calculates the distance between two notes in scalar steps.
     *
     * @param pitchA - Pitch name one of two.
     * @param octaveA - Octave number one of two.
     * @param pitchB - Pitch name two of two.
     * @param octaveB - Octave number two of two.
     * @returns
     * An array (2-tuple) of
     *  - Distance calculated in scalar steps.
     *  - Any semitone rounding error in the calculation.
     */
    public scalarDistance(
        pitchA: string,
        octaveA: number,
        pitchB: string,
        octaveB: number
    ): [number, number] {
        let closest1: [string, number, number];
        try {
            closest1 = this.closestNote(pitchA);
        } catch (err) {
            closest1 = err.defaultValue;
        }
        let closest2: [string, number, number];
        try {
            closest2 = this.closestNote(pitchB);
        } catch (err) {
            closest2 = err.defaultValue;
        }
        const a = closest1[1] + this.modeLength * octaveA;
        const b = closest2[1] + this.modeLength * octaveB;
        return [b - a, closest1[2] + closest2[2]];
    }


    /**
     * Rotates a series of notes around an invert point.
     *
     * @param pitchName - The pitch name of the note to be rotated.
     * @param octave - The octave of the note to be rotated.
     * @param invertPointPitch - The pitch name of the axis of inversion.
     * @param invertPointOctave - The octave of the axis of inversion.
     * @param invertMode - There are three different invert modes:
     * `even`, `odd`, and `scalar`. In even and odd modes, the rotation is based on half steps. In
     * even and scalar mode, the point of rotation is the given note. In odd mode, the point of
     * rotation is shifted up by a 1/4 step, enabling rotation around a point between two notes. In
     * scalar mode, the scalar interval is preserved around the point of rotation.
     * @returns
     * An array (2-tuple)
     *  - Pitch name of the inverted note.
     *  - Octave of the inverted note.
     */
    public invert(
        pitchName: string,
        octave: number,
        invertPointPitch: string,
        invertPointOctave: number,
        invertMode: 'even' | 'odd' | 'scalar'
    ): [string, number] {
        let invertedPitch: string;
        let deltaOctave: number;

        if (invertMode === 'even' || invertMode === 'odd') {
            let delta = this.semitoneDistance(
                invertPointPitch,
                invertPointOctave,
                pitchName,
                octave
            );
            if (invertMode === 'even') {
                delta *= 2;
            } else if (invertMode === 'odd') {
                delta = 2 * delta - 1;
            }
            try {
                [invertedPitch, deltaOctave] = this.semitoneTransform(pitchName, -delta);
            } catch (err) {
                [invertedPitch, deltaOctave] = err.defaultValue;
            }
        } else {
            let delta = this.scalarDistance(
                invertPointPitch,
                invertPointOctave,
                pitchName,
                octave
            )[0];
            delta *= 2;
            [invertedPitch, deltaOctave] = this.scalarTransform(pitchName, -delta);
        }

        return [invertedPitch, octave + deltaOctave];
    }

    /**
     * Given a target pitch, what is the closest note in the current key signature (key and mode)?
     *
     * @param target - target pitch specified as a pitch letter, e.g., c#, fb
     * @returns
     * An array (4-tuple) of
     *  - The closest pitch to the target pitch in the scale.
     *  - The scalar index value of the closest pitch in the scale (If the target is midway between
     *      two scalar pitches, the lower pitch is returned.)
     *  - The distance in semitones (half steps) from the target pitch to the scalar pitch (If the
     *      target is higher than the scalar pitch, then distance > 0. If the target is lower than
     *      the scalar pitch then distance < 0. If the target matches a scale pitch, then distance
     *      is 0.)
     *  - Error code.
     *
     * @throws {ItemNotFoundDefaultError<[string, number, number]>}
     * Thrown if distance is not less than number of semitones, or target note not part of list of
     * note names for the current mode.
     */
    public closestNote(target: string): [string, number, number] {
        target = normalizePitch(target);

        const originalNotation = this.pitchNameType(target);
        const preferSharps = target.includes('#');
        // The calculation is done in the generic note namespace.
        try {
            target = this.convertToGenericNoteName(target);
        } catch (err) {
            target = err.defaultValue;
        }
        const [strippedTarget, delta] = stripAccidental(target);

        let i: number;
        if (this._noteNames.includes(strippedTarget)) {
            i = this._noteNames.indexOf(strippedTarget);
            i = this._mapToSemitoneRange(i + delta, 0)[0];
            target = this._noteNames[i];
        }

        // First look for an exact match.
        for (let i = 0; i < this.modeLength; i++) {
            if (target === this._genericScale[i]) {
                return [this._restoreFormat(target, originalNotation, preferSharps), i, 0];
            }
        }

        // Then look for the nearest note in the scale.
        if (this._noteNames.includes(target)) {
            const idx = this._noteNames.indexOf(target);
            // Look up for a note in the scale.
            let distance = this._numberOfSemitones; // max distance
            let closestNote: string = '';
            for (let i = 0; i < this.modeLength; i++) {
                const ii = this._noteNames.indexOf(this._genericScale[i]);
                const n = ii - idx;
                const m = ii + this._numberOfSemitones - idx;
                if (Math.abs(n) < Math.abs(distance)) {
                    closestNote = this._genericScale[i];
                    distance = n;
                }
                if (Math.abs(m) < Math.abs(distance)) {
                    closestNote = this._genericScale[i];
                    distance = m;
                }
            }

            if (distance < this._numberOfSemitones) {
                return [
                    this._restoreFormat(closestNote, originalNotation, preferSharps),
                    this._genericScale.indexOf(closestNote),
                    distance
                ];
            }

            throw new ItemNotFoundDefaultError<[string, number, number]>(
                `Closest note to ${target} not found.`,
                [this._restoreFormat(target, originalNotation, preferSharps), 0, 0]
            );
        }

        throw new ItemNotFoundDefaultError<[string, number, number]>(`Note ${target} not found.`, [
            this._restoreFormat(target, originalNotation, preferSharps),
            0,
            0
        ]);
    }

}
