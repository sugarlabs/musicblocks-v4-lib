import { TData, TDataName } from './data';
import { ISymbolTable } from './symbolTable';

/** Interface for the class that implements a syntax element. */
export interface IElementSyntax {
    /** Name of the syntax element. */
    name: string;
    /** Kind (`Argument`, `Instruction`) of the syntax element. */
    kind: 'Argument' | 'Instruction';
    /** Type (`Data`, `Expression`, `Statement`, `Block`) of the syntax element. */
    type: 'Data' | 'Expression' | 'Statement' | 'Block';
    /** Number of arguments the syntax element registers. */
    argCount: number;
    /** Names of the arguments the syntax element registers. */
    argLabels: string[];
    /** An object describing the type specification of each argument as a `argName: type[]` pair. */
    argMap: { [key: string]: TDataName[] };
}

/** Generic interface for the class that implements an argument element. */
export interface IElementArgument<T> extends IElementSyntax {
    /** Return types of the value returned by the argument element. */
    returnType: TDataName[];
    /** Value returned by the argument element. */
    value: T;
}

/** Generic interface for the class that implements a data element. */
export interface IElementData<T> extends IElementArgument<T> {
    /**
     * Updates the value stored in the data element.
     * @param value - new value
     */
    update(value: T): void;
}

/** Generic interface for the class that implements an expression element. */
export interface IElementExpression<T> extends IElementArgument<T> {
    /**
     * Evalutates the logic of the expression using the supplied parameters and stores the value.
     * @param params - An object containing key-value pairs of each argument and it's value
     */
    evaluate(params: { [key: string]: TData }): void;
}

/** Interface for the class that implements an instruction element. */
export interface IElementInstruction extends IElementSyntax {
    /**
     * Executes the instruction using the supplied parameters.
     * @param params - An object containing key-value pairs of each argument and it's value
     * @param symbolTable - The symbol table instance to operate on variables
     */
    onVisit(params: { [key: string]: TData }, symbolTable: ISymbolTable): void;
}

/** Interface for the class that implements a statement element. */
export interface IElementStatement extends IElementInstruction {}

/** Interface for the class that implements a block element. */
export interface IElementBlock extends IElementInstruction {
    /** Executes before each containing instruction is executed. */
    onInnerVisit(): void;
    /** Executes after each containing instruction is executed. */
    onInnerExit(): void;
    /** Executes after all containing instructions are executed. */
    onExit(): void;
}
