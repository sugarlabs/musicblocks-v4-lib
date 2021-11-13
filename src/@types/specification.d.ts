import { TData } from './data';
import { IElementData, IElementExpression, IElementStatement, IElementBlock } from './elementsCore';

// -------------------------------------------------------------------------------------------------

/** Kind (`Argument`, `Instruction`) of the syntax element. */
export type TElementKind = 'Argument' | 'Instruction';
/** Type (`Data`, `Expression`, `Statement`, `Block`) of the syntax element. */
export type TElementType = 'Data' | 'Expression' | 'Statement' | 'Block';

export type TElementCategoryData = 'value' | 'boxidentifier';
export type TElementCategoryExpression = 'operator-math';
export type TElementCategoryStatement = 'box';
export type TElementCategoryBlock = 'block-dummy';

export type TElementCategory =
    | TElementCategoryData
    | TElementCategoryExpression
    | TElementCategoryStatement
    | TElementCategoryBlock;

export type TElementDataName =
    // value elements
    | 'value-boolean'
    | 'value-number'
    | 'value-string'
    // box identifier elements
    | 'boxidentifier-generic'
    | 'boxidentifier-boolean'
    | 'boxidentifier-number'
    | 'boxidentifier-string';

export type TElementExpressionName =
    // math operator elements
    | 'operator-math-plus'
    | 'operator-math-minus'
    | 'operator-math-times'
    | 'operator-math-divide'
    | 'operator-math-modulus';

export type TElementStatementName =
    // box elements
    'box-generic' | 'box-boolean' | 'box-number' | 'box-string';

export type TElementBlockName = 'block-dummy';

export type TElementName =
    | 'dummy'
    | TElementDataName
    | TElementExpressionName
    | TElementStatementName
    | TElementBlockName;

export interface IElementDataSpecification {
    label: string;
    type: 'Data';
    category: TElementCategoryData;
    prototype: (name: TElementDataName, label: string) => IElementData<TData>;
}

export interface IElementExpressionSpecification {
    label: string;
    type: 'Expression';
    category: TElementCategoryExpression;
    prototype: (name: TElementExpressionName, label: string) => IElementExpression<TData>;
}

interface IElementInstructionSpecification {
    allowAbove?: TElementName[] | boolean;
    allowBelow?: TElementName[] | boolean;
    forbidAbove?: TElementName[] | boolean;
    forbidBelow?: TElementName[] | boolean;
    allowedNestLevel?: number[] | 'any';
    allowedNestInside?: TElementBlockName[] | boolean;
    forbiddenNestInside?: TElementBlockName[] | boolean;
}

export type IElementStatementSpecification = IElementInstructionSpecification & {
    label: string;
    type: 'Statement';
    category: TElementCategoryStatement;
    prototype: (name: TElementStatementName, label: string) => IElementStatement;
};

export type IElementBlockSpecification = IElementInstructionSpecification & {
    label: string;
    type: 'Block';
    category: TElementCategoryBlock;
    prototype: (name: TElementBlockName, label: string) => IElementBlock;
    allowNestInside?: TElementBlockName[] | boolean;
    forbidNestInside?: TElementBlockName[] | boolean;
};
