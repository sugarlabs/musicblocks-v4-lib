# -*- coding: utf-8 -*-
"""
The Scale class defines an object that manages the notes in a scale
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

from musicutils import (
    normalize_pitch,
    strip_accidental,
    get_pitch_type,
    is_a_sharp,
    is_a_flat,
    find_sharp_index,
    find_flat_index,
)

from musicutils import (
    CHROMATIC_NOTES_SHARP,
    CHROMATIC_NOTES_FLAT,
    ALL_NOTES,
    LETTER_NAME,
    SOLFEGE_NAME,
    SOLFEGE_SHARP,
    SOLFEGE_FLAT,
    SOLFEGE_NAMES,
    EAST_INDIAN_SOLFEGE_NAME,
    EAST_INDIAN_SHARP,
    EAST_INDIAN_FLAT,
    EAST_INDIAN_NAMES,
    SCALAR_MODE_NUMBER,
    SCALAR_MODE_NUMBERS,
    SCALAR_NAMES_SHARP,
    SCALAR_NAMES_FLAT,
    EQUIVALENTS,
    EQUIVALENT_SHARPS,
    EQUIVALENT_FLATS,
    PITCH_LETTERS,
    CONVERT_DOWN,
    CONVERT_UP,
    GENERIC_NOTE_NAME,
    UNKNOWN_PITCH_NAME,
    CUSTOM_NAME,
)


class Scale:
    """
    A scale is a selection of notes in an octave.
    """

    TWELVE2TWENTYONE = {
        "n0": ["n0", "n0"],  # c
        "n1": ["n1", "n2"],  # c#, db
        "n2": ["n3", "n3"],  # d
        "n3": ["n4", "n5"],  # d# eb
        "n4": ["n6", "n6"],  # e
        "n5": ["n9", "n9"],  # f
        "n6": ["n10", "n11"],  # f#, gb
        "n7": ["n12", "n12"],  # g
        "n8": ["n13", "n14"],  # g#, ab
        "n9": ["n15", "n15"],  # a
        "n10": ["n16", "n17"],  # a#, bb
        "n11": ["n18", "n18"],  # b
    }

    def __init__(
        self,
        half_steps_pattern=None,
        starting_index=0,
        number_of_semitones=12,
        prefer_sharps=True,
        key="c",
    ):
        """
        When defining a scale, we need the half steps pattern that defines
        the selection anf a starting note, e.g., C or F#,

        Parameters
        ----------
        half_steps_pattern : list
            A list of int values that define how many half steps to take
            between each note in the scale, e.g., [2, 2, 1, 2, 2, 2, 1]
            defines the steps for a Major scale

        starting_index : int
            An index into the half steps defining an octave that determines
            from where to start building the scale, e.g., 0 for C and 7 for G
            in a 12-step temperament

        number_of_semitones : int
            If the half_steps_pattern is an empty list, then use the number
            of semitones instead. (Or trigger a mapping from 12 to 21.)

        prefer_sharps : boolean
            If we are mapping from 12 to 21 semitones, we need to know
            whether or not to prefer sharps or flats.

        key : str
            Key designate for the scale.
        """
        self.key = key
        self.prefer_sharps = prefer_sharps
        # Calculate the number of semitones by summing up the half
        # steps.
        if half_steps_pattern is None:
            self.number_of_semitones = number_of_semitones
            half_steps_pattern = []
            for i in range(self.number_of_semitones):
                half_steps_pattern.append(1)
        else:
            self.number_of_semitones = 0
            for step in half_steps_pattern:
                self.number_of_semitones += step

        # Define generic note names that map to temperament.
        self.note_names = []
        for i in range(self.number_of_semitones):
            self.note_names.append("n%d" % i)

        i = starting_index % len(self.note_names)
        octave = 0
        self.scale = [self.note_names[i]]
        self.octave_deltas = [octave]
        for step in half_steps_pattern:
            i += step
            if not i < self.number_of_semitones:
                octave += 1
                i -= self.number_of_semitones
            self.scale.append(self.note_names[i])
            self.octave_deltas.append(octave)

        # We defined the number of semitones based on the half
        # steps pattern but we may want to map from a 12 step
        # scale to anotther scale, e.g. 21 step scale.
        if (
            self.number_of_semitones != number_of_semitones
            and number_of_semitones == 21
        ):
            if self.prefer_sharps:
                j = 0
            else:
                j = 1
            for i, note in enumerate(self.scale):
                self.scale[i] = self.TWELVE2TWENTYONE[note][j]
            # And regenerate the semitone scale
            self.number_of_semitones = number_of_semitones
            self.note_names = []
            for i in range(self.number_of_semitones):
                self.note_names.append("n%d" % i)

        self.generic_names = self.get_scale()
        if self.number_of_semitones == 12:
            if self.prefer_sharps:
                self.letter_names = self.get_scale(pitch_format=CHROMATIC_NOTES_SHARP)
            else:
                self.letter_names = self.get_scale(pitch_format=CHROMATIC_NOTES_FLAT)
        elif self.number_of_semitones == 21:
            self.letter_names = self.get_scale(pitch_format=ALL_NOTES)
        else:
            # At some point we may want to add some additional
            # notation, ^ and v, for 41.
            self.letter_names = None

        self.solfege_notes = []
        self.east_indian_solfege_notes = []
        self.scalar_mode_numbers = []
        self.custom_note_names = []

        if self.number_of_semitones == 12:
            self.letter_names = self._normalize_scale(self.letter_names)[:]
            self._assign_solfege_note_names()
            self._assign_east_indian_solfege_note_names()
            self._assign_scalar_mode_numbers()

    def _normalize_scale(self, scale):
        """
        Normalize the letter names by converting double sharps and double
        flats.
        """
        # Force the first note to be the same designation as the key.
        scale[0] = self.key
        scale[-1] = self.key
        # At this point, the scale includes the first note of the next
        # octave. Hence, for example, the Latin modes have 8 notes.
        if len(scale) < 9:
            # Convert to preferred accidental.
            if not self.prefer_sharps and "#" in self.key:
                for i, note in enumerate(scale):
                    if "b" in note:
                        if note in EQUIVALENT_SHARPS:
                            scale[i] = EQUIVALENT_SHARPS[note]

            # For Latin scales, we cannot skip notes.
            if len(scale) == 8:
                for i in range(len(scale) - 1):
                    idx1 = PITCH_LETTERS.index(scale[i][0])
                    idx2 = PITCH_LETTERS.index(scale[i + 1][0])
                    if idx2 < idx1:
                        idx2 += 7
                    if idx2 - idx1 > 1:
                        if scale[i + 1] in CONVERT_DOWN:
                            scale[i + 1] = CONVERT_DOWN[scale[i + 1]]
            # And ensure there are no repeated letter names.
            for i in range(len(scale) - 1):
                if i == 0 and scale[i][0] == scale[i + 1][0]:
                    if scale[i + 1] in CONVERT_UP:
                        new_next_note = CONVERT_UP[scale[i + 1]]
                        scale[i + 1] = new_next_note
                elif scale[i][0] == scale[i + 1][0]:
                    if scale[i] in CONVERT_DOWN:
                        new_current_note = CONVERT_DOWN[scale[i]]
                    else:
                        print(scale[i])
                    # If changing the current note makes it the same
                    # as the previous note, then we need to change the
                    # next note instead.
                    if new_current_note[0] != scale[i - 1][0]:
                        scale[i] = new_current_note
                    else:
                        if scale[i + 1] in CONVERT_UP:
                            new_next_note = CONVERT_UP[scale[i + 1]]
                            scale[i + 1] = new_next_note
        else:
            # Convert to preferred accidental.
            if "#" in self.key:
                for i, note in enumerate(scale):
                    if "b" in note:
                        if note in EQUIVALENT_SHARPS:
                            scale[i] = EQUIVALENT_SHARPS[note]

        convert_up = False
        convert_down = False
        for i, note in enumerate(scale):
            if "x" in note:
                convert_up = True
                break
            if len(scale[i]) > 2:
                convert_down = True
        if convert_up:
            for i, note in enumerate(scale):
                if "x" in note:
                    scale[i] = CONVERT_UP[note]
                if scale[i] in EQUIVALENT_FLATS:
                    scale[i] = EQUIVALENT_FLATS[scale[i]]
        elif convert_down:
            for i, note in enumerate(scale):
                if len(note) > 2:
                    scale[i] = CONVERT_DOWN[note]
                if note in EQUIVALENT_SHARPS:
                    scale[i] = EQUIVALENT_SHARPS[scale[i]]

        return scale

    def _mode_map_list(self, source_list):
        """
        Given a list of names, map them to the current mode.

        Parameters
        ----------
        source_list : list
            List of names, e.g., Solfege names

        Returns
        -------
        list
            List of names mapped to the mode
        """
        return_list = []
        # Don't include the octave note.
        mode_length = len(self.letter_names) - 1
        offset = "cdefgab".index(self.letter_names[0][0])
        for i in range(len(self.letter_names)):
            j = "cdefgab".index(self.letter_names[i][0]) - offset
            if j < 0:
                j += len(source_list)
            if mode_length < 8:
                # We ensured a unique letter name for each note when we
                # built the scale.
                return_list.append(source_list[j])
            else:
                # Some letters are repeated, so we need the accidentals.
                return_list.append(
                    source_list[j]
                    + ["bb", "b", "", "#", "x"][
                        strip_accidental(self.letter_names[i])[1] + 2
                    ]
                )
        return_list[-1] = return_list[0]
        return return_list

    def _assign_solfege_note_names(self):
        """
        Create a Solfege mapping of the scale ("fixed Solfege == True")

        Examples:
        Major: ['do', 're', 'me', 'fa', 'sol', 'la', 'ti', 'do']
        Major Pentatonic: ['do', 're', 'me', 'sol', 'la', 'do']
        Minor Pentatonic: ['do', 'me', 'fa', 'sol', 'ti', 'do']
        Whole Tone: ['do', 're', 'me', 'sol', 'la', 'ti', 'do']
        NOTE: Solfege assignment only works for temperaments of 12 semitones.
        """
        self.solfege_notes = []

        if self.number_of_semitones == 12 or self.number_of_semitones == 21:
            self.solfege_notes = self._mode_map_list(SOLFEGE_NAMES)
        else:
            print(
                "No Solfege for temperaments with %d semitones."
                % self.number_of_semitones
            )

    def _assign_east_indian_solfege_note_names(self):
        """
        East Indian Solfege
        NOTE: Solfege assignment only works for temperaments of 12 semitones.
        """
        self.east_indian_solfege_notes = []

        if self.number_of_semitones == 12 or self.number_of_semitones == 21:
            self.east_indian_solfege_notes = self._mode_map_list(EAST_INDIAN_NAMES)
        else:
            print(
                "No EI Solfege for temperaments with %d semitones."
                % self.number_of_semitones
            )

    def _assign_scalar_mode_numbers(self):
        """
        Scalar mode numbers refer to the available notes in the mode
        NOTE: Assignment only works for temperaments of 12 semitones.
        """
        self.scalar_mode_numbers = []

        if self.number_of_semitones == 12 or self.number_of_semitones == 21:
            self.scalar_mode_numbers = self._mode_map_list(SCALAR_MODE_NUMBERS)
        else:
            print(
                "No mode numbers for temperaments with %d semitones."
                % self.number_of_semitones
            )

    def get_number_of_semitones(self):
        """
        The number of semitones is the number of notes in the temperament.

        Returns
        -------
        int
            The number of notes in the scale
        """
        return len(self.note_names)

    def get_note_names(self):
        """
        The notes defined by the temperament are used to build the scale.

        Returns
        -------
        list
            The notes defined by the temperament
        """
        return self.note_names

    def set_custom_note_names(self, custom_names):
        """
        Custom note names defined by user

        Parameters
        ----------
        custom_names : list
            A list of custom names

        Note: Names should not end with b or x or they will cause
        collisions with the flat (b) and doublesharp (x) accidentals.
        """
        if len(custom_names) != len(self.letter_names) - 1:
            print("A unique name must be assigned to every note in the mode.")
            return -1
        self.custom_note_names = custom_names[:]
        return 0

    def get_custom_note_names(self):
        """
        Custom note names defined by user

        Returns
        -------
        list
            Custom names
        """
        return self.custom_note_names

    def get_scale(self, pitch_format=None):
        """
        The notes in the scale are a subset of the notes defined by the
        temperament.

        Returns
        -------
        list
            The notes in the scale
        """
        if pitch_format is None:
            return self.scale
        if len(pitch_format) == self.number_of_semitones:
            scale = []
            for i in range(len(self.scale)):
                scale.append(pitch_format[self.note_names.index(self.scale[i])])
            return scale
        print("format does not match number of semitones")
        return self.scale

    def get_scale_and_octave_deltas(self, pitch_format=None):
        """
        The notes in the scale are a subset of the notes defined by the
        temperament.

        Returns
        -------
        list
            The notes in the scale
        list
        The octave deltas (either 0 or 1) are used to mark notes above
        B#, which would be in the next octave, e.g., G3, A3, B3, C4...
        """
        return self.get_scale(pitch_format), self.octave_deltas

    def get_letter_names(self):
        """
        The letter names of the notes found in the scale

        Returns
        -------
        list
            The letter names
        """
        return self.letter_names

    def get_solfege_names(self):
        """
        The solfege names of the notes found in the scale

        Returns
        -------
        list
            The solfege names
        """
        return self.solfege_notes

    def get_east_indian_solfege_names(self):
        """
        The East Indian solfege names of the notes found in the scale

        Returns
        -------
        list
            The East Indian solfege names
        """
        return self.east_indian_solfege_notes

    def get_scalar_mode_numbers(self):
        """
        The scalar mode numbers corresponding to the notes found in the scale

        Returns
        -------
        list
            The scalar mode numbers
        """
        return self.scalar_mode_numbers

    def name_converter(self, pitch_name, source_list):
        """
        Convert from a source name, e.g., Solfege, to a note name.
        """
        if pitch_name in source_list:
            i = source_list.index(pitch_name)
            return self.convert_to_generic_note_name(self.scale[i])[0]
        pitch_name, delta = strip_accidental(pitch_name)
        if pitch_name in source_list:
            i = source_list.index(pitch_name)
            note_name = self.convert_to_generic_note_name(self.scale[i])[0]
            i = self.note_names.index(note_name)
            i += delta
            if i < 0:
                i += self.number_of_semitones
            if i > self.number_of_semitones - 1:
                i -= self.number_of_semitones
            return self.note_names[i]
        return None

    def pitch_name_type(self, pitch_name):
        """
        Check pitch type, including test for custom names

        Parameters
        ----------
        pitch_name : str
            pitch name to test

        Returns
        -------
        str
            pitch type, e.g., LETTER_NAME, SOLFEGE_NAME, etc.
        """
        original_notation = get_pitch_type(pitch_name)
        if original_notation == UNKNOWN_PITCH_NAME:
            stripped_pitch = strip_accidental(pitch_name)[0]
            if stripped_pitch in self.custom_note_names:
                original_notation = CUSTOM_NAME
        return original_notation

    def convert_to_generic_note_name(self, pitch_name, fixed_solfege=False):
        """
        Convert from a letter name used by 12-semitone temperaments to
        a generic note name as defined by the temperament.
        NOTE: Only for temperaments with 12 semitones.
        """
        pitch_name = normalize_pitch(pitch_name)
        original_notation = self.pitch_name_type(pitch_name)

        # Maybe it is already a generic name.
        if original_notation == GENERIC_NOTE_NAME:
            return pitch_name, 0

        if self.number_of_semitones == 21:
            if pitch_name in ALL_NOTES:
                return self.note_names[ALL_NOTES.index(pitch_name)], 0

        if original_notation == LETTER_NAME:
            # Look for a letter name, e.g., g# or ab
            if "#" in pitch_name and is_a_sharp(pitch_name):
                return self.note_names[find_sharp_index(pitch_name)], 0
            if is_a_flat(pitch_name):
                return self.note_names[find_flat_index(pitch_name)], 0
            # Catch cb, bx, etc.
            if pitch_name in EQUIVALENT_SHARPS:
                return (
                    self.note_names[
                        CHROMATIC_NOTES_SHARP.index(EQUIVALENT_SHARPS[pitch_name])
                    ],
                    0,
                )
            if pitch_name in EQUIVALENT_FLATS:
                return (
                    self.note_names[find_flat_index(EQUIVALENT_FLATS[pitch_name])],
                    0,
                )
            if pitch_name in EQUIVALENTS:
                if "#" in EQUIVALENTS[pitch_name][0]:
                    return (
                        self.note_names[find_sharp_index(EQUIVALENTS[pitch_name][0])],
                        0,
                    )
                return (
                    self.note_names[find_flat_index(EQUIVALENTS[pitch_name][0])],
                    0,
                )

        if original_notation == SOLFEGE_NAME:
            # Look for a Solfege name
            if fixed_solfege:
                note_name = self.name_converter(pitch_name, self.solfege_notes)
                if note_name is not None:
                    return note_name, 0
            else:
                if "#" in pitch_name and pitch_name in SOLFEGE_SHARP:
                    return self.note_names[SOLFEGE_SHARP.index(pitch_name)], 0
                if pitch_name in SOLFEGE_FLAT:
                    return self.note_names[SOLFEGE_FLAT.index(pitch_name)], 0

        if original_notation == CUSTOM_NAME:
            # Look for a Custom name
            if len(self.custom_note_names) > 0:
                note_name = self.name_converter(pitch_name, self.custom_note_names)
                if note_name is not None:
                    return note_name, 0
            if fixed_solfege:
                stripped_pitch = strip_accidental(pitch_name)[0]
                note_name = self.name_converter(stripped_pitch, self.custom_note_names)
                if note_name is not None:
                    return note_name, 0
            else:
                stripped_pitch = strip_accidental(pitch_name)[0]
                if "#" in pitch_name and stripped_pitch in self.custom_note_names:
                    i = self.custom_note_names.index(stripped_pitch)
                    i += 1
                    if i > len(self.note_names):
                        i = 0
                    return self.note_names[i], 0
                if pitch_name in SCALAR_NAMES_FLAT:
                    i = self.custom_note_names.index(stripped_pitch)
                    i -= 1
                    if i > 0:
                        i = len(self.note_names)
                    return self.note_names[i], 0

        if original_notation == EAST_INDIAN_SOLFEGE_NAME:
            # Look for a East Indian Solfege name
            if fixed_solfege:
                note_name = self.name_converter(
                    pitch_name, self.east_indian_solfege_notes
                )
                if note_name is not None:
                    return note_name, 0
            else:
                if "#" in pitch_name and pitch_name in EAST_INDIAN_SHARP:
                    return self.note_names[EAST_INDIAN_SHARP.index(pitch_name)], 0
                if pitch_name in EAST_INDIAN_FLAT:
                    return self.note_names[EAST_INDIAN_FLAT.index(pitch_name)], 0

        if original_notation == SCALAR_MODE_NUMBER:
            # Look for a scalar mode number
            if fixed_solfege:
                note_name = self.name_converter(pitch_name, self.scalar_mode_numbers)
                if note_name is not None:
                    return note_name, 0
            else:
                if "#" in pitch_name and pitch_name in SCALAR_NAMES_SHARP:
                    return self.note_names[SCALAR_NAMES_SHARP.index(pitch_name)], 0
                if pitch_name in SCALAR_NAMES_FLAT:
                    return self.note_names[SCALAR_NAMES_FLAT.index(pitch_name)], 0

        print("Pitch name %s not found." % pitch_name)
        return pitch_name, -1

    def generic_note_name_to_letter_name(self, note_name, prefer_sharps=True):
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
            return ALL_NOTES[self.note_names.index(note_name)], 0
        if self.number_of_semitones != 12:
            print("Cannot convert %s to a letter name." % note_name)
            return note_name, -1

        if note_name in self.note_names:
            if prefer_sharps:
                return CHROMATIC_NOTES_SHARP[self.note_names.index(note_name)], 0
            return CHROMATIC_NOTES_FLAT[self.note_names.index(note_name)], 0

        print("Note name %s not found." % note_name)
        return note_name, -1
