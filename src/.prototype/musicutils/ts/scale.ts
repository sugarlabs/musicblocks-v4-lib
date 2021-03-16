/** 
The Scale class defines an object that manages the notes in a scale
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

export class Scale {
    /** 
    A scale is a selection of notes in an octave.
    */
    //field
    TWELVE2TWENTYONE: { [key: string]: Array<string>} = {
        "n0": ["n0", "n0"],      // c
        "n1": ["n1", "n2"],     // c#, db
        "n2": ["n3", "n3"],     // d
        "n3": ["n4", "n5"],     // d# eb
        "n4": ["n6", "n6"],     // e
        "n5": ["n9", "n9"],     // f
        "n6": ["n10", "n11"],   // f#, gb
        "n7": ["n12", "n12"],   // g
        "n8": ["n13", "n14"],   // g#, ab
        "n9": ["n15", "n15"],   // a
        "n10": ["n16", "n17"],  // a#, bb
        "n11": ["n18", "n18"],  // b
    };

    half_steps_pattern!: number[];
    starting_index:number=0;
    number_of_semitones:number=12;
    prefer_sharps:boolean=true;
    note_names: string[];
    scale: string[];
    octave_deltas: number[];

    constructor(
        half_steps_pattern:number[]=[],
        starting_index:number=0,
        number_of_semitones:number=12,
        prefer_sharps:boolean=true) {
        
        /** 
        When defining a scale, we need the half steps pattern that defines
        the selection anf a starting note, e.g., C or F#,

        Parameters
        ----------
        half_steps_pattern : list
        A list of int values that define how many half steps to take
        between each note in the scale, e.g., [2, 2, 1, 2, 2, 2, 1]
        defines the steps for a Major scale

        starting_index : number
        An index into the half steps defining an octave that determines
        from where to start building the scale, e.g., 0 for C and 7 for G
        in a 12-step temperament

        number_of_semitones : number
        If the half_steps_pattern is an empty list, then use the number
        of semitones instead. (Or trigger a mapping from 12 to 21.)

        prefer_sharps : boolean
        If we are mapping from 12 to 21 semitones, we need to know
        whether or not to prefer sharps or flats.
        */
        
        //Calculate the number of semitones by summing up the half
        // steps.
        if( half_steps_pattern === []){
            this.number_of_semitones = number_of_semitones;
            half_steps_pattern = []
            for( let i = 0;i < this.number_of_semitones;i++)
                half_steps_pattern.push(1);
        }
        else {
            this.number_of_semitones = 0;
            for( const step of half_steps_pattern )
                this.number_of_semitones += step;
        }

        // Define generic note names that map to temperament.
        this.note_names = [];
        for( let i= 0;i < this.number_of_semitones;i++ ){
            this.note_names.push(`n${i}`);
        }
        let i:number = starting_index % this.note_names.length;
        let octave:number = 0;
        this.scale = [this.note_names[i]];
        this.octave_deltas = [octave];
        for(const step of half_steps_pattern){
            i += step;
            if(!(i < this.number_of_semitones)){
                octave += 1;
                i -= this.number_of_semitones;
            }
            this.scale.push(this.note_names[i]);
            this.octave_deltas.push(octave);
        }

        // We defined the number of semitones based on the half
        // steps pattern but we may want to map from a 12 step
        // scale to anotther scale, e.g. 21 step scale.

        if( this.number_of_semitones != number_of_semitones
            && this.number_of_semitones == 21) {
            let j:number;
            if(prefer_sharps)
                j = 0;
            else 
                j = 1;
            for(let i = 0;i<this.scale.length;i++) {
                let note:string = this.scale[i];
                this.scale[i] = this.TWELVE2TWENTYONE[note][j];
            }
            // And regenerate the seminote scale
            this.number_of_semitones = number_of_semitones;
            this.note_names = [];
            for( let i= 0;i < this.number_of_semitones;i++ ){
                this.note_names.push(`n${i}`);
            }
        }
    };

    get_number_of_semitones():number{
        /**
        The number of semitones is the number of notes in the temperament.

        Returns
            -------
        number
            The number of notes in the scale
        */
       return this.note_names.length;
    };

    get_note_names():string[] {
        /** 
        The notes defined by the temperament are used to build the scale.

        Returns
        -------
        list
            The notes defined by the temperament
        */
       return this.note_names;
    };

    get_scale(pitch_format:string | string[]= ""):string[] {
        if( pitch_format === "")
            return this.scale;
        if( pitch_format.length == this.number_of_semitones){
            let scale:string[] = [];
            for(let i = 0;i < this.scale.length;i++){
                scale.push(pitch_format[this.note_names.indexOf(this.scale[i])]);
            }
            return scale;
        }
        console.log("format does not match number of semitones");
        return this.scale;
    };

    get_scale_and_octave_deltas(pitch_format:string = "") {
        /**
         * The notes in the scale are a subset of the notes defined by the
            temperament.

            Returns
            -------
            list
                The notes in the scale
            list
            The octave deltas (either 0 or 1) are used to mark notes above
            B#, which would be in the next octave, e.g., G3, A3, B3, C4...

         */
        return [this.get_scale(pitch_format), this.octave_deltas];
    };



}