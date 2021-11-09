import { TDataName } from '@/@types/syntax/data';
import { ElementSyntax } from './elementSyntax';

class DummyElementSyntax extends ElementSyntax {
    constructor(
        name: string,
        kind: 'Argument' | 'Instruction',
        type: 'Value' | 'Expression' | 'Statement' | 'Block',
        argMap: { [key: string]: TDataName[] }
    ) {
        super(name, kind, type, argMap);
    }
}

describe('class ElementSyntax', () => {
    test('instantiate class that extends ElementSyntax with 0 arguments and validate API', () => {
        let dummyElementSyntax: DummyElementSyntax;

        dummyElementSyntax = new DummyElementSyntax('dummy', 'Argument', 'Value', {});
        expect(dummyElementSyntax.name).toBe('dummy');
        expect(dummyElementSyntax.kind).toBe('Argument');
        expect(dummyElementSyntax.type).toBe('Value');
        expect(dummyElementSyntax.argCount).toBe(0);
        expect(dummyElementSyntax.argLabels).toEqual([]);
        expect(dummyElementSyntax.argMap).toEqual({});

        dummyElementSyntax = new DummyElementSyntax('dummy', 'Argument', 'Expression', {});
        expect(dummyElementSyntax.name).toBe('dummy');
        expect(dummyElementSyntax.kind).toBe('Argument');
        expect(dummyElementSyntax.type).toBe('Expression');
        expect(dummyElementSyntax.argCount).toBe(0);
        expect(dummyElementSyntax.argLabels).toEqual([]);
        expect(dummyElementSyntax.argMap).toEqual({});

        dummyElementSyntax = new DummyElementSyntax('dummy', 'Instruction', 'Statement', {});
        expect(dummyElementSyntax.name).toBe('dummy');
        expect(dummyElementSyntax.kind).toBe('Instruction');
        expect(dummyElementSyntax.type).toBe('Statement');
        expect(dummyElementSyntax.argCount).toBe(0);
        expect(dummyElementSyntax.argLabels).toEqual([]);
        expect(dummyElementSyntax.argMap).toEqual({});

        dummyElementSyntax = new DummyElementSyntax('dummy', 'Instruction', 'Block', {});
        expect(dummyElementSyntax.name).toBe('dummy');
        expect(dummyElementSyntax.kind).toBe('Instruction');
        expect(dummyElementSyntax.type).toBe('Block');
        expect(dummyElementSyntax.argCount).toBe(0);
        expect(dummyElementSyntax.argLabels).toEqual([]);
        expect(dummyElementSyntax.argMap).toEqual({});
    });

    test('instantiate class that extends ElementSyntax with 3 arguments and validate API', () => {
        const dummyElementSyntax = new DummyElementSyntax('dummy', 'Instruction', 'Block', {
            arg1: ['number'],
            arg2: ['string', 'number'],
            arg3: ['boolean']
        });
        expect(dummyElementSyntax.name).toBe('dummy');
        expect(dummyElementSyntax.kind).toBe('Instruction');
        expect(dummyElementSyntax.type).toBe('Block');
        expect(dummyElementSyntax.argCount).toBe(3);
        expect(dummyElementSyntax.argLabels).toEqual(['arg1', 'arg2', 'arg3']);
        expect(dummyElementSyntax.argMap).toEqual({
            arg1: ['number'],
            arg2: ['string', 'number'],
            arg3: ['boolean']
        });
    });
});
