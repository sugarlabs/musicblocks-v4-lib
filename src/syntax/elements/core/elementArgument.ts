import { TData, TDataName } from '@/@types/data';
import { TElementName } from '@/@types/specification';
import { IElementArgument, IElementExpression, IElementData } from '@/@types/elementsCore';

import { ElementSyntax } from './elementSyntax';

// -------------------------------------------------------------------------------------------------

/**
 * @virtual
 * @class
 * Generic class that defines a generic argument element.
 *
 * @classdesc
 * Argument elements return a value which is either stored (data element) or evaluated (expression
 * element) from the parameters passed. Every data element and expression element needs to extend
 * this class.
 */
export abstract class ElementArgument<T> extends ElementSyntax implements IElementArgument<T> {
    /** Stores the return type of the value returned by the argument element. */
    private _returnType: TDataName[];
    /** Stores the value this is returned by the argument element. */
    protected _value: T;

    constructor(
        /** Name of the argument element. */
        name: TElementName,
        /** Display name of the instruction element. */
        label: string,
        /** Type (`Data`, `Expression`) of the argument element. */
        type: 'Data' | 'Expression',
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TDataName[] },
        /** Return types of the value returned by the argument element. */
        returnType: TDataName[],
        /** Initial return value of the argument. */
        initialValue: T
    ) {
        super(name, label, 'Argument', type, argMap);

        this._returnType = returnType;
        this._value = initialValue;
    }

    public get returnType(): TDataName[] {
        return this._returnType;
    }

    public get value(): T {
        return this._value;
    }
}

/**
 * @virtual
 * @class
 * Generic class that defines a generic data element.
 *
 * @classdesc
 * Data elements return a stored value.
 */
export abstract class ElementData<T> extends ElementArgument<T> implements IElementData<T> {
    constructor(
        /** Name of the data element. */
        name: TElementName,
        /** Display name of the instruction element. */
        label: string,
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TDataName[] },
        /** Return types of the value returned by the argument element. */
        returnType: TDataName[],
        /** Initial return value of the argument. */
        initialValue: T
    ) {
        super(name, label, 'Data', argMap, returnType, initialValue);
    }

    public abstract evaluate(): void;
}

/**
 * @virtual
 * @class
 * Generic class that defines a generic expression element.
 *
 * @classdesc
 * Expression elements evalutate a value based on the provided passed whose shape is in accordance
 * with the shape of arguments it registers.
 */
export abstract class ElementExpression<T>
    extends ElementArgument<T>
    implements IElementExpression<T>
{
    constructor(
        /** Name of the expression element. */
        name: TElementName,
        /** Display name of the instruction element. */
        label: string,
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TDataName[] },
        /** Return types of the value returned by the argument element. */
        returnType: TDataName[],
        /** Initial return value of the argument. */
        initialValue: T
    ) {
        super(name, label, 'Expression', argMap, returnType, initialValue);
    }

    public abstract evaluate(params: { [key: string]: TData }): void;
}
