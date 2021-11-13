import { TElementBlockName } from '@/@types/specification';
import { ElementBlock } from './core/elementInstruction';

export class ElementProcess extends ElementBlock {
    constructor(name: TElementBlockName, label: string) {
        super(name, label, {});
    }

    onVisit(): void {
        1;
    }

    onInnerVisit(): void {
        1;
    }

    onInnerExit(): void {
        1;
    }

    onExit(): void {
        1;
    }
}

export class ElementRoutine extends ElementBlock {
    constructor(name: TElementBlockName, label: string) {
        super(name, label, { name: ['string'] });
    }

    onVisit(): void {
        1;
    }

    onInnerVisit(): void {
        1;
    }

    onInnerExit(): void {
        1;
    }

    onExit(): void {
        1;
    }
}
