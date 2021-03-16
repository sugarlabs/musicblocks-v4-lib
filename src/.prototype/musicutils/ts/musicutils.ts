/**
 *  Utilities and constants
 */

// Copyright (c) 2020, 2021 Walter Bender, Sugar Labs
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the The GNU Affero General Public
// License as published by the Free Software Foundation; either
// version 3 of the License, or (at your option) any later version.
//
// You should have received a copy of the GNU Affero General Public
// License along with this library; if not, write to the Free Software
// Foundation, 51 Franklin Street, Suite 500 Boston, MA 02110-1335 USA


const SHARP = "♯";
const FLAT = "♭";
const NATURAL = "♮";
const DOUBLESHARP = "𝄪";
const DOUBLEFLAT = "𝄫";
export const CHROMATIC_NOTES_SHARP = [
    "c",
    "c#",
    "d",
    "d#",
    "e",
    "f",
    "f#",
    "g",
    "g#",
    "a",
    "a#",
    "b",
];
export const CHROMATIC_NOTES_FLAT = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"];
// Meantone temperaments use 21 notes
export const ALL_NOTES = [
    "c",
    "c#",
    "db",
    "d",
    "d#",
    "eb",
    "e",
    "e#",
    "fb",
    "f",
    "f#",
    "gb",
    "g",
    "g#",
    "ab",
    "a",
    "a#",
    "bb",
    "b",
    "b#",
    "cb",
];
export const SCALAR_MODE_NUMBERS = ["1", "2", "3", "4", "5", "6", "7"];
export const SOLFEGE_NAMES = ["do", "re", "me", "fa", "sol", "la", "ti"];
export const EAST_INDIAN_NAMES = ["sa", "re", "ga", "ma", "pa", "dha", "ni"];
export const EQUIVALENT_FLATS: { [key: string]: string} = {
    "c#": "db",
    "d#": "eb",
    "f#": "gb",
    "g#": "ab",
    "a#": "bb",
    "e#": "f",
    "b#": "c",
    "cb": "cb",
    "fb": "fb",
};
export const EQUIVALENT_SHARPS: { [key: string]: string}= {
    "db": "c#",
    "eb": "d#",
    "gb": "f#",
    "ab": "g#",
    "bb": "a#",
    "cb": "b",
    "fb": "e",
    "e#": "e#",
    "b#": "b#",
};
// This notation only applies to temperaments with 12 semitones.
export const PITCH_LETTERS = ["c", "d", "e", "f", "g", "a", "b"];

// These defintions are only relevant to equal temperament.
export const SOLFEGE_SHARP = [
    "do",
    "do#",
    "re",
    "re#",
    "me",
    "fa",
    "fa#",
    "sol",
    "sol#",
    "la",
    "la#",
    "ti",
];
export const SOLFEGE_FLAT = [
    "do",
    "reb",
    "re",
    "meb",
    "me",
    "fa",
    "solb",
    "sol",
    "lab",
    "la",
    "tib",
    "ti",
];
export const EAST_INDIAN_SHARP = [
    "sa",
    "sa#",
    "re",
    "re#",
    "ga",
    "ma",
    "ma#",
    "pa",
    "pa#",
    "dha",
    "dha#",
    "ni",
];
export const EAST_INDIAN_FLAT = [
    "sa",
    "reb",
    "re",
    "gab",
    "ga",
    "ma",
    "pab",
    "pa",
    "dhab",
    "dha",
    "nib",
    "ni",
];
export const SCALAR_NAMES_SHARP = [
    "1",
    "1#",
    "2",
    "2#",
    "3",
    "4",
    "4#",
    "5",
    "5#",
    "6",
    "6#",
    "7",
];
export const SCALAR_NAMES_FLAT = [
    "1",
    "2b",
    "2",
    "3b",
    "3",
    "4",
    "4b",
    "5",
    "6b",
    "6",
    "7b",
    "7",
];
export const EQUIVALENTS: { [key: string]: Array<string>} = {
    "ax": ["b", "cb"],
    "a#": ["bb"],
    "a": ["a", "bbb", "gx"],
    "ab": ["g#"],
    "abb": ["g", "fx"],
    "bx": ["c#"],
    "b#": ["c", "dbb"],
    "b": ["b", "cb", "ax"],
    "bb": ["a#"],
    "bbb": ["a", "gx"],
    "cx": ["d"],
    "c#": ["db"],
    "c": ["c", "dbb", "b#"],
    "cb": ["b"],
    "cbb": ["bb", "a#"],
    "dx": ["e", "fb"],
    "d#": ["eb", "fbb"],
    "d": ["d", "ebb", "cx"],
    "db": ["c#", "bx"],
    "dbb": ["c", "b#"],
    "ex": ["f#", "gb"],
    "e#": ["f", "gbb"],
    "e": ["e", "fb", "dx"],
    "eb": ["d#", "fbb"],
    "ebb": ["d", "cx"],
    "fx": ["g", "abb"],
    "f#": ["gb", "ex"],
    "f": ["f", "e#", "gbb"],
    "fb": ["e", "dx"],
    "fbb": ["eb", "d#"],
    "gx": ["a", "bbb"],
    "g#": ["ab"],
    "g": ["g", "abb", "fx"],
    "gb": ["f#", "ex"],
    "gbb": ["f", "e#"],
};
export const CONVERT_DOWN: { [key: string]: string} = {
    "c": "b#",
    "cb": "b",
    "cbb": "a#",
    "d": "cx",
    "db": "c#",
    "dbb": "c",
    "e": "dx",
    "eb": "d#",
    "ebb": "d",
    "f": "e#",
    "fb": "e",
    "fbb": "d#",
    "g": "fx",
    "gb": "f#",
    "gbb": "f",
    "a": "gx",
    "ab": "g#",
    "abb": "g",
    "b": "ax",
    "bb": "a#",
    "bbb": "a",
};
export const CONVERT_UP: { [key: string]: string} = {
    "cx": "d",
    "c#": "db",
    "c": "dbb",
    "dx": "e",
    "d#": "eb",
    "d": "ebb",
    "ex": "f#",
    "e#": "f",
    "e": "fb",
    "fx": "g",
    "f#": "gb",
    "f": "gbb",
    "gx": "a",
    "g#": "ab",
    "g": "abb",
    "ax": "b",
    "a#": "bb",
    "a": "bbb",
    "bx": "c#",
    "b#": "c",
    "b": "cb",
};

