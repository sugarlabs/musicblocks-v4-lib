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

/** Type for the specification object for data elements. */
export interface IElementSpecificationData {
    label: string;
    type: 'Data';
    category: string;
    prototype: (name: string, label: string) => IElementData<TData>;
}

/** Type for the specification entry object for data elements. */
export interface IElementSpecificationEntryData extends IElementSpecificationData {
    label: string;
    type: 'Data';
    category: string;
    prototype: typeof IElementData;
}

/** Type for the specification object for expression elements. */
export interface IElementSpecificationExpression {
    label: string;
    type: 'Expression';
    category: string;
    prototype: (name: string, label: string) => IElementExpression<TData>;
}

/** Type for the specification object for expression elements. */
export interface IElementSpecificationEntryExpression extends IElementSpecificationExpression {
    label: string;
    type: 'Expression';
    category: string;
    prototype: typeof IElementExpression;
}

/** Type for the specification object for instruction elements. */
interface IElementSpecificationInstruction {
    allowAbove?: string[] | boolean;
    allowBelow?: string[] | boolean;
    forbidAbove?: string[];
    forbidBelow?: string[];
    allowedNestLevel?: number[] | 'any';
    allowedNestInside?: string[] | boolean;
    forbiddenNestInside?: string[];
}

/** Type for the specification object for statement elements. */
export type IElementSpecificationStatement = IElementSpecificationInstruction & {
    label: string;
    type: 'Statement';
    category: string;
    prototype: (name: string, label: string) => IElementStatement;
};

/** Type for the specification object for statement elements. */
export type IElementSpecificationEntryStatement = IElementSpecificationInstruction & {
    label: string;
    type: 'Statement';
    category: string;
    prototype: typeof IElementStatement;
};

/** Type for the specification object for block elements. */
export type IElementSpecificationBlock = IElementSpecificationInstruction & {
    label: string;
    type: 'Block';
    category: string;
    prototype: (name: string, label: string) => IElementBlock;
    allowNestInside?: string[] | boolean;
    forbidNestInside?: string[];
};

/** Type for the specification entry object for block elements. */
export type IElementSpecificationEntryBlock = IElementSpecificationInstruction & {
    label: string;
    type: 'Block';
    category: string;
    prototype: typeof IElementBlock;
    allowNestInside?: string[] | boolean;
    forbidNestInside?: string[];
};

/** Type for the specification object for an element. */
export interface IElementSpecification {
    label: string;
    type: TElementType;
    category: string;
    prototype: new (name: string, label: string) => IElementSyntax;
    allowAbove?: string[] | boolean;
    allowBelow?: string[] | boolean;
    forbidAbove?: string[];
    forbidBelow?: string[];
    allowedNestLevel?: number[] | 'any';
    allowedNestInside?: string[] | boolean;
    forbiddenNestInside?: string[];
    allowNestInside?: string[] | boolean;
    forbidNestInside?: string[] | boolean;
}

/** Type for the snapshot of an element's specification. */
export interface IElementSpecificationSnapshot extends Omit<IElementSpecification, 'prototype'> {
    prototypeName: string;
}
