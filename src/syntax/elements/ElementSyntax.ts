import { IElementSyntax, TData } from '@/@types/elementsStructure';

/**
 * @virtual
 * @class
 * Defines a generic syntax element and it's properties.
 *
 * @classdesc
 * Syntax elements define the building blocks of a Music Blocks program. Every building block
 * element need to inherit this class.
 */
export abstract class ElementSyntax implements IElementSyntax {
    /** Stores the name of the syntax element. */
    private _name: string;
    /** Stores the kind of the syntax element. */
    private _kind: 'Argument' | 'Instruction';
    /** Stores the type of the syntax element. */
    private _type: 'Value' | 'Expression' | 'Statement' | 'Block';
    /** Stores the number of arguments the syntax element registers. */
    private _argCount: number;
    /** Stores the names of the arguments the syntax element registers. */
    private _argLabels: string[];
    /** Stores an object describing the type specification of each argument. */
    private _argMap: { [key: string]: TData[] };

    constructor(
        /** Name of the syntax element. */
        name: string,
        /** Kind (`Argument`, `Instruction`) of the syntax element. */
        kind: 'Argument' | 'Instruction',
        /** Type (`Value`, `Expression`, `Statement`, `Block`) of the syntax element. */
        type: 'Value' | 'Expression' | 'Statement' | 'Block',
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TData[] }
    ) {
        this._name = name;
        this._kind = kind;
        this._type = type;
        this._argMap = argMap;
        this._argLabels = Object.keys(this._argMap);
        this._argCount = this.argLabels.length;
    }

    public get name(): string {
        return this._name;
    }

    public get kind(): 'Argument' | 'Instruction' {
        return this._kind;
    }

    public get type(): 'Value' | 'Expression' | 'Statement' | 'Block' {
        return this._type;
    }

    public get argCount(): number {
        return this._argCount;
    }

    public get argLabels(): string[] {
        return this._argLabels;
    }

    public get argMap(): { [key: string]: TData[] } {
        return this._argMap;
    }
}
