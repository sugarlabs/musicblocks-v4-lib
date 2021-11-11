import { IElementSyntax } from '@/@types/syntax/elementsCore';
import { TDataName } from '@/@types/syntax/data';
import { TElementName } from '@/@types/syntax/elementSpecification';

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
    private _name: TElementName;
    /** Stores the display name of the syntax element. */
    private _label: string;
    /** Stores the kind of the syntax element. */
    private _kind: 'Argument' | 'Instruction';
    /** Stores the type of the syntax element. */
    private _type: 'Data' | 'Expression' | 'Statement' | 'Block';
    /** Stores the number of arguments the syntax element registers. */
    private _argCount: number;
    /** Stores the names of the arguments the syntax element registers. */
    private _argLabels: string[];
    /** Stores an object describing the type specification of each argument. */
    private _argMap: { [key: string]: TDataName[] };

    constructor(
        /** Name of the syntax element. */
        name: TElementName,
        /** Display of the syntax element. */
        label: string,
        /** Kind (`Argument`, `Instruction`) of the syntax element. */
        kind: 'Argument' | 'Instruction',
        /** Type (`Data`, `Expression`, `Statement`, `Block`) of the syntax element. */
        type: 'Data' | 'Expression' | 'Statement' | 'Block',
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TDataName[] }
    ) {
        this._name = name;
        this._label = label;
        this._kind = kind;
        this._type = type;
        this._argMap = argMap;
        this._argLabels = Object.keys(this._argMap);
        this._argCount = this.argLabels.length;
    }

    public get name(): TElementName {
        return this._name;
    }

    public get label(): string {
        return this._label;
    }

    public get kind(): 'Argument' | 'Instruction' {
        return this._kind;
    }

    public get type(): 'Data' | 'Expression' | 'Statement' | 'Block' {
        return this._type;
    }

    public get argCount(): number {
        return this._argCount;
    }

    public get argLabels(): string[] {
        return this._argLabels;
    }

    public get argMap(): { [key: string]: TDataName[] } {
        return this._argMap;
    }

    public updateLabel(value: string): void {
        this._label = value;
    }
}
