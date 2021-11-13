import { TData, TDataName } from '@/@types/data';
import { TElementName } from '@/@types/specification';

import { ElementData } from '../elementArgument';
import { getGlobalVariable } from '@/execution/symbolTable';

// -------------------------------------------------------------------------------------------------

/**
 * @virtual
 * @class
 * Generic class that defines a literally generic box identifier element.
 * @classdesc
 * Box identifier elements fetch variables according to their label from the symbol table.
 * @throws `Error` (ItemNotFoundError)
 */
abstract class ElementBoxIdentifier<T> extends ElementData<T> {
    constructor(name: TElementName, label: string, returnType: ['boolean'], initialValue: boolean);
    constructor(name: TElementName, label: string, returnType: ['number'], initialValue: number);
    constructor(name: TElementName, label: string, returnType: ['string'], initialValue: string);
    constructor(
        name: TElementName,
        label: string,
        returnType: ['boolean', 'number', 'string'],
        initialValue: TData
    );
    constructor(name: TElementName, label: string, returnType: TDataName[], initialValue: T) {
        super(name, label, {}, returnType, initialValue);
    }

    /** @override */
    public evaluate(): void {
        const expectedType = typeof this._value as TDataName;

        try {
            const { dataType, value } = getGlobalVariable(this.label)!;
            if (this.returnType.length > 1) {
                this._value = value as unknown as T;
            } else if (dataType === expectedType) {
                this._value = value as unknown as T;
            } else {
                throw Error('');
            }
        } catch (e) {
            if (this.returnType.length > 1) {
                throw Error(`ItemNotFoundError: box "${this.label}" does not exist`);
            } else {
                throw Error(
                    `ItemNotFoundError: box "${this.label}" of type "${expectedType}" does not exist`
                );
            }
        }
    }
}

/**
 * @class
 * Defines a box identifier element that fetches a variable of any data type based on presence.
 * @throws `Error` (ItemNotFoundError)
 */
export class ElementBoxIdentifierGeneric extends ElementBoxIdentifier<TData> {
    constructor(name: TElementName, label: string) {
        super(name, label, ['boolean', 'number', 'string'], '');
    }
}

/**
 * @class
 * Defines a box identifier element that fetches a variable of boolean type based on presence.
 * @throws `Error` (ItemNotFoundError)
 */
export class ElementBoxIdentifierBoolean extends ElementBoxIdentifier<boolean> {
    constructor(name: TElementName, label: string) {
        super(name, label, ['boolean'], true);
    }
}

/**
 * @class
 * Defines a box identifier element that fetches a variable of number type based on presence.
 * @throws `Error` (ItemNotFoundError)
 */
export class ElementBoxIdentifierNumber extends ElementBoxIdentifier<number> {
    constructor(name: TElementName, label: string) {
        super(name, label, ['number'], 0);
    }
}

/**
 * @class
 * Defines a box identifier element that fetches a variable of string type based on presence.
 * @throws `Error` (ItemNotFoundError)
 */
export class ElementBoxIdentifierString extends ElementBoxIdentifier<string> {
    constructor(name: TElementName, label: string) {
        super(name, label, ['string'], '');
    }
}
