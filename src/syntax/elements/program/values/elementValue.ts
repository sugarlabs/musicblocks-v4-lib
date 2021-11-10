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
    constructor(name: string, returnType: TDataName[], initialValue: T) {
        super(name, {}, returnType, initialValue);
    }
}

/**
 * @class
 * Defines a value element that stores a boolean value.
 */
export class ElementValueBoolean extends ElementValue<boolean> {
    constructor() {
        super('value-boolean', ['boolean'], true);
    }
}

/**
 * @class
 * Defines a value element that stores a number value.
 */
export class ElementValueNumber extends ElementValue<number> {
    constructor() {
        super('value-number', ['number'], 0);
    }
}

/**
 * @class
 * Defines a value element that stores a string value.
 */
export class ElementValueString extends ElementValue<string> {
    constructor() {
        super('value-string', ['string'], '');
    }
}
