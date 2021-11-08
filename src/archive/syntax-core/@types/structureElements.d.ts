import { TPrimitive, TPrimitiveName } from './primitiveTypes';
import { IContext } from './context';
import { ISymbolTable } from './symbolTable';

/**
 * There are two categories of syntax elements: Arguments and Instructions.
 *
 * Arguments are of two kinds: Data (simply store a value), and Expressions (take other values as
 * arguments and operate on them to return another value).
 *
 * Instructions are of two kinds: Statements (a single linear instruction), and Blocks (wrap around
 * other instructions while performing some actions before and after executing them).
 */

/** Objects whose classes implement this will be tied to the corresponding UI element. */
export interface ISyntaxElement {
    /** Name of the supported syntax element. Different from identifiers. */
    elementName: string;
}

export interface IDataElement {}

export interface IExpressionElement {}

/**
 * To be implemented by the class that handles the argument interface for classes that implement
 * IArgumentExpressionElement or IInstructionElement.
 */
export interface IArgumentMap {
    /** Returns the list of argument labels. */
    argLabels: string[];
    /** Assigns an ArgumentElement | null corresponding to an argument label. */
    setArg: Function;
    /** Returns the ArgumentElement | null corresponding to an argument label. */
    getArg: Function;
}

// ---- Argument elements --------------------------------------------------------------------------

/** To be implemented by the super-class of all argument elements. */
export interface IArgumentElement extends ISyntaxElement {
    /** Whether data argument element or expression argument element. */
    argType: 'data' | 'expression';
    /** Return type of the argument element. */
    type: TPrimitiveName;
    /** Returns the primitive element that the argument element returns. */
    getData: Function;
}

/**
 * To be implemented by sub-classes of class that implement IArgumentElement and represent data
 * arguments.
 */
export interface IArgumentDataElement extends IArgumentElement, IDataElement {}

/**
 * To be implemented by sub-classes of class that implement IArgumentElement and represent
 * expression arguments.
 */
export interface IArgumentExpressionElement extends IArgumentElement, IExpressionElement {
    /** Stores an object of the class that implements IArgumentMap. */
    args: IArgumentMap;
}

// ---- Instruction elements -----------------------------------------------------------------------

/** To be implemented by the super-class of all instruction elements. */
interface IInstructionElement extends ISyntaxElement {
    /** Stores an object of the class that implements IArgumentMap. */
    args: IArgumentMap;
    /** Stores the reference to the next instruction in stack. */
    next: IInstructionElement | null;
    /** Triggered before instruction is executed. */
    onVisit: Function;
}

/**
 * To be implemented by sub-classes of class that implement IInstructionElement and represent
 * non-clamp instructions.
 */
export interface IStatementElement extends IInstructionElement {}

/**
 * To be implemented by sub-classes of class that implement IInstructionElement and represent clamp
 * instructions.
 */
export interface IBlockElement extends IInstructionElement {
    /** Sets the reference to the ith head instruction inside the logical code block/s. */
    setChildHead: Function;
    /** Returns the reference to the ith head instruction inside the logical code block/s. */
    getChildHead: (index: number) => IInstructionElement | null;
    /** Initial head instruction. */
    childHead: IInstructionElement | null;
    /** Triggered after block instruction is executed. */
    onExit: Function;
}
