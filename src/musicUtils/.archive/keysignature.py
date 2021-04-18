# -*- coding: utf-8 -*-
"""
The KeySignature class defines an object that manages a specific
key/mode combination.
"""
# Copyright (c) 2020, 2021 Walter Bender, Sugar Labs
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the The GNU Affero General Public
# License as published by the Free Software Foundation; either
# version 3 of the License, or (at your option) any later version.
#
# You should have received a copy of the GNU Affero General Public
# License along with this library; if not, write to the Free Software
# Foundation, 51 Franklin Street, Suite 500 Boston, MA 02110-1335 USA

from scale import Scale
from musicutils import (
    strip_accidental,
    normalize_pitch,
    is_a_sharp,
    is_a_flat,
    find_sharp_index,
    find_flat_index,
)
from musicutils import (
    ALL_NOTES,
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
    EQUIVALENT_FLATS,
    EQUIVALENT_SHARPS
)


class KeySignature:
    """
    A key signature is a set of sharp, flat, and natural symbols.
    """

    # Predefined modes are defined by the number of semitones between notes.
    MUSICAL_MODES = {
        # 12 notes in an octave
        "chromatic": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        # 8 notes in an octave
        "algerian": [2, 1, 2, 1, 1, 1, 3, 1],
        "diminished": [2, 1, 2, 1, 2, 1, 2, 1],
        "spanish": [1, 2, 1, 1, 1, 2, 2, 2],
        "octatonic": [1, 2, 1, 2, 1, 2, 1, 2],
        "bebop": [1, 1, 1, 2, 2, 1, 2, 2],
        # 7 notes in an octave
        "major": [2, 2, 1, 2, 2, 2, 1],
        "harmonic major": [2, 2, 1, 2, 1, 3, 1],
        "minor": [2, 1, 2, 2, 1, 2, 2],
        "natural minor": [2, 1, 2, 2, 1, 2, 2],
        "harmonic minor": [2, 1, 2, 2, 1, 3, 1],
        "melodic minor": [2, 1, 2, 2, 2, 2, 1],
        # "Church" modes
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
        # 6 notes in an octave
        "minor blues": [3, 2, 1, 1, 3, 2],
        "major blues": [2, 1, 1, 3, 2, 2],
        "whole tone": [2, 2, 2, 2, 2, 2],
        # 5 notes in an octave
        "major pentatonic": [2, 2, 3, 2, 3],
        "minor pentatonic": [3, 2, 2, 3, 2],
        "chinese": [4, 2, 1, 4, 1],
        "egyptian": [2, 3, 2, 3, 2],
        "hirajoshi": [1, 4, 1, 4, 2],
        "in": [1, 4, 2, 1, 4],
        "minyo": [3, 2, 2, 3, 2],
        "fibonacci": [1, 1, 2, 3, 5],
    }

    # These maqam mode names imply a specific key.
    MAQAM_KEY_OVERRIDES = {
        "hijaz kar": "c",
        "hijaz kar maqam": "c",
        "shahnaz": "d",
        "maqam mustar": "eb",
        "maqam jiharkah": "f",
        "shadd araban": "g",
        "suzidil": "a",
        "ajam": "bb",
        "ajam maqam": "bb",
    }

    # These key signaturs (and their equivalents) prefer sharps over flats.
    PREFER_SHARPS = [
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

    def __init__(self, mode="major", key="c", number_of_semitones=12):
        """
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
        """

        prefer_sharps = True
        if isinstance(mode, str):
            mode = mode.lower()
            # Some mode names imply a specific key.
            if mode in self.MAQAM_KEY_OVERRIDES:
                # Override the key.
                key = self.MAQAM_KEY_OVERRIDES[mode]
                mode = "maqam"
            if mode in self.MUSICAL_MODES:
                self.mode = mode
                self.half_steps = self.MUSICAL_MODES[self.mode]
            else:
                print("mode not found")
                self.mode = "chromatic"
                self.half_steps = self.MUSICAL_MODES[self.mode]
        elif isinstance(mode, list):
            self.mode = "custom"  # We could look for a match
            self.half_steps = mode

        self.key = key
        i = 0
        if isinstance(self.key, str):
            key = normalize_pitch(key)
            prefer_sharps = self._prefer_sharps(self.key, self.mode) or "#" in self.key
            if prefer_sharps:
                if self.key not in CHROMATIC_NOTES_SHARP:
                    self.key = EQUIVALENT_SHARPS[self.key]
                i = find_sharp_index(self.key)
            elif self.key in CHROMATIC_NOTES_FLAT or "b" in self.key:
                if self.key not in CHROMATIC_NOTES_FLAT:
                    self.key = EQUIVALENT_FLATS[self.key]
                i = find_flat_index(self.key)
            elif self.key[0] == "n" and self.key[1:].isdecimal():
                i = int(self.key[1:])  # This is not very robust.
            else:
                print("Could not find key index:", self.key)
        elif isinstance(self.key, int):
            i = self.key
        else:
            print("bad key type", type(key))

        if len(self.half_steps) == 0:
            self._scale = Scale(
                starting_index=i, number_of_semitones=number_of_semitones, key=self.key
            )
        else:
            self._scale = Scale(
                half_steps_pattern=self.half_steps,
                starting_index=i,
                number_of_semitones=number_of_semitones,
                prefer_sharps=prefer_sharps,
                key=self.key,
            )

        # The generic names of the notes found in the scale defined by
        # this key and mode
        self.generic_scale = self._scale.get_scale()
        self.number_of_semitones = self._scale.get_number_of_semitones()
        self.fixed_solfege = False

        if self._scale.letter_names is not None:
            self.notes_in_scale = self._scale.letter_names[:]
        else:
            self.notes_in_scale = self._scale.get_scale()

        self.key_signature = "%s %s" % (self.key, self.mode)

    def set_fixed_solfege(self, state=False):
        """
        Fixed Solfege means that the mapping between Solfege and
        letter names is fixed: do == c, re == d, ...

        Moveable (not fixed) Solfege means that do == the first note
        in the scale, etc.

        Parameters
        ----------
        state : boolean
            State to set FIxed Solfege: True or False
        """
        self.fixed_solfege = state

    def get_fixed_solfege(self):
        """
        Returns the Fixed Solfege state

        Returns
        -------
        boolean
            State of fixed Solfege
        """
        return self.fixed_solfege

    def get_notes_in_scale(self):
        """
        The (scalar) notes in the scale.

        Returns
        -------
        list
            The (scalar) notes in the scale.

        NOTE: The internal definition of the scale includes the octave.
        """
        return self.notes_in_scale[:-1]

    def get_mode_length(self):
        """
        How many notes are in the scale?

        Returns
        -------
        int
            The number of (scalar) notes in the scale.
        """
        return len(self.notes_in_scale) - 1

    def get_number_of_semitones(self):
        """
        How many semitones (half-steps) are in the temperament used to
        define this key/mode?

        Returns
        -------
        int
            The number of semitones in the temperament used to define
            the scale
        """
        return self.number_of_semitones

    def get_scale(self):
        """
        The Scale object associated with this key signature

        Returns
        -------
        obj
            Scale object
        """
        return self._scale

    def set_custom_note_names(self, custom_names):
        """
        Set the custom note names in the Scale object

        Parameters
        ----------
        custom_names : list
            List of custom names
        """
        return self._scale.set_custom_note_names(custom_names)

    def get_custom_note_names(self):
        """
        Get the custom note names in the Scale object

        Returns
        ----------
        list
            List of custom names
        """
        return self._scale.get_custom_note_names()

    def _convert_from_note_name(self, note_name, target_list):
        """
        Convert from a note name to a format specified in the target list.
        """
        note_name = normalize_pitch(note_name)
        # Maybe it is already in the list?
        if note_name in target_list:
            return note_name, 0
        if self.number_of_semitones != 12:
            print("Cannot convert %s to a letter name." % note_name)
            return note_name, -1

        if note_name in self._scale.note_names:
            # First find the corresponding letter name
            letter_name = CHROMATIC_NOTES_SHARP[self._scale.note_names.index(note_name)]
            # Next, find the closest note in the scale.
            i, distance, error = self.closest_note(letter_name)[1:]
            # Use the index to get the corresponding solfege note
            if error < 0:
                print("Cannot find closest note to ", letter_name)
                return note_name, -1
            if distance == 0:
                return target_list[i], 0
            # Remove any accidental
            target_note, delta = strip_accidental(target_list[i])
            # Add back in the appropriate accidental
            delta += distance
            return target_note + ["bb", "b", "", "#", "x"][delta + 2], 0

        print("Note name %s not found." % note_name)
        return note_name, -1

    def _find_moveable(self, note_name, sharp_scale, flat_scale, prefer_sharps):
        """
        Find the equivalent moveable note.
        """
        note_name = normalize_pitch(note_name)
        if note_name in sharp_scale:
            return note_name, 0
        if note_name in flat_scale:
            return note_name, 0
        if self.number_of_semitones != 12:
            print("Cannot convert %s" % note_name)
            return note_name, -1

        if note_name in self._scale.note_names:
            if prefer_sharps:
                return sharp_scale[self._scale.note_names.index(note_name)], 0
            return flat_scale[self._scale.note_names.index(note_name)], 0

        print("Cannot convert %s" % note_name)
        return note_name, -1

    def _generic_note_name_to_letter_name(self, note_name, prefer_sharps=True):
        """
        Convert from a generic note name as defined by the temperament
        to a letter name used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        """
        note_name = normalize_pitch(note_name)
        # Maybe it is already a letter name?
        if is_a_sharp(note_name):
            return note_name, 0
        if is_a_flat(note_name):
            return note_name, 0
        if self.number_of_semitones == 21:
            return ALL_NOTES[self._scale.note_names.index(note_name)], 0
        if self.number_of_semitones != 12:
            print("Cannot convert %s to a letter name." % note_name)
            return note_name, -1

        if note_name in self._scale.note_names:
            if prefer_sharps:
                return CHROMATIC_NOTES_SHARP[self._scale.note_names.index(note_name)], 0
            return CHROMATIC_NOTES_FLAT[self._scale.note_names.index(note_name)], 0

        print("Note name %s not found." % note_name)
        return note_name, -1

    def _generic_note_name_to_solfege(self, note_name, prefer_sharps=True):
        """
        Convert from a generic note name as defined by the temperament
        to a solfege note used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        """
        if self.fixed_solfege:
            return self._convert_from_note_name(note_name, self._scale.solfege_notes)

        return self._find_moveable(
            note_name, SOLFEGE_SHARP, SOLFEGE_FLAT, prefer_sharps
        )

    def _generic_note_name_to_east_indian_solfege(self, note_name, prefer_sharps=True):
        """
        Convert from a generic note name as defined by the temperament
        to an East Indian solfege note used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        """

        if self.fixed_solfege:
            return self._convert_from_note_name(
                note_name, self._scale.east_indian_solfege_notes
            )

        return self._find_moveable(
            note_name, EAST_INDIAN_SHARP, EAST_INDIAN_FLAT, prefer_sharps
        )

    def _generic_note_name_to_scalar_mode_number(self, note_name, prefer_sharps=True):
        """
        Convert from a generic note name as defined by the temperament
        to a scalar mode number used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        """

        if self.fixed_solfege:
            return self._convert_from_note_name(
                note_name, self._scale.scalar_mode_numbers
            )

        return self._find_moveable(
            note_name, SCALAR_NAMES_SHARP, SCALAR_NAMES_FLAT, prefer_sharps
        )

    def _generic_note_name_to_custom_note_name(self, note_name):
        """
        Convert from a generic note name as defined by the temperament
        to a custom_note_name used by 12-semitone temperaments.
        NOTE: Only for temperaments with 12 semitones.
        """

        return self._convert_from_note_name(note_name, self._scale.custom_note_names)

    def modal_pitch_to_letter(self, modal_index):
        """
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
        """
        mode_length = self.get_mode_length()
        modal_index = int(modal_index)
        delta_octave = int(modal_index / mode_length)
        if modal_index < 0:
            delta_octave -= 1
            while modal_index < 0:
                modal_index += mode_length
        while modal_index > mode_length - 1:
            modal_index -= mode_length
        return self.notes_in_scale[modal_index], delta_octave

    def note_in_scale(self, target):
        """
        Given a pitch, check to see if it is in the scale.

        Parameters
        ----------
        target : str
            The target pitch specified as a pitch letter, e.g., c#, fb.

        Returns
        -------
        boolean
            True if the note is in the scale
        """
        return self.closest_note(target)[2] == 0

    def _map_to_semitone_range(self, i, delta_octave):
        """
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
        """
        while i < 0:
            i += self.number_of_semitones
            delta_octave -= 1
        while i > self.number_of_semitones - 1:
            i -= self.number_of_semitones
            delta_octave += 1
        return i, delta_octave

    def semitone_transform(self, starting_pitch, number_of_half_steps):
        """
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
        """
        starting_pitch = normalize_pitch(starting_pitch)
        original_notation = self._scale.pitch_name_type(starting_pitch)
        delta_octave = 0
        if self.number_of_semitones == 12:
            if original_notation == LETTER_NAME:
                if is_a_sharp(starting_pitch):
                    i = find_sharp_index(starting_pitch)
                    i += number_of_half_steps
                    i, delta_octave = self._map_to_semitone_range(i, delta_octave)
                    return CHROMATIC_NOTES_SHARP[i], delta_octave, 0
                if is_a_flat(starting_pitch):
                    i = find_flat_index(starting_pitch)
                    i += number_of_half_steps
                    i, delta_octave = self._map_to_semitone_range(i, delta_octave)
                    return CHROMATIC_NOTES_FLAT[i], delta_octave, 0
                stripped_pitch, delta = strip_accidental(starting_pitch)
                if stripped_pitch in self._scale.note_names:
                    note_name = stripped_pitch
                    error = 0
                else:
                    note_name, error = self._scale.convert_to_generic_note_name(
                        stripped_pitch, self.fixed_solfege
                    )
                if error == 0:
                    if note_name in self._scale.note_names:
                        i = self._scale.note_names.index(note_name)
                        i += number_of_half_steps
                        i, delta_octave = self._map_to_semitone_range(
                            i + delta, delta_octave
                        )
                        return self._scale.note_names[i], delta_octave, 0
                print("Cannot find %s in note names." % starting_pitch)
                return starting_pitch, 0, -1

            note_name, error = self._scale.convert_to_generic_note_name(
                starting_pitch, self.fixed_solfege
            )
            stripped_pitch, delta = strip_accidental(note_name)  # starting_pitch)
            if stripped_pitch in self._scale.note_names:
                i = self._scale.note_names.index(stripped_pitch)
                i += number_of_half_steps
                i, delta_octave = self._map_to_semitone_range(i + delta, delta_octave)
                if original_notation == SOLFEGE_NAME:
                    return (
                        self._generic_note_name_to_solfege(
                            self._scale.note_names[i], "#" in starting_pitch
                        )[0],
                        delta_octave,
                        0,
                    )
                if original_notation == EAST_INDIAN_SOLFEGE_NAME:
                    return (
                        self._generic_note_name_to_east_indian_solfege(
                            self._scale.note_names[i], "#" in starting_pitch
                        )[0],
                        delta_octave,
                        0,
                    )
                if original_notation == SCALAR_MODE_NUMBER:
                    return (
                        self._generic_note_name_to_scalar_mode_number(
                            self._scale.note_names[i], "#" in starting_pitch
                        )[0],
                        delta_octave,
                        0,
                    )
                return self._scale.note_names[i], delta_octave, 0
            print("Cannot find %s in note names." % starting_pitch)
            return starting_pitch, 0, -1

        def __calculate_increment(delta, j):
            """
            When there both sharps and flats in a scale, we skip some of the
            accidental as we navigate the semitones.
            """
            if delta == 0 and j % 3 == 2:
                return 2
            if delta == 1 and j % 3 == 1:
                return 2
            if delta == -1 and j % 3 == 2:
                return 2
            return 1

        stripped_pitch, delta = strip_accidental(starting_pitch)
        # If there are 21 semitones, assume c, c#, db, d, d#,
        # eb... but still go from c# to d or db to c.
        if self.number_of_semitones == 21:
            if starting_pitch in ALL_NOTES:
                i = ALL_NOTES.index(starting_pitch)
                if number_of_half_steps > 0:
                    for j in range(number_of_half_steps):
                        i += __calculate_increment(delta, j)
                else:
                    for j in range(-number_of_half_steps):
                        i -= __calculate_increment(delta, j)
                i, delta_octave = self._map_to_semitone_range(i, delta_octave)
                return ALL_NOTES[i], delta_octave, 0
            if stripped_pitch in self._scale.note_names:
                i = self._scale.note_names.index(stripped_pitch)
                if number_of_half_steps > 0:
                    for j in range(number_of_half_steps):
                        i += __calculate_increment(delta, j)
                else:
                    for j in range(-number_of_half_steps):
                        i -= __calculate_increment(delta, j)
                i, delta_octave = self._map_to_semitone_range(i, delta_octave)
                return self._scale.note_names[i], delta_octave, 0

        if stripped_pitch in self._scale.note_names:
            i = self._scale.note_names.index(stripped_pitch)
            i += number_of_half_steps
            i, delta_octave = self._map_to_semitone_range(i + delta, delta_octave)
            return self._scale.note_names[i], delta_octave, 0

        print("Cannot find %s in note names." % starting_pitch)
        return starting_pitch, 0, -1

    def _map_to_scalar_range(self, i, delta_octave):
        """
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
        """
        mode_length = self.get_mode_length()
        while i < 0:
            i += mode_length
            delta_octave -= 1
        while i > mode_length - 1:
            i -= mode_length
            delta_octave += 1
        return i, delta_octave

    def scalar_transform(self, starting_pitch, number_of_scalar_steps):
        """
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
        """
        starting_pitch = normalize_pitch(starting_pitch)
        original_notation = self._scale.pitch_name_type(starting_pitch)
        prefer_sharps = "#" in starting_pitch
        # The calculation is done in the generic note namespace
        generic_pitch = self._scale.convert_to_generic_note_name(
            starting_pitch, self.fixed_solfege
        )[0]
        # First, we need to find the closest note to our starting
        # pitch.
        closest_index, distance, error = self.closest_note(generic_pitch)[1:]
        if error < 0:
            return starting_pitch, 0, error
        # Next, we add the scalar interval -- the steps are in the
        # scale.
        new_index = closest_index + number_of_scalar_steps
        # We also need to determine if we will be travelling more than
        # one octave.
        mode_length = self.get_mode_length()
        delta_octave = int(new_index / mode_length)

        # We need an index value between 0 and mode length - 1.
        normalized_index = new_index
        while normalized_index < 0:
            normalized_index += mode_length
        while normalized_index > mode_length - 1:
            normalized_index -= mode_length
        generic_new_note = self.generic_scale[normalized_index]
        new_note = self._restore_format(
            generic_new_note, original_notation, prefer_sharps
        )

        # We need to keep track of whether or not we crossed C, which
        # is the octave boundary.
        if new_index < 0:
            delta_octave -= 1

        # Do we need to take into account the distance from the
        # closest scalar note?
        if distance == 0:
            return new_note, delta_octave, 0
        i = self._scale.note_names.index(generic_new_note)
        i, delta_octave = self._map_to_scalar_range(i - distance, delta_octave)
        return (
            self._restore_format(
                self._scale.note_names[i], original_notation, prefer_sharps
            ),
            delta_octave,
            0,
        )

    def generic_note_name_convert_to_type(
        self, pitch_name, target_type, prefer_sharps=True
    ):
        """
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
        """
        return self._restore_format(pitch_name, target_type, prefer_sharps)

    def _restore_format(self, pitch_name, original_notation, prefer_sharps):
        """
        Format convertor (could be done with a dictionary?)
        """
        if original_notation == GENERIC_NOTE_NAME:
            return pitch_name
        if original_notation == LETTER_NAME:
            return self._generic_note_name_to_letter_name(
                pitch_name, prefer_sharps
            )[0]
        if original_notation == SOLFEGE_NAME:
            return self._generic_note_name_to_solfege(pitch_name, prefer_sharps)[0]
        if original_notation == CUSTOM_NAME:
            return self._generic_note_name_to_custom_note_name(pitch_name)[0]
        if original_notation == SCALAR_MODE_NUMBER:
            return self._generic_note_name_to_scalar_mode_number(pitch_name)[0]
        if original_notation == EAST_INDIAN_SOLFEGE_NAME:
            return self._generic_note_name_to_east_indian_solfege(pitch_name)[0]
        return pitch_name

    def _pitch_to_note_number(self, pitch_name, octave):
        """
        Find the pitch number, e.g., A4 --> 57
        """
        generic_name = self._scale.convert_to_generic_note_name(
            pitch_name, self.fixed_solfege
        )[0]
        ni = self._scale.note_names.index(generic_name)
        i = (octave * self.number_of_semitones) + ni
        return int(i)

    def semitone_distance(self, pitch_a, octave_a, pitch_b, octave_b):
        """
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
        """
        return self._pitch_to_note_number(
            pitch_b, octave_b
        ) - self._pitch_to_note_number(pitch_a, octave_a)

    def scalar_distance(self, pitch_a, octave_a, pitch_b, octave_b):
        """
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
        """
        closest1 = self.closest_note(pitch_a)
        closest2 = self.closest_note(pitch_b)
        a = closest1[1] + octave_a * self.get_mode_length()
        b = closest2[1] + octave_b * self.get_mode_length()
        return b - a, closest1[2] + closest2[2]

    def invert(
        self, pitch_name, octave, invert_point_pitch, invert_point_octave, invert_mode
    ):
        """
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
        """
        if isinstance(invert_mode, int):
            if invert_mode % 2 == 0:
                invert_mode = "even"
            else:
                invert_mode = "odd"

        if invert_mode in ["even", "odd"]:
            delta = self.semitone_distance(
                invert_point_pitch, invert_point_octave, pitch_name, octave
            )
            if invert_mode == "even":
                delta *= 2
            elif invert_mode == "odd":
                delta = 2 * delta - 1
            inverted_pitch, delta_octave = self.semitone_transform(pitch_name, -delta)[
                0:2
            ]
            return inverted_pitch, octave + delta_octave

        if invert_mode == "scalar":
            delta = self.scalar_distance(
                invert_point_pitch, invert_point_octave, pitch_name, octave
            )[0]
            delta *= 2
            inverted_pitch, delta_octave = self.scalar_transform(pitch_name, -delta)[
                0:2
            ]
            return inverted_pitch, octave + delta_octave

        print("Unknown invert mode", invert_mode)
        return pitch_name, octave

    def closest_note(self, target):
        """
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
        """
        target = normalize_pitch(target)
        original_notation = self._scale.pitch_name_type(target)
        prefer_sharps = "#" in target
        # The calculation is done in the generic note namespace
        target = self._scale.convert_to_generic_note_name(target, self.fixed_solfege)[0]
        stripped_target, delta = strip_accidental(target)
        if stripped_target in self._scale.note_names:
            i = self._scale.note_names.index(stripped_target)
            i = self._map_to_semitone_range(i + delta, 0)[0]
        target = self._scale.note_names[i]

        # First look for an exact match.
        for i in range(self.get_mode_length()):
            if target == self.generic_scale[i]:
                return (
                    self._restore_format(target, original_notation, prefer_sharps),
                    i,
                    0,
                    0,
                )

        # Then look for the nearest note in the scale.
        if target in self._scale.note_names:
            idx = self._scale.note_names.index(target)
            # Look up for a note in the scale.
            distance = self.number_of_semitones  # max distance
            n = 0
            for i in range(self.get_mode_length()):
                ii = self._scale.note_names.index(self.generic_scale[i])
                n = ii - idx
                m = ii + self.number_of_semitones - idx
                if abs(n) < abs(distance):
                    closest_note = self.generic_scale[i]
                    distance = n
                if abs(m) < abs(distance):
                    closest_note = self.generic_scale[i]
                    distance = m
            if distance < self.number_of_semitones:
                return (
                    self._restore_format(
                        closest_note, original_notation, prefer_sharps
                    ),
                    self.generic_scale.index(closest_note),
                    distance,
                    0,
                )

            print("Closest note to %s not found." % target)
            return (
                self._restore_format(target, original_notation, prefer_sharps),
                0,
                0,
                -1,
            )

        print("Note %s not found." % target)
        return self._restore_format(target, original_notation, prefer_sharps), 0, 0, -1

    def _prefer_sharps(self, key, mode):
        """
        Some keys prefer to use sharps rather than flats.
        """
        return "%s %s" % (key, mode) in self.PREFER_SHARPS

    def __str__(self):
        """
        Return the key, mode, number of half steps, and the scale.
        """
        half_steps = []
        for i in range(len(self.half_steps)):
            half_steps.append(str(self.half_steps[i]))
        scale = " ".join(self.notes_in_scale)
        if len(self.key) > 1:
            key = "%s%s" % (self.key[0].upper(), self.key[1:])
        else:
            key = self.key.upper()
        return "%s %s [%s]" % (key, self.mode.upper(), scale)
