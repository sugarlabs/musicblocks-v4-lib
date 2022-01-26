import { TElementNameBlock } from '../../@types/specification';
import { ElementBlock } from '../../syntax/elements/elementInstruction';

import { overrideProgramCounter } from '../../execution/interpreter';

// -------------------------------------------------------------------------------------------------

/**
 * @class
 * Defines an If block element.
 * @classdesc
 * Allows entry to scope only if condition is satisfied.
 */
export class ElementIf extends ElementBlock {
    constructor(name: TElementNameBlock, label: string) {
        super(name, label, { condition: ['boolean'] });
    }

    onVisit(params: { condition: boolean }): void {
        if (!params.condition) {
            overrideProgramCounter('__skipscope__');
        }
    }

    onInnerVisit(): void {
        // no use
    }

    onInnerExit(): void {
        // no use
    }

    onExit(): void {
        // no use
    }
}
