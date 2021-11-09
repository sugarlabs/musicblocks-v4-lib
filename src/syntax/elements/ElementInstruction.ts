import {
    IElementBlock,
    IElementInstruction,
    IElementStatement,
    TData,
    TDataName
} from '@/@types/elementsStructure';
import { ElementSyntax } from './ElementSyntax';

/**
 * @virtual
 * @class
 * Defines a generic instruction element.
 *
 * @classdesc
 * Instruction elements execute logic and may operate on the parameters passed. Every statement element
 * and block element needs to extend this class.
 */
export abstract class ElementInstruction extends ElementSyntax implements IElementInstruction {
    constructor(
        /** Name of the instruction element. */
        name: string,
        /** Type (`Statement`, `Block`) of the instruction element. */
        type: 'Statement' | 'Block',
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TDataName[] }
    ) {
        super(name, 'Instruction', type, argMap);
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
    constructor(
        /** Name of the statement element. */
        name: string,
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TDataName[] }
    ) {
        super(name, 'Statement', argMap);
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
    constructor(
        /** Name of the block element. */
        name: string,
        /** An object describing the type specification of each argument as a `argName: type[]` pair. */
        argMap: { [key: string]: TDataName[] }
    ) {
        super(name, 'Block', argMap);
    }

    public abstract onInnerVisit(): void;

    public abstract onInnerExit(): void;

    public abstract onExit(): void;
}