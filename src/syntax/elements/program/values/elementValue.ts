import { TDataName } from '@/@types/syntax/data';
import { ElementData } from '../../core/elementArgument';

/**
 * @virtual
 * @class
 * Generic class that defines a generic value element.
 *
 * @classdesc
 * Value elements return a stored value.
 */
abstract class ElementValue<T> extends ElementData<T> {
    constructor(name: string, returnType: ['number'], initialValue: number);
    constructor(name: string, returnType: ['string'], initialValue: string);
    constructor(name: string, returnType: ['boolean'], initialValue: boolean);
    constructor(name: string, returnType: [TDataName], initialValue: T) {
        super(name, {}, returnType, initialValue, '');
    }

    /** @throws `Error` (TypeMismatchError) */
    public evaluate(): void {
        switch (this.returnType[0]) {
            case 'boolean':
                if (this._label === 'true' || this._label === 'false') {
                    this._value = (this._label === 'true') as unknown as T;
                } else {
                    throw Error(`TypeMismatchError: ${this._label} is not of type "boolean"`);
                }
                break;
            case 'number':
                if (!isNaN(Number(this._label))) {
                    this._value = Number(this._label) as unknown as T;
                } else {
                    throw Error(`TypeMismatchError: ${this._label} is not of type "number"`);
                }
                break;
            case 'string':
            default:
                this._value = this._label as unknown as T;
        }
    }
}

/**
 * @class
 * Defines a value element that stores a boolean value.
 * @throws `Error` (TypeMismatchError)
 */
export class ElementValueBoolean extends ElementValue<boolean> {
    constructor() {
        super('value-boolean', ['boolean'], true);
    }
}

/**
 * @class
 * Defines a value element that stores a number value.
 * @throws `Error` (TypeMismatchError)
 */
export class ElementValueNumber extends ElementValue<number> {
    constructor() {
        super('value-number', ['number'], 0);
    }
}

/**
 * @class
 * Defines a value element that stores a string value.
 * @throws `Error` (TypeMismatchError)
 */
export class ElementValueString extends ElementValue<string> {
    constructor() {
        super('value-string', ['string'], '');
    }
}
