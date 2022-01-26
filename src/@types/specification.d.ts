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

/** Names of factory list of data elements. */
export type TElementNameData =
    // value elements
    | 'value-boolean'
    | 'value-number'
    | 'value-string'
    // box identifier elements
    | 'boxidentifier-generic'
    | 'boxidentifier-boolean'
    | 'boxidentifier-number'
    | 'boxidentifier-string';

/** Names of factory list of expression elements. */
export type TElementNameExpression =
    // math operator elements
    | 'operator-math-plus'
    | 'operator-math-minus'
    | 'operator-math-times'
    | 'operator-math-divide'
    | 'operator-math-modulus';

/** Names of factory list of statement elements. */
export type TElementNameStatement =
    // box elements
    | 'box-generic'
    | 'box-boolean'
    | 'box-number'
    | 'box-string'
    // print element
    | 'print';

/** Names of factory list of block elements. */
export type TElementNameBlock = 'process' | 'routine' | 'repeat' | 'if';

/** Names of factory list of syntax elements. */
export type TElementName =
    | 'dummy'
    | TElementNameData
    | TElementNameExpression
    | TElementNameStatement
    | TElementNameBlock;

/** Type for the specification object for data elements. */
export interface IElementSpecificationData {
    label: string;
    type: 'Data';
    category: string;
    prototype: (name: TElementNameData, label: string) => IElementData<TData>;
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
    prototype: (name: TElementNameExpression, label: string) => IElementExpression<TData>;
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
    allowAbove?: TElementName[] | boolean;
    allowBelow?: TElementName[] | boolean;
    forbidAbove?: TElementName[];
    forbidBelow?: TElementName[];
    allowedNestLevel?: number[] | 'any';
    allowedNestInside?: TElementNameBlock[] | boolean;
    forbiddenNestInside?: TElementNameBlock[];
}

/** Type for the specification object for statement elements. */
export type IElementSpecificationStatement = IElementSpecificationInstruction & {
    label: string;
    type: 'Statement';
    category: string;
    prototype: (name: TElementNameStatement, label: string) => IElementStatement;
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
    prototype: (name: TElementNameBlock, label: string) => IElementBlock;
    allowNestInside?: (TElementNameStatement | TElementNameBlock)[] | boolean;
    forbidNestInside?: (TElementNameStatement | TElementNameBlock)[];
};

/** Type for the specification entry object for block elements. */
export type IElementSpecificationEntryBlock = IElementSpecificationInstruction & {
    label: string;
    type: 'Block';
    category: string;
    prototype: typeof IElementBlock;
    allowNestInside?: (TElementNameStatement | TElementNameBlock)[] | boolean;
    forbidNestInside?: (TElementNameStatement | TElementNameBlock)[];
};

export interface IElementSpecification {
    label: string;
    type: TElementType;
    category: string;
    prototype: new (name: TElementName, label: string) => IElementSyntax;
    allowAbove?: TElementName[] | boolean;
    allowBelow?: TElementName[] | boolean;
    forbidAbove?: TElementName[];
    forbidBelow?: TElementName[];
    allowedNestLevel?: number[] | 'any';
    allowedNestInside?: TElementNameBlock[] | boolean;
    forbiddenNestInside?: TElementNameBlock[];
    allowNestInside?: (TElementNameStatement | TElementNameBlock)[] | boolean;
    forbidNestInside?: (TElementNameStatement | TElementNameBlock)[] | boolean;
}
