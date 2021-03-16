/**
    The KeySignature class defines an object that manages a specific
    key/mode combination.
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

import { Scale } from './scale'
import { strip_accidental, 
         normalize_pitch, 
         get_pitch_type,
         is_a_sharp,
         is_a_flat,
         find_sharp_index,
         find_flat_index,
        } from './musicutils'
    
import { ALL_NOTES,
         PITCH_LETTERS,
         CHROMATIC_NOTES_SHARP,
         CHROMATIC_NOTES_FLAT,
         SOLFEGE_SHARP,
         SOLFEGE_FLAT,
         EAST_INDIAN_SHARP,
         EAST_INDIAN_FLAT,
         SCALAR_NAMES_SHARP,
         SCALAR_NAMES_FLAT,
         GENERIC_NOTE_NAME,
         LETTER_NAME,
         SOLFEGE_NAME,
         EAST_INDIAN_SOLFEGE_NAME,
         SCALAR_MODE_NUMBER,
         CUSTOM_NAME,
         UNKNOWN_PITCH_NAME,
         SCALAR_MODE_NUMBERS,
         SOLFEGE_NAMES,
         EAST_INDIAN_NAMES,
         EQUIVALENTS,
         EQUIVALENT_FLATS,
         EQUIVALENT_SHARPS,
         CONVERT_DOWN,
         CONVERT_UP,
         } from './musicutils'


const isDecimal = (num:string):boolean => {
    for(let c of num){
        if(!(c>='0' && c<='9'))
            return false;
    }
    return true;
};

export class KeySignature {
    /**
    A key signature is a set of sharp, flat, and natural symbols.
    */
    // Predefined modes are defined by the number of semitones between notes.
    MUSICAL_MODES:{ [key: string]: Array<number>} = {
        // 12 notes in an octave
        "chromatic": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        // 8 notes in an octave
        "algerian": [2, 1, 2, 1, 1, 1, 3, 1],
        "diminished": [2, 1, 2, 1, 2, 1, 2, 1],
        "spanish": [1, 2, 1, 1, 1, 2, 2, 2],
        "octatonic": [1, 2, 1, 2, 1, 2, 1, 2],
        "bebop": [1, 1, 1, 2, 2, 1, 2, 2],
        //7 notes in an octave
        "major": [2, 2, 1, 2, 2, 2, 1],
        "harmonic major": [2, 2, 1, 2, 1, 3, 1],
        "minor": [2, 1, 2, 2, 1, 2, 2],
        "natural minor": [2, 1, 2, 2, 1, 2, 2],
        "harmonic minor": [2, 1, 2, 2, 1, 3, 1],
        "melodic minor": [2, 1, 2, 2, 2, 2, 1],
        // "Church" modes
        "ionian": [2, 2, 1, 2, 2, 2, 1],
        "dorian": [2, 1, 2, 2, 2, 1, 2],
        "phrygian": [1, 2, 2, 2, 1, 2, 2],
        "lydian": [2, 2, 2, 1, 2, 2, 1],
        "mixolydian": [2, 2, 1, 2, 2, 1, 2],
        "aeolian": [2, 1, 2, 2, 1, 2, 2],
        "locrian": [1, 2, 2, 1, 2, 2, 2],
        "jazz minor": [2, 1, 2, 2, 2, 2, 1],
        "arabic": [2, 2, 1, 1, 2, 2, 2],
        "byzantine": [1, 3, 1, 2, 1, 3, 1],
        "enigmatic": [1, 3, 2, 2, 2, 1, 1],
        "ethiopian": [2, 1, 2, 2, 1, 2, 2],
        "geez": [2, 1, 2, 2, 1, 2, 2],
        "hindu": [2, 2, 1, 2, 1, 2, 2],
        "hungarian": [2, 1, 3, 1, 1, 3, 1],
        "maqam": [1, 3, 1, 2, 1, 3, 1],
        "romanian minor": [2, 1, 3, 1, 2, 1, 2],
        "spanish gypsy": [1, 3, 1, 2, 1, 2, 2],
        // 6 notes in an octave
        "minor blues": [3, 2, 1, 1, 3, 2],
        "major blues": [2, 1, 1, 3, 2, 2],
        "whole tone": [2, 2, 2, 2, 2, 2],
        // 5 notes in an octave
        "major pentatonic": [2, 2, 3, 2, 3],
        "minor pentatonic": [3, 2, 2, 3, 2],
        "chinese": [4, 2, 1, 4, 1],
        "egyptian": [2, 3, 2, 3, 2],
        "hirajoshi": [1, 4, 1, 4, 2],
        "in": [1, 4, 2, 1, 4],
        "minyo": [3, 2, 2, 3, 2],
        "fibonacci": [1, 1, 2, 3, 5],
    };

    // These maqam mode names imply a specific key.
    MAQAM_KEY_OVERRIDES:{[ key: string] :string} = {
        "hijaz kar": "c",
        "hijaz kar maqam": "c",
        "shahnaz": "d",
        "maqam mustar": "eb",
        "maqam jiharkah": "f",
        "shadd araban": "g",
        "suzidil": "a",
        "ajam": "bb",
        "ajam maqam": "bb",
    };

    MODE_MAPPER:{[ key: string] :string} = {
        "ionian": "major",
        "aeolian": "minor",
        "natural minor": "minor",
        "harmonic minor": "minor",
        "major": "major",
        "minor": "minor",
    }

    // These key signaturs (and their equivalents) prefer sharps over flats.
    PREFER_SHARPS: string[] = [
        "c major",
        "c major pentatonic",
        "c major blues",
        "c whole tone",
        "d dorian",
        "e phrygian",
        "f lydian",
        "g mixolydian",
        "a minor",
        "a minor pentatonic",
        "b locrian",
        "g major",
        "g major pentatonic",
        "g major blues",
        "g whole tone",
        "a dorian",
        "b phrygian",
        "c lydian",
        "d mixolydian",
        "e minor",
        "e minor pentatonic",
        "f# locrian",
        "d major",
        "d major pentatonic",
        "d major blues",
        "d whole tone",
        "e dorian",
        "f# phrygian",
        "g lydian",
        "a mixolydian",
        "b minor",
        "b minor pentatonic",
        "c# locrian",
        "a major",
        "a major pentatonic",
        "a major blues",
        "a whole tone",
        "b dorian",
        "c# phrygian",
        "d lydian",
        "e mixolydian",
        "f# minor",
        "f# minor pentatonic",
        "e major",
        "e major pentatonic",
        "e major blues",
        "e whole tone",
        "f# dorian",
        "a lydian",
        "b mixolydian",
        "c# minor",
        "c# minor pentatonic",
        "b major",
        "b major pentatonic",
        "b major blues",
        "b whole tone",
        "c# dorian",
        "d# phrygian",
        "e lydian",
        "f# mixolydian",
        "g# minor",
        "g# minor pentatonic",
        "a# locrian",
    ]

    
    mode!: string;
    half_steps!:number[];
    key!: string | string[];
    _scale:Scale;
    scale:string[];
    generic_scale:string[];
    number_of_semitones:number;
    fixed_solfege:boolean;
    note_names:string[];
    solfege_notes!:string[];
    east_indian_solfege_notes!:string[];
    scalar_mode_numbers!:string[];
    custom_note_names:string[];
    key_signature:string;
    // constructor
    constructor( mode:string="major",
                 key:string = "c",
                 number_of_semitones:number = 12){

        /**
        In defining a scale, we need to know the key, the mode, and the
        number of notes in the temperament used to define the scale.
        Parameters
        ----------
        mode : str
            One of the modes defined in self.MUSIC_MODES
        key : str
            Any pitch defined by in the temperament. (Note that currently
            the only notation supported is for temperaments with up to 12
            steps.
        number_of_semitones : int
            The number of semitones defined in the temperament
        */
        let prefer_sharps:boolean = true;
        
        if( typeof mode === "string"){
            mode = mode.toLowerCase();
            // Some mode names imply a specific key.
            if( mode in this.MAQAM_KEY_OVERRIDES){
                // Override the key.
                key =  this.MAQAM_KEY_OVERRIDES[mode];
                mode = "maqam";
            }
            if( mode in this.MUSICAL_MODES){
                this.mode = mode;
                this.half_steps = this.MUSICAL_MODES[this.mode];
            }
            else {
                console.log("mode not found");
                this.mode = "chromatic";
                this.half_steps = this.MUSICAL_MODES[this.mode];
            }
        }
        else if( Array.isArray(mode)){
            this.mode = "custom"; // We could look for a match
            this.half_steps = mode;
        }

        this.key = key;
        let i:number = 0;
        if(typeof this.key === "string") {
            key = normalize_pitch(key);
            let prefer_sharps = this._prefer_sharps(this.key,this.mode) || this.key.includes('#');
            if( prefer_sharps ){
                if( !(CHROMATIC_NOTES_SHARP.includes(this.key)))
                    this.key = EQUIVALENT_SHARPS[this.key];
                i = find_sharp_index(this.key);
            }
            else if( CHROMATIC_NOTES_FLAT.includes(this.key) || this.key.includes('b')){
                if( !(CHROMATIC_NOTES_FLAT.includes(this.key)))
                    this.key = EQUIVALENT_FLATS[this.key];
                i = find_flat_index(this.key);
            }
            else if( this.key[0] == "n" && isDecimal(this.key.substr(1))){
                i = parseInt(this.key.substr(1));
            }
            else 
                console.log('Could not find key index:', this.key);
        }
        else if( typeof this.key === "number")
            i = this.key;
        else   
            console.log('bad key type', typeof(key))
        
        if(this.half_steps.length == 0){
            this._scale= new Scale(
                [],i,number_of_semitones,true
            );
        }
        else {
            this._scale = new Scale(
                this.half_steps,
                i,
                number_of_semitones,
                prefer_sharps
            );
        }

        this.generic_scale = this._scale.get_scale();
        this.number_of_semitones = this._scale.get_number_of_semitones();
        this.fixed_solfege = false;

        if( this.number_of_semitones == 12) {
            if( typeof this.key === "number")
                this.key = CHROMATIC_NOTES_SHARP[this.key];
            this.note_names = this._scale.get_note_names();
            let scale:string[];
            if( this._prefer_sharps(this.key,this.mode) || this.key.includes('#'))
                scale = this._scale.get_scale(CHROMATIC_NOTES_SHARP);
            else 
                scale = this._scale.get_scale(CHROMATIC_NOTES_FLAT);
            
            // In generating the scale, the key may have been
            // switched to an equivalent.
            scale[0] = this.key;
            scale[scale.length-1] = this.key;
            this.scale = this.normalize_scale(scale);
            this._assign_solfege_note_names();
            this._assign_east_indian_solfege_note_names();
            this._assign_scalar_mode_numbers();
        }
        else{
            this.note_names = this._scale.get_note_names();
            if( this.note_names.length == 21)
                this.scale = this._scale.get_scale(ALL_NOTES);
            else 
                this.scale = this._scale.get_scale();
            if( typeof this.key === "number")
                this.key =  this.note_names;
            this.solfege_notes = [];
            this.east_indian_solfege_notes = [];
            this.scalar_mode_numbers = [];
        }

        this.custom_note_names = [];
        
        this.key_signature = `${this.key} ${this.mode}`;
    }

    set_fixed_solfege(state:boolean=false):void{
        /**
        Fixed Solfege means that the mapping between Solfege and
        letter names is fixed: do == c, re == d, ...

        Moveable (not fixed) Solfege means that do == the first note
        in the scale, etc.

        Parameters
        ----------
        state : boolean
            State to set FIxed Solfege: True or False
        */
        this.fixed_solfege = state;
    };

    get_fixed_solfege():boolean{
        /**
        Returns the Fixed Solfege state

        Returns
        -------
        boolean
            State of fixed Solfege
        */
        return this.fixed_solfege;
    };

    normalize_scale(scale:string[]):string[]{
        /**
        Normalize the scale by converting double sharps and double flats.

        Parameters
        ----------
        scale : list
            The notes in a scale

        Returns
        -------
        list
            The same scale where the notes have been converted to just
            sharps, flats, and naturals
        */
        // At this point, the scale includes the first note of the next
        // octave. Hence, for example, the Latin modes have 8 notes.
        
        if(scale.length < 9){
            // Convert to preferred accidental.
            if(!(this._prefer_sharps(this.key,this.mode)) && this.key.includes('#')){
                for(let i=0;i<scale.length;i++){
                    let note:string = scale[i];
                    if(note.includes('b')){
                        if( note in EQUIVALENT_SHARPS)
                            scale[i] = EQUIVALENT_SHARPS[note];
                    }
                }
            }

            // For Latin scales, we cannot skip notes.
            if( scale.length == 8){
                for(let i=0;i<scale.length-1;i++){
                    let idx1: number = PITCH_LETTERS.indexOf(scale[i][0]);
                    let idx2: number = PITCH_LETTERS.indexOf(scale[i+1][0]);
                    if( idx2 < idx1) 
                        idx2 += 7;
                    if( idx2 -idx1 > 1){
                        if( scale[i+1] in CONVERT_DOWN)
                            scale[i+1] = CONVERT_DOWN[scale[i+1]];
                    } 
                }
            }

            // And ensure there are no repeated letter names.
            for( let i=0;i<scale.length-1;i++){
                if(i==0 && scale[i][0] == scale[i+1][0]){
                    if( scale[i+1] in CONVERT_UP){
                        let new_next_note = CONVERT_UP[scale[i+1]];
                        scale[i+1] = new_next_note;
                    }
                }
                else if(scale[i][0] == scale[i+1][0]){
                    let new_current_note!:string;
                    if( scale[i] in CONVERT_DOWN)
                        new_current_note = CONVERT_DOWN[scale[i]];
                    else 
                        console.log(scale[i]);
                    // If changing the current note makes it the same
                    // as the previous note, then we need to change the
                    // next note instead.
                    if( new_current_note[0] != scale[i-1][0])
                        scale[i] = new_current_note;
                    else {
                        if(scale[i+1] in CONVERT_UP){
                            let new_next_note:string = CONVERT_UP[scale[i+1]];
                            scale[i+1] = new_next_note;
                        }
                    }
                }
            }
        }
        else{
            // Convert to preferred accidental.
            if( this.key.includes('#')) {
                for(let i=0;i<scale.length;i++){
                    let note = scale[i];
                    if(note.includes('b')){
                        if( note in EQUIVALENT_SHARPS){
                            scale[i] = EQUIVALENT_SHARPS[note];
                        }
                    }
                }
            }
        }

        let convert_up:boolean = false;
        let convert_down:boolean = false;
        for( let i=0;i< scale.length;i++){
            let note = scale[i];
            if(note.includes('x')){
                convert_up = true;
                break;
            }
            if(scale[i].length > 2)
                convert_down = true;
        }

        if(convert_up) {
            for(let i=0;i < scale.length;i++){
                let note = scale[i];
                if(note.includes('x')){
                    scale[i] = CONVERT_UP[note];
                }
                if(scale[i] in EQUIVALENT_FLATS){
                    scale[i] = EQUIVALENT_FLATS[scale[i]];
                }
            }
        }
        else if(convert_down){
            for( let i=0;i < scale.length;i++){
                let note = scale[i];
                if( note.length > 2)
                    scale[i] = CONVERT_DOWN[note];
                if( note in EQUIVALENT_SHARPS)
                    scale[i] = EQUIVALENT_SHARPS[scale[i]];
            }
        }
        return scale;
    };

    _mode_map_list(source_list:string[]):string[]{
        /**
        Given a list of names, map them to the current mode.

        Parameters
        ----------
        source_list : list
            List of names, e.g., Solfege names

        Returns
        -------
        list
            List of names mapped to the mode
        */
        let return_list:string[] = [];
        let mode_length:number = this.get_mode_length();
        let offset:number = "cdefgab".indexOf(this.scale[0][0]);
        for(let i=0;i<this.scale.length;i++){
            let j:number = "cdefgab".indexOf(this.scale[i][0]) - offset;
            if( j < 0)
                j += source_list.length;
            if( mode_length < 8){
                // We ensured a unique letter name for each note when we
                // built the scale.
                return_list.push(source_list[j]); 
            }
            else {
                // Some letters are repeated, so we need the accidentals.
                return_list.push(
                    source_list[j] + ["bb", "b", "", "#", "x"][strip_accidental(this.scale[i])[1] + 2]
                );
            }
        }
        return_list[return_list.length-1] = return_list[0];
        return return_list;
    };

    _assign_solfege_note_names(){
        /**
        Create a Solfege mapping of the scale ("fixed Solfege == True")

        Examples:
        Major: ['do', 're', 'me', 'fa', 'sol', 'la', 'ti', 'do']
        Major Pentatonic: ['do', 're', 'me', 'sol', 'la', 'do']
        Minor Pentatonic: ['do', 'me', 'fa', 'sol', 'ti', 'do']
        Whole Tone: ['do', 're', 'me', 'sol', 'la', 'ti', 'do']
        NOTE: Solfege assignment only works for temperaments of 12 semitones.
        */
        this.solfege_notes = [];

        if(this.number_of_semitones == 12 || this.number_of_semitones == 21)
            this.solfege_notes = this._mode_map_list(SOLFEGE_NAMES);
        else {
            console.log(`No Solfege for temperaments with ${this.number_of_semitones} semitones.`);
        }
    };

    _assign_east_indian_solfege_note_names():void{
        /**
        East Indian Solfege
        NOTE: Solfege assignment only works for temperaments of 12 semitones.
        */
        this.east_indian_solfege_notes = [];

        if( this.number_of_semitones == 12 || this.number_of_semitones == 21){
            this.east_indian_solfege_notes = this._mode_map_list(EAST_INDIAN_NAMES);
        }
        else {
            console.log(`No EI Solfege for temperaments with ${this.number_of_semitones} semitones.`);
        }
    };

    _assign_scalar_mode_numbers():void {
        /**
        Scalar mode numbers refer to the available notes in the mode
        NOTE: Assignment only works for temperaments of 12 semitones.
        */
        this.scalar_mode_numbers = [];

        if(this.number_of_semitones == 12 || this.number_of_semitones == 21){
            this.scalar_mode_numbers = this._mode_map_list(SCALAR_MODE_NUMBERS);
        }
        else {
            console.log(`No mode numbers for temperaments with ${this.number_of_semitones} semitones.`)
        }
    };

    get_scale():string[]{
        /**
        The (scalar) notes in the scale.

        Returns
        -------
        list
            The (scalar) notes in the scale.

        NOTE: The internal definition of the scale includes the octave.
        */
        return this.scale.splice(-1,1);
    };

    get_mode_length(){
        /**
        How many notes are in the scale?

        Returns
        -------
        int
            The number of (scalar) notes in the scale.
        */
        return this.scale.length - 1;
    };

    get_number_of_semitones():number{
        /**
        How many semitones (half-steps) are in the temperament used to
        define this key/mode?

        Returns
        -------
        int
            The number of semitones in the temperament used to define
            the scale
        */
        return this.number_of_semitones;
    };

    set_custom_note_names(custom_names:string[]){
        /**
        Custom note names defined by user

        Parameters
        ----------
        custom_names : list
            A list of custom names

        Note: Names should not end with b or x or they will cause
        collisions with the flat (b) and doublesharp (x) accidentals.
        */
        if( custom_names.length != this.get_mode_length()){
            console.log(`A unique name must be assigned to every note in the mode.`);
            return -1;
        }
        this.custom_note_names = [...custom_names];
        return 0;
    };

    get_custom_note_names(){
        /**
        Custom note names defined by user

        Returns
        -------
        list
            Custom names
        */
        return this.custom_note_names;
    };

    _name_converter(pitch_name:string, source_list:string[]){
        /**
        Convert from a source name, e.g., Solfege, to a note name.
        */
        if( pitch_name in source_list){
            let i:number = source_list.indexOf(pitch_name);
            return this.convert_to_generic_note_name(this.scale[i])[0];
        }
        pitch_name = strip_accidental(pitch_name)[0];
        let delta:number = strip_accidental(pitch_name)[1];

        if( pitch_name in source_list){
            let i:number = source_list.indexOf(pitch_name);
            let note_name:string = this.convert_to_generic_note_name(this.scale[i])[0];
            i = this.note_names.indexOf(note_name);
            i += delta;
            if ( i < 0) 
                i += this.number_of_semitones;
            if ( i > this.number_of_semitones - 1)
                i -= this.number_of_semitones;
            return this.note_names[i];
        }
        return null;
    };

    pitch_name_type(pitch_name:string):string{
        /**
        Check pitch type, including test for custom names
        Parameters
        ----------
        pitch_name : str
            pitch name to test
        Returns
        -------
        str
            pitch type, e.g., LETTER_NAME, SOLFEGE_NAME, etc.
        */
        
        let original_notation = get_pitch_type(pitch_name);
        if( original_notation == UNKNOWN_PITCH_NAME){
            let stripped_pitch:string = strip_accidental(pitch_name)[0];
            if( stripped_pitch in this.custom_note_names)
                original_notation = CUSTOM_NAME;
        }
        return original_notation;

    };

    convert_to_generic_note_name (pitch_name:string):[string ,number]{
        /**
        Convert from a letter name used by 12-semitone temperaments to
        a generic note name as defined by the temperament.
        NOTE: Only for temperaments with 12 semitones.
        */
        pitch_name = normalize_pitch(pitch_name);
        const original_notation  = this.pitch_name_type(pitch_name);
        
        // Maybe it is already a generic name.
        if( original_notation == GENERIC_NOTE_NAME)
            return [pitch_name, 0];
        
        if( this.number_of_semitones ==  21){
            if( pitch_name in ALL_NOTES){
                return [this.note_names[ALL_NOTES.indexOf(pitch_name)],0];
            }
        }

        if( original_notation == LETTER_NAME){
            // Look for a letter name, e.g., g# or ab
            if( pitch_name.includes('#') && is_a_sharp(pitch_name)){
                return [this.note_names[find_sharp_index(pitch_name)], 0];
            }
            if( is_a_flat(pitch_name)){
                return [this.note_names[find_flat_index(pitch_name)], 0];
            }
            // Catch cb, bx, etc.
            if( pitch_name in EQUIVALENT_SHARPS){
                return [this.note_names[CHROMATIC_NOTES_SHARP.indexOf(EQUIVALENT_SHARPS[pitch_name])],0];
            }

            if( pitch_name in EQUIVALENT_FLATS){
                return [this.note_names[find_flat_index(EQUIVALENT_FLATS[pitch_name])],0];
            }

            if( pitch_name in EQUIVALENTS) {
                if(EQUIVALENTS[pitch_name][0].includes('#')){
                    return [this.note_names[find_sharp_index(EQUIVALENTS[pitch_name][0])],0];
                }
                return [this.note_names[find_flat_index(EQUIVALENTS[pitch_name][0])],0];
            }
        }

        if( original_notation == SOLFEGE_NAME){
            // Look for a solfege name
            if( this.fixed_solfege){
                let note_name = this._name_converter(pitch_name,this.solfege_notes);
                if(note_name){
                    return [note_name, 0];
                }
            }
            else {
                if( pitch_name.includes('#') && pitch_name in SOLFEGE_SHARP)
                    return [this.note_names[SOLFEGE_SHARP.indexOf(pitch_name)], 0];
                if( pitch_name in SOLFEGE_FLAT)
                    return [this.note_names[SOLFEGE_FLAT.indexOf(pitch_name)], 0];
            }
        }

        if( original_notation == CUSTOM_NAME){
            // Look for a custom name
            if( this.custom_note_names.length > 0){
                let note_name = this._name_converter(pitch_name,this.custom_note_names);
                if( note_name)
                    return [note_name, 0];
            }

            if( this.fixed_solfege){
                let stripped_pitch = strip_accidental(pitch_name)[0];
                let note_name = this._name_converter(stripped_pitch, this.custom_note_names);
                if( note_name)
                    return [note_name, 0];
            }
            else {
                let stripped_pitch = strip_accidental(pitch_name)[0];
                if( pitch_name.includes('#') && stripped_pitch in this.custom_note_names){
                    let i = this.custom_note_names.indexOf(stripped_pitch);
                    i += 1;
                    if( i > this.note_names.length)
                        i = 0;
                        return [this.note_names[i], 0];
                }
                if( pitch_name in SCALAR_NAMES_FLAT){
                    let i = this.custom_note_names.indexOf(stripped_pitch);
                    i -= 1;
                    if( i > 0)
                        i = this.note_names.length;
                    return [this.note_names[i], 0];
                }
            }
        }

        if(original_notation == EAST_INDIAN_SOLFEGE_NAME){
            // Look for a East Indian Solfege name
            if( this.fixed_solfege){
                let note_name = this._name_converter(pitch_name, this.east_indian_solfege_notes);
                if( note_name)
                    return [note_name, 0];
            }
            else {
                if( pitch_name.includes('#') && pitch_name in EAST_INDIAN_SHARP)
                    return [this.note_names[EAST_INDIAN_SHARP.indexOf(pitch_name)],0];
                if( pitch_name in EAST_INDIAN_FLAT)
                    return [this.note_names[EAST_INDIAN_FLAT.indexOf(pitch_name)], 0];
            }
        }

        if(original_notation == SCALAR_MODE_NUMBER){
            // Look for a sclaar mode number
            if( this.fixed_solfege){
                let note_name = this._name_converter(pitch_name, this.scalar_mode_numbers);
                if( note_name)
                    return [note_name, 0];
            }
            else {
                if( pitch_name.includes('#') && pitch_name in SCALAR_NAMES_SHARP)
                    return [this.note_names[SCALAR_NAMES_SHARP.indexOf(pitch_name)],0];
                if( pitch_name in SCALAR_NAMES_FLAT)
                    return [this.note_names[SCALAR_NAMES_FLAT.indexOf(pitch_name)], 0];
            }
        }

        console.log(`Pitch name ${pitch_name} not found`);
        return [pitch_name, -1];

    };

    _generic_note_name_to_letter_name(note_name:string,prefer_sharps:boolean=true):[string, number]{
        /**
        Convert from a generic note name as defined by the temperament
        to a letter name used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        */
        note_name = normalize_pitch(note_name);
        // Maybe it is already a letter name?
        if( is_a_sharp(note_name))
            return [note_name, 0];
        if( is_a_flat(note_name))
            return [note_name, 0];
        if( this.number_of_semitones == 21)
            return [ALL_NOTES[this.note_names.indexOf(note_name)], 0];
        if( this.number_of_semitones != 12){
            console.log(`Cannot convert ${note_name} to a letter name`);
            return [note_name, -1];
        }

        if( note_name in this.note_names){
            if( prefer_sharps)
                return [CHROMATIC_NOTES_SHARP[this.note_names.indexOf(note_name)],0];
            return [CHROMATIC_NOTES_FLAT[this.note_names.indexOf(note_name)],0];
        }

        console.log(`Note name ${note_name} not found`);
        return [note_name, -1];
    };

    _convert_from_note_name(note_name:string, target_list:string[]):[string, number]{
        note_name = normalize_pitch(note_name);
        // Maybe it is already in the list
        if( note_name in target_list)
            return [note_name, 0];
        if( this.number_of_semitones != 12){
            console.log(`Cannot convert ${note_name} to a letter name`);
            return [note_name, -1];
        }

        if( note_name in this.note_names){
            // First find the corresponding letter name
            const letter_name = CHROMATIC_NOTES_SHARP[this.note_names.indexOf(note_name)];
            // Next, find the closest note in the scale.
            
            const i = this.closest_note(letter_name)[1];
            const distance:number = this.closest_note(letter_name)[2];
            const error = this.closest_note(letter_name)[3];
            // Use the index to get the corresponding solfege note
            if(error < 0) {
                console.log(`Cannot find closest note to ${letter_name}`);
                return [note_name, -1];
            }
            if( distance == 0)
                return [target_list[i], 0];
            // Remove any accidental
            let [target_note, delta] = strip_accidental(target_list[i]);
            // Add back in the appropriate accidental
            delta += distance;
            return [target_note + ["bb", "b", "", "#", "x"][delta + 2], 0];
        
        }
        console.log(`Note name ${note_name} not found`);
        return [note_name, -1];
    };

    _find_moveable(note_name:string, sharp_scale:string[],
            flat_scale:string[],prefer_sharps:boolean):[string, number]{
                note_name = normalize_pitch(note_name);
                if(sharp_scale.includes(note_name))
                    return [note_name, 0];
                if(flat_scale.includes(note_name))
                    return [note_name, 0];
                if( this.number_of_semitones != 12){
                    console.log(`Cannot convert ${note_name}`);
                    return [note_name, -1];
                }

                if( note_name in this.note_names){
                    if( prefer_sharps)
                        return [sharp_scale[this.note_names.indexOf(note_name)],0];
                    return [flat_scale[this.note_names.indexOf(note_name)], 0];
                }

                console.log(`Cannot convert ${note_name}`);
                return [note_name, -1];
    };

    _generic_note_name_to_solfege(note_name:string,prefer_sharps:boolean=true):[string,number]{
        /**
        Convert from a generic note name as defined by the temperament
        to a solfege note used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        */
        if( this.fixed_solfege)
            return this._convert_from_note_name(note_name, this.solfege_notes);
        
        return this._find_moveable(note_name, SOLFEGE_SHARP, SOLFEGE_FLAT, prefer_sharps);
    };

    _generic_note_name_to_east_indian_solfege(note_name:string,prefer_sharps:boolean=true){
        /**
        Convert from a generic note name as defined by the temperament
        to an East Indian solfege note used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        */
        
        if( this.fixed_solfege)
            return this._convert_from_note_name(note_name,this.east_indian_solfege_notes);
        
        return this._find_moveable(note_name, EAST_INDIAN_SHARP,EAST_INDIAN_FLAT, prefer_sharps);
    };

    _generic_note_name_to_scalar_mode_number(note_name:string, prefer_sharps:boolean=true){
        /**
        Convert from a generic note name as defined by the temperament
        to a scalar mode number used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        */
        if( this.fixed_solfege)
            return this._convert_from_note_name(note_name, this.scalar_mode_numbers);
        
        return this._find_moveable(note_name, SCALAR_NAMES_SHARP, SCALAR_NAMES_FLAT, prefer_sharps);
    };

    _generic_note_name_to_custom_note_name(note_name:string){
        /**
        Convert from a generic note name as defined by the temperament
        to a custom_note_name used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        */
        return this._convert_from_note_name(note_name, this.custom_note_names);
    };

    modal_pitch_to_letter(modal_index:number):[string,number]{
        /**
        Given a modal number, return the corresponding pitch in the scale
        (and any change in octave).
        Parameters
        ----------
        modal_index : int
            The modal index specifies an index into the scale. If the
            index is >= mode length or < 0, a relative change in octave
            is also calculated.
        Returns
        -------
        str
            The pitch that is the result of indexing the scale by the
            modal index.
        int
            The relative change in octave due to mapping the modal index
            to the mode length
        */
        const mode_length = this.get_mode_length();
        if(typeof modal_index === "string")
            modal_index = parseInt(modal_index);
        let delta_ocatve = Math.floor(modal_index / mode_length);
        if( modal_index < 0){
            delta_ocatve -= 1;
            while( modal_index < 0)
                modal_index += mode_length;
        }
        while( modal_index > mode_length - 1)
            modal_index -= mode_length;
        return [this.scale[modal_index], delta_ocatve];
    };

    note_in_scale(target:string):boolean{
        /**
        Given a pitch, check to see if it is in the scale.
        Parameters
        ----------
        target : str
            The target pitch specified as a pitch letter, e.g., c#, fb.
        Returns
        -------
        boolean
            True if the note is in the scale
        */
        return this.closest_note(target)[2] == 0;
    };

    _map_to_semitone_range(i:number, delta_ocatve:number):[number, number]{
        /**
        Ensure that an index value is within the range of the temperament, e.g.,
        i == 12 would be mapped to 0 with a change in octave +1 for a
        temperament with 12 semitones.
        Parameters
        ----------
        i : int
            Index value into semitones
        delta_octave : int
            Any previous change in octave that needs to be preserved
        Returns
        -------
        int
            Index mapped to semitones
        int
            Any additonal change in octave due to mapping
        */
        while( i < 0) {
            i += this.number_of_semitones;
            delta_ocatve -= 1;
        }
        while( i > this.number_of_semitones - 1){
            i -=  this.number_of_semitones;
            delta_ocatve += 1;
        }
        return [i, delta_ocatve];
    };

    semitone_transform(starting_pitch:string, number_of_half_steps:number):[string,number,number]{
        /**
        Given a starting pitch, add a semitone transform and return
        the resultant pitch (and any change in octave).
        Parameters
        ----------
        starting_pitch : str
            The starting pitch specified as a pitch letter, e.g., c#, fb.
        number_of_half_steps : int
            Half steps are steps in the notes defined by the temperament
        Returns
        -------
        str
            The pitch that is the number of half steps from the starting
            pitch.
        int
            The relative change in octave between the starting pitch and the
            new pitch.
        int
            error code
        */
        starting_pitch = normalize_pitch(starting_pitch);
        const original_notation = this.pitch_name_type(starting_pitch);
        let delta_octave = 0;
        if( this.number_of_semitones == 12){
            if( original_notation == LETTER_NAME){
                if( is_a_sharp(starting_pitch)){
                    let i = find_sharp_index(starting_pitch);
                    i += number_of_half_steps;
                    [i,delta_octave] =  this._map_to_semitone_range(i,delta_octave);
                    return [CHROMATIC_NOTES_SHARP[i], delta_octave, 0];
                }
                if( is_a_flat(starting_pitch)){
                    let i = find_flat_index(starting_pitch);
                    i += number_of_half_steps;
                    [i, delta_octave] = this._map_to_semitone_range(i, delta_octave);
                    return [CHROMATIC_NOTES_FLAT[i], delta_octave, 0];
                }
                const [stripped_pitch, delta] = strip_accidental(starting_pitch);
                let note_name, error;
                if( stripped_pitch in this.note_names){
                    note_name = stripped_pitch;
                    error = 0;
                }
                else {
                    [note_name, error] = this.convert_to_generic_note_name(stripped_pitch);
                }
                if( error == 0 ){
                    if( note_name in this.note_names){
                        let i:number = this.note_names.indexOf(note_name);
                        i += number_of_half_steps;
                        [i, delta_octave] = this._map_to_semitone_range(
                            i+ delta, delta_octave
                        );
                        return [this.note_names[i],delta_octave, 0];
                    }
                }
                console.log(`Cannot find ${starting_pitch} in note names`);
                return [starting_pitch, 0 , -1];
            }

            const [note_name, error] = this.convert_to_generic_note_name(starting_pitch);
            const [stripped_pitch, delta] = strip_accidental(note_name);
            if( stripped_pitch in this.note_names){
                let i:number = this.note_names.indexOf(stripped_pitch);
                i += number_of_half_steps;
                [i, delta_octave] = this._map_to_semitone_range(i+delta,delta_octave);
                if( original_notation == SOLFEGE_NAME){
                    return [this._generic_note_name_to_solfege(this.note_names[i], starting_pitch.includes('#'))[0],delta_octave,0];
                }
                if(original_notation == EAST_INDIAN_SOLFEGE_NAME){
                    return [this._generic_note_name_to_east_indian_solfege(this.note_names[i],starting_pitch.includes('#'))[0], delta_octave,0];
                }
                if(original_notation == SCALAR_MODE_NUMBER){
                    return [this._generic_note_name_to_scalar_mode_number(this.note_names[i], starting_pitch.includes('#'))[0], delta_octave, 0];
                }
                return [this.note_names[i], delta_octave, 0];
            }  
            console.log(`Cannot find ${starting_pitch} in note names`);
            return [starting_pitch, 0, -1];
        }

        const __calculate_increment = (delta:number,j:number) =>{
            /**
            Do we skip the accidental?
             */
            if( delta == 0 && j%3==2)
                return 2;
            if( delta == 1 && j%3==1)
                return 2;
            if( delta == -1 && j%3==2)
                return 2;
            return 1;
        }

        const [stripped_pitch, delta] = strip_accidental(starting_pitch);
        // If there are 21 semitones, assume c, c#, db, d, d#,
        // eb... but still go from c# to d or db to c.
        if( this.number_of_semitones == 21){
            if( starting_pitch in ALL_NOTES){
                let i:number = ALL_NOTES.indexOf(starting_pitch);
                if( number_of_half_steps > 0){
                    for(let j = 0;j < number_of_half_steps;j++){
                        i += __calculate_increment(delta,j);
                    }
                }
                else {
                    for(let j = 0;j < 0-number_of_half_steps;j++){
                        i -= __calculate_increment(delta,j);
                    }
                }
                [i,delta_octave] = this._map_to_semitone_range(i,delta_octave);
                return [ALL_NOTES[i], delta_octave, 0];
            }
            if( stripped_pitch in this.note_names){
                let i:number = this.note_names.indexOf(stripped_pitch);
                if( number_of_half_steps > 0){
                    for(let j = 0;j < number_of_half_steps;j++){
                        i += __calculate_increment(delta,j);
                    }
                }
                else {
                    for(let j = 0;j < 0-number_of_half_steps;j++){
                        i -= __calculate_increment(delta,j);
                    }
                }
                [i,delta_octave] = this._map_to_semitone_range(i,delta_octave);
                return [this.note_names[i], delta_octave, 0];
            }
        }

        if(stripped_pitch in this.note_names){
            let i:number = this.note_names.indexOf(stripped_pitch);
            i += number_of_half_steps;
            [i,delta_octave] = this._map_to_semitone_range(i+delta, delta_octave);
            return [this.note_names[i], delta_octave, 0];
        }

        console.log(`Cannot find ${starting_pitch} in note names`);
        return [starting_pitch, 0, -1];
    };
    
    _map_to_scalar_range(i:number, delta_ocatve:number):[number,number]{
        /**
        Ensure that an index value is within the range of the scale, e.g.,
        i == 8 would be mapped to 0 with a change in octave +1 for a
        7-tone scale.

        Parameters
        ----------
        i : int
            Index value into scale

        delta_octave : int
            Any previous change in octave that needs to be preserved

        Returns
        -------
        int
            Index mapped to scale

        int
            Any additonal change in octave due to mapping

        */
        const mode_length = this.get_mode_length();
        while( i< 0){
            i += mode_length;
            delta_ocatve -= 1;
        }
        while( i> mode_length - 1){
            i -= mode_length;
            delta_ocatve += 1;
        }
        return [i,delta_ocatve];
    };

    scalar_transform(starting_pitch:string, number_of_scalar_steps:number):[string,number,number]{
        /**
        Given a starting pitch, add a scalar transform and return
        the resultant pitch (and any change in octave).

        Parameters
        ----------
        starting_pitch : str
            The starting pitch specified as a pitch letter, e.g., c#, fb.
            Note that the starting pitch may or may not be in the scale.

        number_of_scalar_steps : int
            Scalar steps are steps in the scale (as opposed to half-steps)

        Returns
        -------
        str
            The pitch that is the number of scalar steps from the starting
            pitch.

        int
            The relative change in octave between the starting pitch and the
            new pitch.

        int
            error code
        */
        starting_pitch = normalize_pitch(starting_pitch);
        const original_notation = this.pitch_name_type(starting_pitch);
        const prefer_sharps = starting_pitch.includes('#');
        // The calculation is done in the generic note namespace
        const generic_pitch = this.convert_to_generic_note_name(starting_pitch)[0];
        // First, we need to find the closest note to our starting
        // pitch.
        // const [closest_index, distance, error] = this.closest_note(generic_pitch).shift();
        const closest_index = this.closest_note(generic_pitch)[1];
        const distance = this.closest_note(generic_pitch)[2];
        const error = this.closest_note(generic_pitch)[3];
        if( error < 0) 
            return [starting_pitch, 0, error];
        // Next, we add the scalar interval -- the steps are in the
        // scale.
        const new_index = closest_index + number_of_scalar_steps;
        // We also need to determine if we will be travelling more than
        // one octave.
        const mode_length = this.get_mode_length();
        let delta_octave = Math.floor(new_index / mode_length);

        // We need an index value between 0 and mode length - 1.
        let normalized_index = new_index;
        while(normalized_index < 0)
            normalized_index += mode_length;
        while(normalized_index > mode_length - 1)
            normalized_index -= mode_length;
        const generic_new_note = this.generic_scale[normalized_index];
        let new_note = this._restore_format(
            generic_new_note, original_notation, prefer_sharps
        );

        // We need to keep track of whether or not we crossed C, which
        // is the octave boundary.
        if( new_index < 0)
            delta_octave -= 1;
        
        // Do we need to take into account the distance from the
        // closest scalar note?
        if(distance == 0)
            return [new_note, delta_octave, 0];
        let i:number = this.note_names.indexOf(generic_new_note);
        [i,delta_octave ] = this._map_to_scalar_range( i - distance,delta_octave);  
        return [this._restore_format(this.note_names[i], original_notation, prefer_sharps),
            delta_octave, 0];
    };

    generic_note_name_convert_to_type(pitch_name:string, target_type:string, 
        prefer_sharps:boolean = true):string{
        /**
        Given a generic note name, convert it to a pitch name type.

        Parameters
        ----------
        pitch_name : str
            Source generic note name

        target_type : str
            One of the predefined types, e.g., LETTER_NAME, SOLFEGE_NAME, etc.

        prefer_sharps : boolean
            If there is a choice, should we use a sharp or a flat?

        Returns
        -------
        str
            Converted note name
        */
       return this._restore_format(pitch_name,target_type,prefer_sharps);
    
    };

    _restore_format(pitch_name:string, original_notation:string,prefer_sharps:boolean){
        /**
        Format convertor (could be done with a dictionary?)
        */
        if( original_notation == GENERIC_NOTE_NAME)
            return pitch_name;
        if( original_notation == LETTER_NAME)
            return this._generic_note_name_to_letter_name(pitch_name, prefer_sharps)[0];
        if( original_notation == SOLFEGE_NAME)
            return this._generic_note_name_to_solfege(pitch_name, prefer_sharps)[0];
        if( original_notation == CUSTOM_NAME)
            return this._generic_note_name_to_custom_note_name(pitch_name)[0];
        if( original_notation == SCALAR_MODE_NUMBER)
            return this._generic_note_name_to_scalar_mode_number(pitch_name)[0];
        if( original_notation == EAST_INDIAN_SOLFEGE_NAME)
            return this._generic_note_name_to_east_indian_solfege(pitch_name)[0];
        return pitch_name;
    };

    _pitch_to_note_number(pitch_name:string, octave:number){
        /**
        Find the pitch number, e.g., A4 --> 57
        */
        const generic_name = this.convert_to_generic_note_name(pitch_name)[0];
        const ni = this.note_names.indexOf(generic_name);
        const i:number = (octave * this.number_of_semitones ) + ni;
        return Math.floor(i);
    };

    semitone_distance(pitch_a:string, ocatve_a:number, pitch_b:string, ocatve_b:number):number{
        /**
        Calculate the distance between two notes in semitone steps

        Parameters
        ----------
        pitch_a : str
            Pitch name one of two
        octave_a : int
            Octave number one of two
        pitch_b : str
            Pitch name two of two
        octave_b : int
            Octave number two of two

        Returns
        -------
        int
            Distance calculated in semitone steps
        */
        const number1:number = this._pitch_to_note_number(pitch_a, ocatve_a);
        const number2:number = this._pitch_to_note_number(pitch_b, ocatve_b);
        return number1 - number2;
    };

    scalar_distance(pitch_a:string, octave_a:number, pitch_b:string, octave_b:number):[number,number]{
        /**
        Calculate the distance between two notes in scalar steps

        Parameters
        ----------
        pitch_a : str
            Pitch name one of two
        octave_a : int
            Octave number one of two
        pitch_b : str
            Pitch name two of two
        octave_b : int
            Octave number two of two

        Returns
        -------
        int
            Distance calculated in scalar steps
        int
            Any semitone rounding error in the calculation
        */
        const closest1 = this.closest_note(pitch_a);
        const closest2 = this.closest_note(pitch_b);
        if( closest1[1] > closest2[1]){
            return [(closest1[1] - closest2[1]) + 
                    this.get_mode_length() * 
                    (octave_a - octave_b),
                    closest1[2] + closest2[2]];
        }
        else {
            return [this.get_mode_length() - (closest2[1] - closest1[1])
                    + this.get_mode_length() * (octave_a - octave_b),
                    closest1[2] + closest2[2]];
        }
    };

    invert(pitch_name:string, octave:number, invert_point_pitch:string, 
        invert_point_octave:number, invert_mode:string):[string , number]{
        /**
        Invert will rotate a series of notes around an invert point.
        There are three different invert modes: even, odd, and
        scalar. In even and odd modes, the rotation is based on half
        steps. In even and scalar mode, the point of rotation is the
        given note. In odd mode, the point of rotation is shifted up
        by a 1/4 step, enabling rotation around a point between two
        notes. In "scalar" mode, the scalar interval is preserved
        around the point of rotation.

        Parameters
        ----------
        pitch_name : str
            The pitch name of the note to be rotated
        octave : int
            The octave of the note to be rotated
        invert_point_name : str
            The pitch name of the axis of inversion
        invert_point_octave : int
            The octave of the axis of inversion

        Returns
        -------
        str
            Pitch name of the inverted note
        int
            Octave of the inverted note
        */
        if( typeof invert_mode === "number")
            if( invert_mode % 2 == 0)
                invert_mode = "even";
            else   
                invert_mode = "odd";
        
        if( invert_mode == "even" || invert_mode == "odd"){
            let delta:number = this.semitone_distance(
                pitch_name, octave, invert_point_pitch,invert_point_octave
            );
            if( invert_mode == "even")
                delta *= 2;
            else if( invert_mode == "odd")
                delta = 2 * delta - 1;
            const inverted_pitch = this.semitone_transform(pitch_name, -delta)[0];
            const delta_octave =  this.semitone_transform(pitch_name, -delta)[1];
            return [inverted_pitch, octave + delta_octave];
        }
        else if( invert_mode == "scalar"){
            let delta:number = this.scalar_distance(pitch_name, octave, invert_point_pitch,invert_point_octave)[0];
            delta *= 2;
            const inverted_pitch = this.scalar_transform(pitch_name, -delta)[0];
            const delta_octave =  this.scalar_transform(pitch_name, -delta)[1];
            return [inverted_pitch, octave + delta_octave];
        }
        else {
            console.log(`Unknown invert mode ${invert_mode}`);
            return [pitch_name, octave];
        }
        
    };

    closest_note(target:string):[string,number,number,number]{
        /**
        Given a target pitch, what is the closest note in the current
        key signature (key and mode)?

        Parameters
        ----------
        target : str
            target pitch specified as a pitch letter, e.g., c#, fb

        Returns
        -------
        str
            The closest pitch to the target pitch in the scale.
        int
            The scalar index value of the closest pitch in the scale
            (If the target is midway between two scalar pitches, the
            lower pitch is returned.)
        int
            The distance in semitones (half steps) from the target
            pitch to the scalar pitch (If the target is higher than
            the scalar pitch, then distance > 0. If the target is
            lower than the scalar pitch then distance < 0. If the
            target matches a scale pitch, then distance = 0.)
        int
            error code (0 means success)
        */
        target = normalize_pitch(target);
        const original_notation = this.pitch_name_type(target);
        const prefer_sharps:boolean = target.includes('#');
        // The calcualtion is done in the generic note namespace
        target = this.convert_to_generic_note_name(target)[0];
        const [stripped_target, delta] = strip_accidental(target);
        let i:number = 0;
        if (stripped_target in this.note_names){
            i = this.note_names.indexOf(stripped_target);
            i = this._map_to_semitone_range(i + delta,0)[0];
        }
        target = this.note_names[i];

        // First look for an exact match.
        for( let i = 0; i < this.get_mode_length();i++ ){
            if( target == this.generic_scale[i]){
                return [this._restore_format(target, original_notation,prefer_sharps),
                i,
                0,
                0
                ]
            }
        }

        // Then look for the nearest note in the scale.
        if( target in this.note_names){
            const idx = this.note_names.indexOf(target);
            // Look up for a note in the scale.
            let distance = this.number_of_semitones; // max distance
            let n = 0;
            let closest_note:string="";
            for( let i = 0; i < this.get_mode_length();i++ ){
                let ii:number = this.note_names.indexOf(this.generic_scale[i]);
                n = ii - idx;
                let m = ii + this.number_of_semitones - idx;
                if( Math.abs(n) < Math.abs(distance)){
                    closest_note = this.generic_scale[i];
                    distance = n;
                } 
                if( Math.abs(m) < Math.abs(distance)){
                    closest_note = this.generic_scale[i];
                    distance = m;
                }
            }
            if(distance < this.number_of_semitones){
                return [
                    this._restore_format(
                        closest_note, original_notation,
                        prefer_sharps,
                    ),
                    this.generic_scale.indexOf(closest_note),
                    distance,
                    0
                ];
            }

            console.log(`Closest note to ${target} not found`);
            return [this._restore_format(
                        target, original_notation,
                        prefer_sharps
                        ),
                        0,
                        0,
                        -1
                    ];
        }
        console.log(`Note ${target} not found`);
        return [this._restore_format(target, original_notation,prefer_sharps),0,0,-1];

    };

    _prefer_sharps(key:string | string[],mode:string){
        /**
        Some keys prefer to use sharps rather than flats.
        */
        return `${key} ${mode} in ${this.PREFER_SHARPS}`;
    };

    __str__(){
        /**
        Return the key, mode, number of half steps, and the scale.
        */
        let half_steps = [];
        for(let i = 0; i < this.half_steps.length;i++){
            half_steps.push(this.half_steps[i].toString());
        }
        let scale = this.scale.join(" ");
        let key;
        if( this.key.length > 1)
            key = `${this.key[0].toUpperCase()} ${this.key.slice(1)}`;
        else 
            if(typeof this.key === "string")
                key = this.key.toUpperCase();
        return `${key} ${this.mode.toUpperCase()} ${scale}`;
    };



}   