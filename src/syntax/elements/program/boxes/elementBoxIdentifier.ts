import { TData, TDataName } from '@/@types/syntax/data';
import { ElementData } from '../../core/elementArgument';
import { SymbolTable } from '@/syntax/symbol-table/symbolTable';

/**
 * @virtual
 * @class
 * Generic class that defines a literally generic box identifier element.
 * @classdesc
 * Box identifier elements fetch variables according to their label from the symbol table.
 * @throws `Error` (ItemNotFoundError)
 */
abstract class ElementBoxIdentifier<T> extends ElementData<T> {
    constructor(name: string, returnType: ['boolean'], initialValue: boolean, initialLabel: string);
    constructor(name: string, returnType: ['number'], initialValue: number, initialLabel: string);
    constructor(name: string, returnType: ['string'], initialValue: string, initialLabel: string);
    constructor(
        name: string,
        returnType: ['boolean', 'number', 'string'],
        initialValue: TData,
        initialLabel: string
    );
    constructor(name: string, returnType: TDataName[], initialValue: T, initialLabel: string) {
        super(name, {}, returnType, initialValue, initialLabel);
    }

    /** @override */
    public evaluate(symbolTable: SymbolTable): void {
        const expectedType = typeof this._value as TDataName;

        try {
            const { dataType, value } = symbolTable.getGlobalVariable(this._label)!;
            if (this.returnType.length > 1) {
                this._value = value as unknown as T;
            } else if (dataType === expectedType) {
                this._value = value as unknown as T;
            } else {
                throw Error('');
            }
        } catch (e) {
            if (this.returnType.length > 1) {
                throw Error(`ItemNotFoundError: box "${this._label}" does not exist`);
            } else {
                throw Error(
                    `ItemNotFoundError: box "${this._label}" of type "${expectedType}" does not exist`
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
    constructor() {
        super('boxidentifier-generic', ['boolean', 'number', 'string'], '', '');
    }
}

/**
 * @class
 * Defines a box identifier element that fetches a variable of boolean type based on presence.
 * @throws `Error` (ItemNotFoundError)
 */
export class ElementBoxIdentifierBoolean extends ElementBoxIdentifier<boolean> {
    constructor() {
        super('boxidentifier-boolean', ['boolean'], true, '');
    }
}

/**
 * @class
 * Defines a box identifier element that fetches a variable of number type based on presence.
 * @throws `Error` (ItemNotFoundError)
 */
export class ElementBoxIdentifierNumber extends ElementBoxIdentifier<number> {
    constructor() {
        super('boxidentifier-number', ['number'], 0, '');
    }
}

/**
 * @class
 * Defines a box identifier element that fetches a variable of string type based on presence.
 * @throws `Error` (ItemNotFoundError)
 */
export class ElementBoxIdentifierString extends ElementBoxIdentifier<string> {
    constructor() {
        super('boxidentifier-string', ['string'], '', '');
    }
}
