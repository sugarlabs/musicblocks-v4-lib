import { TData, TDataName } from '../../@types/data';
import { TElementName } from '../../@types/specification';
import { IElementBlock, IElementInstruction, IElementStatement } from '../../@types/elements';

import { ElementSyntax } from './elementSyntax';

// -------------------------------------------------------------------------------------------------

/**
 * @virtual
 * @class
 * Defines a generic instruction element.
 *
 * @classdesc
 * Instruction elements execute logic and may operate on the parameters passed. Every statement
 * element and block element needs to extend this class.
 */
export abstract class ElementInstruction extends ElementSyntax implements IElementInstruction {
    /**
     * @param name name of the instruction element
     * @param label display name of the instruction element
     * @param type type (`Statement`, `Block`) of the instruction element
     * @param argMap an object describing the type specification of each argument as a
     *  `argName: type[]` pair
     */
    constructor(
        name: TElementName,
        label: string,
        type: 'Statement' | 'Block',
        argMap: { [key: string]: TDataName[] }
    ) {
        super(name, label, 'Instruction', type, argMap);
    }

    public abstract onVisit(params: { [key: string]: TData }): void;
}

/**
 * @virtual
 * @class
 * Defines a generic statement element.
 *
 * @classdesc
 * Statement elements execute one single logic.
 */
export abstract class ElementStatement extends ElementInstruction implements IElementStatement {
    /**
     * @param name name of the statement element
     * @param label display name of the instruction element
     * @param argMap an object describing the type specification of each argument as a
     *  `argName: type[]` pair
     */
    constructor(name: TElementName, label: string, argMap: { [key: string]: TDataName[] }) {
        super(name, label, 'Statement', argMap);
    }
}

/**
 * @virtual
 * @class
 * Defines a generic block element.
 *
 * @classdesc
 * Block elements encapsulate other instruction elements and set-up states prior to their execution.
 * After the contained instruction elements have completed execution, the initial state prior to
 * visiting the block element is restored.
 */
export abstract class ElementBlock extends ElementInstruction implements IElementBlock {
    /**
     * @param name name of the block element
     * @param label display name of the instruction element
     * @param argMap an object describing the type specification of each argument as a
     *  `argName: type[]` pair
     */
    constructor(name: TElementName, label: string, argMap: { [key: string]: TDataName[] }) {
        super(name, label, 'Block', argMap);
    }

    public abstract onInnerVisit(): void;

    public abstract onInnerExit(): void;

    public abstract onExit(): void;
}
