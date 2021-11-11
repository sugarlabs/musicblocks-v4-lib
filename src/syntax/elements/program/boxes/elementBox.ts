import { TData, TDataName } from '@/@types/syntax/data';
import { ElementStatement } from '../../core/elementInstruction';
import { addGlobalVariable } from '../../../symbol-table/symbolTable';

/**
 * @virtual
 * @class
 * Generic class that defines a literally generic box element.
 *
 * @classdesc
 * Box elements add (declare) variables to the symbol table.
 */
abstract class ElementBox extends ElementStatement {
    constructor(name: string, label: string, types: TDataName[]) {
        super(name, label, {
            name: ['string'],
            value: types
        });
    }

    /** @override */
    public onVisit(params: { name: string; value: TData }): void {
        switch (typeof params.value) {
            case 'boolean':
                addGlobalVariable(params.name, 'boolean', params.value);
                break;
            case 'number':
                addGlobalVariable(params.name, 'number', params.value);
                break;
            case 'string':
                addGlobalVariable(params.name, 'string', params.value);
                break;
            default:
                throw Error('Trespassing access: This should never be reached');
        }
    }
}

/**
 * @class
 * Defines a box element that declares a variable of any data type.
 */
export class ElementBoxGeneric extends ElementBox {
    constructor() {
        super('box-generic', 'box', ['boolean', 'number', 'string']);
    }

    /** @override */
    onVisit(params: { name: string; value: TData }): void {
        super.onVisit(params);
    }
}

/**
 * @class
 * Defines a box element that declares a variable of boolean type.
 */
export class ElementBoxBoolean extends ElementBox {
    constructor() {
        super('box-boolean', 'box (boolean)', ['boolean']);
    }

    /** @override */
    onVisit(params: { name: string; value: boolean }): void {
        super.onVisit(params);
    }
}

/**
 * @class
 * Defines a box element that declares a variable of number type.
 */
export class ElementBoxNumber extends ElementBox {
    constructor() {
        super('box-number', 'box (number)', ['number']);
    }

    /** @override */
    onVisit(params: { name: string; value: number }): void {
        super.onVisit(params);
    }
}

/**
 * @class
 * Defines a box element that declares a variable of string type.
 */
export class ElementBoxString extends ElementBox {
    constructor() {
        super('box-string', 'box (string)', ['string']);
    }

    /** @override */
    onVisit(params: { name: string; value: string }): void {
        super.onVisit(params);
    }
}