//Pitch name types
export const GENERIC_NOTE_NAME = "generic note name";
export const LETTER_NAME = "letter name";
export const SOLFEGE_NAME = "solfege name";
export const EAST_INDIAN_SOLFEGE_NAME = "east indian solfege name";
export const SCALAR_MODE_NUMBER = "scalar mode number";
export const CUSTOM_NAME = "custom name";
export const UNKNOWN_PITCH_NAME = "unknown";

export function strip_accidental(pitch:string):[string,number] {
    /**
     *  Remove an accidental and return the number of half steps that
        would have resulted from its application to the pitch

        Parameters
        ----------
        pitch : string 
            Upper or lowecase pitch name with accidentals as ASCII or Unicode

        Returns
        -------
        string
            Normalized pitch name
        number
            Change in half steps represented by the removed accidental
 
     */
    if(pitch.length == 1) {
        return [pitch, 0];
    }
    // The ASCII versions
    if( pitch.length > 2 && pitch.endsWith("bb") ) {
        // remove last two characters (bb) .
        return [pitch.slice(0,-2), -2]; 
    }
    if( pitch.endsWith("b")) {
        return [pitch.slice(0,-1), -1];
    }
    if( pitch.endsWith("#")) {
        return [pitch.slice(0,-1), 1];
    }
    if( pitch.endsWith("x")) {
        return [pitch.slice(0,-1), 2];
    }
    // And the unicode versions..
    if( pitch.endsWith(DOUBLEFLAT)) {
        return [pitch.slice(0, -DOUBLEFLAT.length), -2];
    }
    if( pitch.endsWith(FLAT)) {
        return [pitch.slice(0, -FLAT.length), -1];
    }
    if(pitch.endsWith(SHARP)) {
        return [pitch.slice(0, -SHARP.length), 1];
    }
    if( pitch.endsWith(DOUBLESHARP)) {
        return [pitch.slice(0, -DOUBLESHARP.length), 2];
    }
    if( pitch.endsWith(NATURAL)) {
        return [pitch.slice(0, -NATURAL.length), 0];
    }
    // No accidentals were present
    return [pitch, 0];
}

export function normalize_pitch(pitch: string){
    /**
     *  Internally, we use a standardize form for our pitch letter names:
    *   Lowercase c, d, e, f, g, a, b for letter names;
    *   #, b, x, and bb for sharp, flat, double sharp, and double flat for
        accidentals.

        Note names for temperaments with more than 12 semitones are of the
        form: n0, n1, ...

        Parameters
        ----------
        pitch : string 
            Upper or lowecase pitch name with accidentals as ASCII or Unicode

        Returns
        -------
        string
            Normalized pitch name
     */
    if( typeof pitch === "number"){
        // float or integer
        // instanceof for complex built in types
        return pitch;
    }

    let _pitch:string = pitch.toLowerCase();
    _pitch = _pitch.replace(SHARP, "#");
    _pitch = _pitch.replace(DOUBLESHARP, "x");
    _pitch = _pitch.replace(FLAT, "b");
    _pitch = _pitch.replace(DOUBLEFLAT, "bb");
    _pitch = _pitch.replace(NATURAL, "");

    return _pitch;
}

