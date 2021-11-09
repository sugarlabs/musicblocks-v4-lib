/** Data-type of a value. */
export type TData = 'number' | 'string' | 'boolean';

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
    argMap: { [key: string]: TData[] };
}
