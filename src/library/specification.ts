import type {
    IElementSpecificationEntryData,
    IElementSpecificationEntryExpression,
    IElementSpecificationEntryStatement,
    IElementSpecificationEntryBlock,
} from '../@types/specification';

import {
    ElementValueBoolean,
    ElementValueNumber,
    ElementValueString,
} from './elements/elementValue';
import {
    ElementBoxGeneric,
    ElementBoxBoolean,
    ElementBoxNumber,
    ElementBoxString,
} from './elements/elementBox';
import {
    ElementBoxIdentifierGeneric,
    ElementBoxIdentifierBoolean,
    ElementBoxIdentifierNumber,
    ElementBoxIdentifierString,
} from './elements/elementBoxIdentifier';
import {
    ElementOperatorMathPlus,
    ElementOperatorMathMinus,
    ElementOperatorMathTimes,
    ElementOperatorMathDivide,
    ElementOperatorMathModulus,
} from './elements/elementOperatorMath';
import { ElementRepeat } from './elements/elementLoop';
import { ElementIf } from './elements/elementConditional';
import { ElementProcess, ElementRoutine } from './elements/elementProgram';
import { ElementPrint } from './elements/elementPrint';

// -------------------------------------------------------------------------------------------------

/** Stores element specification data entries for factory list of syntax elements. */
const _elementSpecificationEntries: {
    [identifier: string]:
        | IElementSpecificationEntryData
        | IElementSpecificationEntryExpression
        | IElementSpecificationEntryStatement
        | IElementSpecificationEntryBlock;
} = {
    // -- value elements ---------------------------------------------------------------------------
    'value-boolean': {
        classification: { group: 'programming', category: 'value' },
        label: 'true',
        type: 'Data',
        prototype: ElementValueBoolean,
        values: {
            types: ['boolean'],
        },
    },
    'value-number': {
        classification: { group: 'programming', category: 'value' },
        label: '0',
        type: 'Data',
        prototype: ElementValueNumber,
        values: {
            types: ['number'],
        },
    },
    'value-string': {
        classification: { group: 'programming', category: 'value' },
        label: 'string',
        type: 'Data',
        prototype: ElementValueString,
    },
    // -- box elements -----------------------------------------------------------------------------
    'box-generic': {
        classification: { group: 'programming', category: 'box' },
        label: 'Box',
        type: 'Statement',
        prototype: ElementBoxGeneric,
    },
    'box-boolean': {
        classification: { group: 'programming', category: 'box' },
        label: 'Box (boolean)',
        type: 'Statement',
        prototype: ElementBoxBoolean,
    },
    'box-number': {
        classification: { group: 'programming', category: 'box' },
        label: 'Box (number)',
        type: 'Statement',
        prototype: ElementBoxNumber,
    },
    'box-string': {
        classification: { group: 'programming', category: 'box' },
        label: 'Box (string)',
        type: 'Statement',
        prototype: ElementBoxString,
    },
    // -- box identifier elements ------------------------------------------------------------------
    'boxidentifier-generic': {
        classification: { group: 'programming', category: 'boxidentifier' },
        label: 'Box 1',
        type: 'Data',
        prototype: ElementBoxIdentifierGeneric,
    },
    'boxidentifier-boolean': {
        classification: { group: 'programming', category: 'boxidentifier' },
        label: 'Box 1',
        type: 'Data',
        prototype: ElementBoxIdentifierBoolean,
    },
    'boxidentifier-number': {
        classification: { group: 'programming', category: 'boxidentifier' },
        label: 'Box 1',
        type: 'Data',
        prototype: ElementBoxIdentifierNumber,
    },
    'boxidentifier-string': {
        classification: { group: 'programming', category: 'boxidentifier' },
        label: 'Box 1',
        type: 'Data',
        prototype: ElementBoxIdentifierString,
    },
    // -- math operator elements -------------------------------------------------------------------
    'operator-math-plus': {
        classification: { group: 'programming', category: 'operator-math' },
        label: '+',
        type: 'Expression',
        prototype: ElementOperatorMathPlus,
    },
    'operator-math-minus': {
        classification: { group: 'programming', category: 'operator-math' },
        label: '-',
        type: 'Expression',
        prototype: ElementOperatorMathMinus,
    },
    'operator-math-times': {
        classification: { group: 'programming', category: 'operator-math' },
        label: '\u00d7',
        type: 'Expression',
        prototype: ElementOperatorMathTimes,
    },
    'operator-math-divide': {
        classification: { group: 'programming', category: 'operator-math' },
        label: '\u00f7',
        type: 'Expression',
        prototype: ElementOperatorMathDivide,
    },
    'operator-math-modulus': {
        classification: { group: 'programming', category: 'operator-math' },
        label: '%',
        type: 'Expression',
        prototype: ElementOperatorMathModulus,
    },
    // -- loop elements ----------------------------------------------------------------------------
    'repeat': {
        classification: { group: 'programming', category: 'loop' },
        label: 'repeat',
        type: 'Block',
        prototype: ElementRepeat,
    },
    // -- conditional elements ---------------------------------------------------------------------
    'if': {
        classification: { group: 'programming', category: 'conditional' },
        label: 'if',
        type: 'Block',
        prototype: ElementIf,
    },
    // -- program elements -------------------------------------------------------------------------
    'process': {
        classification: { group: 'programming', category: 'program' },
        label: 'start',
        type: 'Block',
        prototype: ElementProcess,
        allowAbove: false,
        allowBelow: false,
    },
    'routine': {
        classification: { group: 'programming', category: 'program' },
        label: 'action',
        type: 'Block',
        prototype: ElementRoutine,
        allowAbove: false,
        allowBelow: false,
    },
    // -- print element ----------------------------------------------------------------------------
    'print': {
        classification: { group: 'programming', category: 'misc' },
        label: 'print',
        type: 'Statement',
        prototype: ElementPrint,
    },
};

export default _elementSpecificationEntries;