function display_pitch(pitch: string) {
    /**
     * The internal pitch name is converted to unicode, e.g., cb --> C♭

        Parameters
        ----------
        pitch : string
            Upper or lowecase pitch name with accidentals as ASCII or Unicode

        Returns
        -------
        string
            Pretty pitch name
    */
    // Ignore pitch numbers and pitch expressed as Hertz
    if( typeof pitch === "number"){
        // float or integer
        // instanceof for complex built in types
        return pitch;
    }
    let pitch_to_display:string = pitch[0].toUpperCase();
    if( pitch.length > 2 && pitch.substr(1,2) == "bb"){
        pitch_to_display += DOUBLEFLAT;
    }
    else if( pitch.length > 1){
        if( pitch[1] == "#")
            pitch_to_display += SHARP;
        else if( pitch[1].toLowerCase() == "x")
            pitch_to_display += DOUBLESHARP;
        else if( pitch[1].toLowerCase() == "b")
            pitch_to_display += FLAT;
    }
    return pitch_to_display;
} 

export function is_a_sharp(pitch_name:string) {
    /**
    Is the pitch a sharp or not flat?

    Parameters
    ----------
    pitch_name : string
        The pitch name to test

    Returns
    -------
    boolean
        Result of the test
    */
   return pitch_name.endsWith("#") || PITCH_LETTERS.includes(pitch_name);
}

export function find_sharp_index(pitch_name:string) {
    /** 
    Return the index value of the pitch name

    Parameters
    ----------
    pitch_name : string
        The pitch name to test

    Returns
    -------
    number
        Index into the chromatic scale with sharp notes
    */
    if( CHROMATIC_NOTES_FLAT.includes(pitch_name))
        return CHROMATIC_NOTES_FLAT.indexOf(pitch_name);
    if( pitch_name in CONVERT_UP){
        let new_pitch_name = CONVERT_UP[pitch_name];
        if( new_pitch_name in CHROMATIC_NOTES_SHARP){
            return CHROMATIC_NOTES_SHARP.indexOf(new_pitch_name);
        }
    }
    console.log("Could not find sharp index for", pitch_name);
    return 0;
}

export function is_a_flat(pitch_name:string){
    /** 
    * Is the pitch a flat or not sharp?

    Parameters
    ----------
    pitch_name : string
        The pitch name to test

    Returns
    -------
    boolean
        Result of the test
    */
   return pitch_name.endsWith("b") || PITCH_LETTERS.includes(pitch_name);
}

export function find_flat_index(pitch_name:string){
    /** 
    Return the index value of the pitch name

    Parameters
    ----------
    pitch_name : string
        The pitch name to test

    Returns
    -------
    number
        Index into the chromatic scale with sharp notes
    */
    if( pitch_name in CHROMATIC_NOTES_FLAT)
        return CHROMATIC_NOTES_FLAT.indexOf(pitch_name);
    if( pitch_name in CONVERT_DOWN){
        let new_pitch_name = CONVERT_DOWN[pitch_name];
        if( new_pitch_name in CHROMATIC_NOTES_FLAT){
            return CHROMATIC_NOTES_FLAT.indexOf(new_pitch_name);
        }
    }
    console.log("Could not find flat index for", pitch_name);
    return 0;
}

export function IsNumeric(input:number ){
    return (input - 0) == input && (''+input).trim().length > 0;
}
export function get_pitch_type(pitch_name:string){
    /**
     *  Pitches can be specified as a letter name, a solfege name, etc.
    */
    let _pitch_name:string = normalize_pitch(pitch_name);
    if( _pitch_name in CHROMATIC_NOTES_SHARP)
        return LETTER_NAME;
    if( _pitch_name in CHROMATIC_NOTES_FLAT)
        return LETTER_NAME;
    if( _pitch_name in EQUIVALENT_SHARPS)
        return LETTER_NAME;
    if( _pitch_name in EQUIVALENT_FLATS)
        return LETTER_NAME;

    let _pitch_name1:any = strip_accidental(pitch_name)[0];
    if( _pitch_name1 == "n" && IsNumeric(_pitch_name1.substr(1)))
        return GENERIC_NOTE_NAME;
    if( _pitch_name1 in SOLFEGE_NAMES)
        return SOLFEGE_NAME;
    if( _pitch_name1 in EAST_INDIAN_NAMES)
        return EAST_INDIAN_SOLFEGE_NAME;
    if( _pitch_name1 in SCALAR_MODE_NUMBERS)
        return SCALAR_MODE_NUMBER;
    return UNKNOWN_PITCH_NAME;
}