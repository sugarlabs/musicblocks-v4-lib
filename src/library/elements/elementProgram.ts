import { TElementNameBlock } from '../../@types/specification';
import { ElementBlock } from '../../syntax/elements/elementInstruction';

export class ElementProcess extends ElementBlock {
    constructor(name: TElementNameBlock, label: string) {
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
    constructor(name: TElementNameBlock, label: string) {
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
