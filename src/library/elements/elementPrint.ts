import { TData } from '../../@types/data';
import { TElementNameStatement } from '../../@types/specification';
import { ElementStatement } from '../../syntax/elements/elementInstruction';

// -------------------------------------------------------------------------------------------------

export class ElementPrint extends ElementStatement {
    constructor(name: TElementNameStatement, label: string) {
        super(name, label, { value: ['boolean', 'number', 'string'] });
    }

    onVisit(params: { value: TData }): void {
        // eslint-disable-next-line no-console
        console.log(params.value);
    }
}
