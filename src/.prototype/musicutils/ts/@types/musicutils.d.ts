export interface IMusicutils {
    /**
     * Remove an accidental and return the number of half steps that
     * would have resulted from its application to the pitch
     */
    stripAccidental: (pitch: string) => [string, number];

    /**
     * Note names for temperaments with more than 12 semitones are of the form: n0, n1, ...
     */
    normalizePitch: (pitch: string) => string;

    /**
     * The internal pitch name is converted to unicode, e.g., cb --> C♭
     */
    diplayPitch: (pitch: string) => string;

    /**
     * Is the pitch a sharp or not flat?
     */
    isASharp: (pitchName: string) => boolean;

    /**
     * Return the index value of the pitch name
     */
    findSharpIndex: (pitchName: string) => number;

    /**
     * Is the pitch a flat or not sharp?
     */
    isAFlat: (pitchName: string) => boolean;

    /**
     * Return the index value of the pitch name
     */
    findFlatIndex: (pitchName: string) => number;

    /**
     * Pitches can be specified as a letter name, a solfege name, etc.
     */
    getPitchType: (pitchName: string) => string;
}
