import {
    IElementSpecificationEntryData,
    IElementSpecificationEntryExpression,
    IElementSpecificationEntryStatement,
    IElementSpecificationEntryBlock,
} from '@/@types/specification';

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
import { ElementProcess, ElementRoutine } from './elements/elementProgram';

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
        label: 'true',
        type: 'Data',
        category: 'value',
        prototype: ElementValueBoolean,
    },
    'value-number': {
        label: '0',
        type: 'Data',
        category: 'value',
        prototype: ElementValueNumber,
    },
    'value-string': {
        label: 'string',
        type: 'Data',
        category: 'value',
        prototype: ElementValueString,
    },
    // -- box elements -----------------------------------------------------------------------------
    'box-generic': {
        label: 'Box',
        type: 'Statement',
        category: 'box',
        prototype: ElementBoxGeneric,
    },
    'box-boolean': {
        label: 'Box (boolean)',
        type: 'Statement',
        category: 'box',
        prototype: ElementBoxBoolean,
    },
    'box-number': {
        label: 'Box (number)',
        type: 'Statement',
        category: 'box',
        prototype: ElementBoxNumber,
    },
    'box-string': {
        label: 'Box (string)',
        type: 'Statement',
        category: 'box',
        prototype: ElementBoxString,
    },
    // -- box identifier elements ------------------------------------------------------------------
    'boxidentifier-generic': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: ElementBoxIdentifierGeneric,
    },
    'boxidentifier-boolean': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: ElementBoxIdentifierBoolean,
    },
    'boxidentifier-number': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: ElementBoxIdentifierNumber,
    },
    'boxidentifier-string': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: ElementBoxIdentifierString,
    },
    // -- math operator elements -------------------------------------------------------------------
    'operator-math-plus': {
        label: '+',
        type: 'Expression',
        category: 'operator-math',
        prototype: ElementOperatorMathPlus,
    },
    'operator-math-minus': {
        label: '-',
        type: 'Expression',
        category: 'operator-math',
        prototype: ElementOperatorMathMinus,
    },
    'operator-math-times': {
        label: '\u00d7',
        type: 'Expression',
        category: 'operator-math',
        prototype: ElementOperatorMathTimes,
    },
    'operator-math-divide': {
        label: '\u00f7',
        type: 'Expression',
        category: 'operator-math',
        prototype: ElementOperatorMathDivide,
    },
    'operator-math-modulus': {
        label: '%',
        type: 'Expression',
        category: 'operator-math',
        prototype: ElementOperatorMathModulus,
    },
    // -- program elements -------------------------------------------------------------------------
    'process': {
        label: 'start',
        type: 'Block',
        category: 'program',
        prototype: ElementProcess,
        allowAbove: false,
        allowBelow: false,
    },
    'routine': {
        label: 'action',
        type: 'Block',
        category: 'program',
        prototype: ElementRoutine,
        allowAbove: false,
        allowBelow: false,
    },
};

export default _elementSpecificationEntries;
