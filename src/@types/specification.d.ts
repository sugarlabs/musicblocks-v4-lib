import { TData } from './data';
import {
    IElementData,
    IElementExpression,
    IElementStatement,
    IElementBlock,
    IElementSyntax,
} from './elements';

// -------------------------------------------------------------------------------------------------

/** Kind (`Argument`, `Instruction`) of the syntax element. */
export type TElementKind = 'Argument' | 'Instruction';
/** Type (`Data`, `Expression`, `Statement`, `Block`) of the syntax element. */
export type TElementType = 'Data' | 'Expression' | 'Statement' | 'Block';

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

export type TElementBlockName = 'process' | 'routine';

export type TElementName =
    | TElementDataName
    | TElementExpressionName
    | TElementStatementName
    | TElementBlockName;

export interface IElementDataSpecification {
    label: string;
    type: 'Data';
    category: string;
    prototype: (name: TElementDataName, label: string) => IElementData<TData>;
}

export interface IElementSpecificationEntryData extends IElementDataSpecification {
    label: string;
    type: 'Data';
    category: string;
    prototype: typeof IElementData;
}

export interface IElementExpressionSpecification {
    label: string;
    type: 'Expression';
    category: string;
    prototype: (name: TElementExpressionName, label: string) => IElementExpression<TData>;
}

export interface IElementSpecificationEntryExpression extends IElementExpressionSpecification {
    label: string;
    type: 'Expression';
    category: string;
    prototype: typeof IElementExpression;
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
    category: string;
    prototype: (name: TElementStatementName, label: string) => IElementStatement;
};

export type IElementSpecificationEntryStatement = IElementInstructionSpecification & {
    label: string;
    type: 'Statement';
    category: string;
    prototype: typeof IElementStatement;
};

export type IElementBlockSpecification = IElementInstructionSpecification & {
    label: string;
    type: 'Block';
    category: string;
    prototype: (name: TElementBlockName, label: string) => IElementBlock;
    allowNestInside?: TElementBlockName[] | boolean;
    forbidNestInside?: TElementBlockName[] | boolean;
};

export type IElementSpecificationEntryBlock = IElementInstructionSpecification & {
    label: string;
    type: 'Block';
    category: string;
    prototype: typeof IElementBlock;
    allowNestInside?: TElementBlockName[] | boolean;
    forbidNestInside?: TElementBlockName[] | boolean;
};

export interface IElementSpecification {
    label: string;
    type: TElementType;
    category: string;
    prototype: new (name: TElementName, label: string) => IElementSyntax;
    allowAbove?: TElementName[] | boolean;
    allowBelow?: TElementName[] | boolean;
    forbidAbove?: TElementName[] | boolean;
    forbidBelow?: TElementName[] | boolean;
    allowedNestLevel?: number[] | 'any';
    allowedNestInside?: TElementBlockName[] | boolean;
    forbiddenNestInside?: TElementBlockName[] | boolean;
    allowNestInside?: TElementBlockName[] | boolean;
    forbidNestInside?: TElementBlockName[] | boolean;
}
