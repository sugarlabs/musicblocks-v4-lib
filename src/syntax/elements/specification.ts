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
    constructor(name: TElementBlockName) {
        super(name, 'block-dummy', {});
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
              type: 'Data';
              category: TElementCategoryData;
              prototype: (name: TElementDataName) => ElementDataCover;
          }
        | {
              type: 'Expression';
              category: TElementCategoryExpression;
              prototype: (name: TElementExpressionName) => ElementExpressionCover;
          }
        | (IElementInstructionSpecification & {
              type: 'Statement';
              category: TElementCategoryStatement;
              prototype: (name: TElementStatementName) => ElementStatement;
          })
        | (IElementInstructionSpecification & {
              type: 'Block';
              category: TElementCategoryBlock;
              prototype: (name: TElementBlockName) => ElementBlock;
              allowNestInside?: TElementBlockName[] | boolean;
              forbidNestInside?: TElementBlockName[] | boolean;
          });
} = {
    // -- value elements ---------------------------------------------------------------------------
    'value-boolean': {
        type: 'Data',
        category: 'value',
        prototype: (name: TElementDataName) => new ElementValueBoolean(name)
    },
    'value-number': {
        type: 'Data',
        category: 'value',
        prototype: (name: TElementDataName) => new ElementValueNumber(name)
    },
    'value-string': {
        type: 'Data',
        category: 'value',
        prototype: (name: TElementDataName) => new ElementValueString(name)
    },
    // -- box elements -----------------------------------------------------------------------------
    'box-generic': {
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName) => new ElementBoxGeneric(name)
    },
    'box-boolean': {
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName) => new ElementBoxBoolean(name)
    },
    'box-number': {
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName) => new ElementBoxNumber(name)
    },
    'box-string': {
        type: 'Statement',
        category: 'box',
        prototype: (name: TElementStatementName) => new ElementBoxString(name)
    },
    // -- box identifier elements ------------------------------------------------------------------
    'boxidentifier-generic': {
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName) => new ElementBoxIdentifierGeneric(name)
    },
    'boxidentifier-boolean': {
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName) => new ElementBoxIdentifierBoolean(name)
    },
    'boxidentifier-number': {
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName) => new ElementBoxIdentifierNumber(name)
    },
    'boxidentifier-string': {
        type: 'Data',
        category: 'boxidentifier',
        prototype: (name: TElementDataName) => new ElementBoxIdentifierString(name)
    },
    // -- math operator elements -------------------------------------------------------------------
    'operator-math-plus': {
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName) => new ElementOperatorMathPlus(name)
    },
    'operator-math-minus': {
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName) => new ElementOperatorMathMinus(name)
    },
    'operator-math-times': {
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName) => new ElementOperatorMathTimes(name)
    },
    'operator-math-divide': {
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName) => new ElementOperatorMathDivide(name)
    },
    'operator-math-modulus': {
        type: 'Expression',
        category: 'operator-math',
        prototype: (name: TElementExpressionName) => new ElementOperatorMathModulus(name)
    },
    // -- dummy block element ----------------------------------------------------------------------
    'block-dummy': {
        type: 'Block',
        category: 'block-dummy',
        prototype: (name: TElementBlockName) => new ElementBlockDummy(name)
    }
};

export default elementSpecification;
