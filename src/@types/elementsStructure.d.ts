/** Data-type of a value. */
export type TData = number | string | boolean;

/** Data-type name of a value. */
export type TDataName = 'number' | 'string' | 'boolean';

/** Interface for the class that implements the syntax element. */
export interface IElementSyntax {
    /** Name of the syntax element. */
    name: string;
    /** Kind (`Argument`, `Instruction`) of the syntax element. */
    kind: 'Argument' | 'Instruction';
    /** Type (`Value`, `Expression`, `Statement`, `Block`) of the syntax element. */
    type: 'Value' | 'Expression' | 'Statement' | 'Block';
    /** Number of arguments the syntax element registers. */
    argCount: number;
    /** Names of the arguments the syntax element registers. */
    argLabels: string[];
    /** An object describing the type specification of each argument as a `argName: type[]` pair. */
    argMap: { [key: string]: TDataName[] };
}

/** Generic interface for the class that implements the argument element. */
export interface IElementArgument<T> extends IElementSyntax {
    /** Return types of the value returned by the argument element. */
    returnType: TDataName[];
    /** Value returned by the argument element. */
    value: T;
}

/** Generic interface for the class that implements the value element. */
export interface IElementValue<T> extends IElementArgument<T> {
    /**
     * Updates the value stored in the value element.
     * @param value - new value
     */
    update(value: T): void;
}

/** Generic interface for the class that implements the expression element. */
export interface IElementExpression<T> extends IElementArgument<T> {
    /**
     * Evalutates the logic of the expression using the supplied parameters and stores the value.
     * @param params - An object containing key-value pairs of each argument and it's value
     */
    evaluate(params: { [key: string]: TData }): void;
}
