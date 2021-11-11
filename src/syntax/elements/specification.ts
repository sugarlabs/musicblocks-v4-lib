import {
    TElementBlockName,
    TElementCategoryBlock,
    TElementCategoryData,
    TElementCategoryExpression,
    TElementCategoryStatement,
    TElementDataName,
    TElementExpressionName,
    TElementName,
    TElementStatementName
} from '@/@types/syntax/elementSpecification';
import { TData } from '@/@types/syntax/data';

import { ElementData, ElementExpression } from './core/elementArgument';
import { ElementBlock, ElementStatement } from './core/elementInstruction';

import {
    ElementValueBoolean,
    ElementValueNumber,
    ElementValueString
} from './program/values/elementValue';
import {
    ElementBoxGeneric,
    ElementBoxBoolean,
    ElementBoxNumber,
    ElementBoxString
} from './program/boxes/elementBox';
import {
    ElementBoxIdentifierGeneric,
    ElementBoxIdentifierBoolean,
    ElementBoxIdentifierNumber,
    ElementBoxIdentifierString
} from './program/boxes/elementBoxIdentifier';
import {
    ElementOperatorMathPlus,
    ElementOperatorMathMinus,
    ElementOperatorMathTimes,
    ElementOperatorMathDivide,
    ElementOperatorMathModulus
} from './program/operators/elementOperatorMath';

class ElementBlockDummy extends ElementBlock {
    constructor(name: TElementBlockName, label: string) {
        super(name, label, {});
    }

    onVisit(): void {
        console.log('dummy onVisit');
    }

    onInnerVisit(): void {
        console.log('dummy onInnerVisit');
    }

    onInnerExit(): void {
        console.log('dummy onInnerExit');
    }

    onExit(): void {
        console.log('dummy onExit');
    }
}

abstract class ElementDataCover extends ElementData<TData> {}
abstract class ElementExpressionCover extends ElementExpression<TData> {}

interface IElementInstructionSpecification {
    allowAbove?: TElementName[] | boolean;
    allowBelow?: TElementName[] | boolean;
    forbidAbove?: TElementName[] | boolean;
    forbidBelow?: TElementName[] | boolean;
    allowedNestLevel?: number[] | 'any';
    allowedNestInside?: TElementBlockName[] | boolean;
    forbiddenNestInside?: TElementBlockName[] | boolean;
}

const elementSpecification: {
    [identifier: string]:
        | {
              label: string;
              type: 'Data';
              category: TElementCategoryData;
              prototype: (name: TElementDataName, label: string) => ElementDataCover;
          }
        | {
              label: string;
              type: 'Expression';
              category: TElementCategoryExpression;
              prototype: (name: TElementExpressionName, label: string) => ElementExpressionCover;
          }
        | (IElementInstructionSpecification & {
              label: string;
              type: 'Statement';
              category: TElementCategoryStatement;
              prototype: (name: TElementStatementName, label: string) => ElementStatement;
          })
        | (IElementInstructionSpecification & {
              label: string;
              type: 'Block';
              category: TElementCategoryBlock;
              prototype: (name: TElementBlockName, label: string) => ElementBlock;
              allowNestInside?: TElementBlockName[] | boolean;
              forbidNestInside?: TElementBlockName[] | boolean;
          });
} = {
    // -- value elements ---------------------------------------------------------------------------
    'value-boolean': {
        label: 'true',
        type: 'Data',
        category: 'value',
        prototype: (name: TElementDataName, label: string) => new ElementValueBoolean(name, label)
    },
    'value-number': {
        label: '0',
        type: 'Data',
        category: 'value',
        prototype: (name: TElementDataName, label: string) => new ElementValueNumber(name, label)
    },
    'value-string': {
        label: 'string',
        type: 'Data',
        category: 'value',
        prototype: (name: TElementDataName, label: string) => new ElementValueString(name, label)
    },
    // -- box elements -----------------------------------------------------------------------------
    'box-generic': {
        label: 'Box',
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName, label: string) =>
            new ElementBoxGeneric(name, label)
    },
    'box-boolean': {
        label: 'Box (boolean)',
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName, label: string) =>
            new ElementBoxBoolean(name, label)
    },
    'box-number': {
        label: 'Box (number)',
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName, label: string) => new ElementBoxNumber(name, label)
    },
    'box-string': {
        label: 'Box (string)',
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName, label: string) => new ElementBoxString(name, label)
    },
    // -- box identifier elements ------------------------------------------------------------------
    'boxidentifier-generic': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName, label: string) =>
            new ElementBoxIdentifierGeneric(name, label)
    },
    'boxidentifier-boolean': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName, label: string) =>
            new ElementBoxIdentifierBoolean(name, label)
    },
    'boxidentifier-number': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName, label: string) =>
            new ElementBoxIdentifierNumber(name, label)
    },
    'boxidentifier-string': {
        label: 'Box 1',
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName, label: string) =>
            new ElementBoxIdentifierString(name, label)
    },
    // -- math operator elements -------------------------------------------------------------------
    'operator-math-plus': {
        label: '+',
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName, label: string) =>
            new ElementOperatorMathPlus(name, label)
    },
    'operator-math-minus': {
        label: '-',
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName, label: string) =>
            new ElementOperatorMathMinus(name, label)
    },
    'operator-math-times': {
        label: '\u00d7',
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName, label: string) =>
            new ElementOperatorMathTimes(name, label)
    },
    'operator-math-divide': {
        label: '\u00f7',
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName, label: string) =>
            new ElementOperatorMathDivide(name, label)
    },
    'operator-math-modulus': {
        label: '%',
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName, label: string) =>
            new ElementOperatorMathModulus(name, label)
    },
    // -- dummy block element ----------------------------------------------------------------------
    'block-dummy': {
        label: 'dummy',
        type: 'Block',
        category: 'block-dummy',
        prototype: (name: TElementBlockName, label: string) => new ElementBlockDummy(name, label)
    }
};

export default elementSpecification;
