import { TDataName } from '@/@types/syntax/data';
import { TElementName } from '@/@types/syntax/elementSpecification';
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
    constructor(name: TElementName, returnType: ['number'], initialValue: number);
    constructor(name: TElementName, returnType: ['string'], initialValue: string);
    constructor(name: TElementName, returnType: ['boolean'], initialValue: boolean);
    constructor(name: TElementName, returnType: [TDataName], initialValue: T) {
        super(name, '', {}, returnType, initialValue);
    }

    /** @throws `Error` (TypeMismatchError) */
    public evaluate(): void {
        switch (this.returnType[0]) {
            case 'boolean':
                if (this.label === 'true' || this.label === 'false') {
                    this._value = (this.label === 'true') as unknown as T;
                } else {
                    throw Error(`TypeMismatchError: ${this.label} is not of type "boolean"`);
                }
                break;
            case 'number':
                if (!isNaN(Number(this.label))) {
                    this._value = Number(this.label) as unknown as T;
                } else {
                    throw Error(`TypeMismatchError: ${this.label} is not of type "number"`);
                }
                break;
            case 'string':
            default:
                this._value = this.label as unknown as T;
        }
    }
}

/**
 * @class
 * Defines a value element that stores a boolean value.
 * @throws `Error` (TypeMismatchError)
 */
export class ElementValueBoolean extends ElementValue<boolean> {
    constructor(name: TElementName) {
        super(name, ['boolean'], true);
    }
}

/**
 * @class
 * Defines a value element that stores a number value.
 * @throws `Error` (TypeMismatchError)
 */
export class ElementValueNumber extends ElementValue<number> {
    constructor(name: TElementName) {
        super(name, ['number'], 0);
    }
}

/**
 * @class
 * Defines a value element that stores a string value.
 * @throws `Error` (TypeMismatchError)
 */
export class ElementValueString extends ElementValue<string> {
    constructor(name: TElementName) {
        super(name, ['string'], '');
    }
}
