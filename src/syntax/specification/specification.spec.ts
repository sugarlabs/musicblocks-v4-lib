import {
    registerElementSpecificationEntry,
    registerElementSpecificationEntries,
    queryElementSpecification,
    removeElementSpecificationEntry,
    removeElementSpecificationEntries,
    resetElementSpecificationTable,
    getSpecificationSnapshot,
} from './specification';

import elementSpecificationEntries from '../../library/specification';

import { IElementSpecificationData } from '../../@types/specification';
import { TData } from '../../@types/data';
import { ElementData, ElementExpression } from '../elements/elementArgument';
import { ElementStatement, ElementBlock } from '../elements/elementInstruction';

// -------------------------------------------------------------------------------------------------

abstract class ElementDataCover extends ElementData<TData> {}
abstract class ElementExpressionCover extends ElementExpression<TData> {}

registerElementSpecificationEntries(elementSpecificationEntries);

describe('Syntax Element Specification', () => {
    describe('element specifications', () => {
        describe('data element', () => {
            const dataElementEntry = queryElementSpecification('value-boolean')!;
            expect(dataElementEntry.label).toBe('true');

            test('fetch element and verify entry', () => {
                expect(dataElementEntry.type).toBe('Data');
                expect(dataElementEntry.category).toBe('value');
            });

            test('instantiate prototype fetch from entry query and verify instance', () => {
                const prototype = dataElementEntry.prototype as (
                    name: string,
                    label: string
                ) => ElementDataCover;
                const elementInstance = prototype('value-boolean', dataElementEntry.label);
                expect(elementInstance.name).toBe('value-boolean');
                expect(elementInstance.kind).toBe('Argument');
                expect(elementInstance.type).toBe('Data');
            });
        });

        describe('expression element', () => {
            const dataElementEntry = queryElementSpecification('operator-math-plus')!;

            test('fetch element and verify entry', () => {
                expect(dataElementEntry.label).toBe('+');
                expect(dataElementEntry.type).toBe('Expression');
                expect(dataElementEntry.category).toBe('operator-math');
            });

            test('instantiate prototype fetch from entry query and verify instance', () => {
                const prototype = dataElementEntry.prototype as (
                    name: string,
                    label: string
                ) => ElementExpressionCover;
                const elementInstance = prototype('operator-math-plus', dataElementEntry.label);
                expect(elementInstance.name).toBe('operator-math-plus');
                expect(elementInstance.kind).toBe('Argument');
                expect(elementInstance.type).toBe('Expression');
            });
        });

        describe('statement element', () => {
            const dataElementEntry = queryElementSpecification('box-generic')!;

            test('fetch element and verify entry', () => {
                expect(dataElementEntry.label).toBe('Box');
                expect(dataElementEntry.type).toBe('Statement');
                expect(dataElementEntry.category).toBe('box');
            });

            test('instantiate prototype fetch from entry query and verify instance', () => {
                const prototype = dataElementEntry.prototype as (
                    name: string,
                    label: string
                ) => ElementStatement;
                const elementInstance = prototype('box-generic', dataElementEntry.label);
                expect(elementInstance.name).toBe('box-generic');
                expect(elementInstance.kind).toBe('Instruction');
                expect(elementInstance.type).toBe('Statement');
            });
        });

        describe('block element', () => {
            const dataElementEntry = queryElementSpecification('process')!;

            test('fetch element and verify entry', () => {
                expect(dataElementEntry.label).toBe('start');
                expect(dataElementEntry.type).toBe('Block');
                expect(dataElementEntry.category).toBe('program');
            });

            test('instantiate prototype fetch from entry query and verify instance', () => {
                const prototype = dataElementEntry.prototype as (
                    name: string,
                    label: string
                ) => ElementBlock;
                const elementInstance = prototype('process', dataElementEntry.label);
                expect(elementInstance.name).toBe('process');
                expect(elementInstance.kind).toBe('Instruction');
                expect(elementInstance.type).toBe('Block');
            });
        });
    });

    describe('functions', () => {
        class DummyElementData extends ElementData<TData> {
            constructor(name: string, label: string) {
                super(name, label, {}, ['number'], 0);
            }
            public evaluate(): void {
                1;
            }
        }

        class DummyElementExpression extends ElementExpression<TData> {
            constructor(name: string, label: string) {
                super(name, label, {}, ['number'], 0);
            }
            public evaluate(): void {
                1;
            }
        }

        class DummyElementStatement extends ElementStatement {
            constructor(name: string, label: string) {
                super(name, label, {});
            }
            public onVisit(): void {
                1;
            }
        }

        class DummyElementBlock extends ElementBlock {
            constructor(name: string, label: string) {
                super(name, label, {});
            }
            public onVisit(): void {
                1;
            }
            public onInnerVisit(): void {
                1;
            }
            public onInnerExit(): void {
                1;
            }
            public onExit(): void {
                1;
            }
        }

        test('register new element specification entry and verify', () => {
            const status = registerElementSpecificationEntry('dummy0', {
                label: 'dummy0',
                type: 'Data',
                category: 'dummy',
                prototype: DummyElementData,
                values: { types: ['boolean'] },
            });
            expect(status).toBe(true);

            const elementEntry = queryElementSpecification('dummy0')!;
            expect(elementEntry.label).toBe('dummy0');
            expect(elementEntry.type).toBe('Data');
            expect(elementEntry.category).toBe('dummy');
            expect(
                (elementEntry.prototype as (name: string, label: string) => ElementDataCover)(
                    'dummy0',
                    'dummy0'
                ) instanceof DummyElementData
            ).toBe(true);
            expect('values' in elementEntry).toBe(true);
            expect((elementEntry as IElementSpecificationData).values).toEqual({
                types: ['boolean'],
            });
        });

        test('register duplicate element specification entry and verify', () => {
            const status = registerElementSpecificationEntry('dummy0', {
                label: 'dummy0',
                type: 'Block',
                category: 'dummy',
                prototype: DummyElementBlock,
            });
            expect(status).toBe(false);
        });

        test('register new element specification entries and verify', () => {
            const status = registerElementSpecificationEntries({
                dummy1: {
                    label: 'dummy1',
                    type: 'Data',
                    category: 'dummy',
                    prototype: DummyElementData,
                    values: ['1', '2', '3'],
                },
                dummy2: {
                    label: 'dummy2',
                    type: 'Expression',
                    category: 'dummy',
                    prototype: DummyElementExpression,
                },
                dummy3: {
                    label: 'dummy3',
                    type: 'Statement',
                    category: 'dummy',
                    prototype: DummyElementStatement,
                },
                dummy4: {
                    label: 'dummy4',
                    type: 'Block',
                    category: 'dummy',
                    prototype: DummyElementBlock,
                },
            });
            expect(status).toEqual([true, true, true, true]);

            const elementEntry1 = queryElementSpecification('dummy1')!;
            const elementEntry2 = queryElementSpecification('dummy2')!;
            const elementEntry3 = queryElementSpecification('dummy3')!;
            const elementEntry4 = queryElementSpecification('dummy4')!;

            expect(elementEntry1.label).toBe('dummy1');
            expect(elementEntry1.type).toBe('Data');
            expect(elementEntry1.category).toBe('dummy');
            expect(
                (elementEntry1.prototype as (name: string, label: string) => ElementDataCover)(
                    'dummy1',
                    'dummy1'
                ) instanceof DummyElementData
            ).toBe(true);
            expect('values' in elementEntry1).toBe(true);
            expect((elementEntry1 as IElementSpecificationData).values).toEqual(['1', '2', '3']);

            expect(elementEntry2.label).toBe('dummy2');
            expect(elementEntry2.type).toBe('Expression');
            expect(elementEntry2.category).toBe('dummy');
            expect(
                (
                    elementEntry2.prototype as (
                        name: string,
                        label: string
                    ) => ElementExpressionCover
                )('dummy2', 'dummy2') instanceof DummyElementExpression
            ).toBe(true);

            expect(elementEntry3.label).toBe('dummy3');
            expect(elementEntry3.type).toBe('Statement');
            expect(elementEntry3.category).toBe('dummy');
            expect(
                (elementEntry3.prototype as (name: string, label: string) => ElementStatement)(
                    'dummy3',
                    'dummy3'
                ) instanceof DummyElementStatement
            ).toBe(true);

            expect(elementEntry4.label).toBe('dummy4');
            expect(elementEntry4.type).toBe('Block');
            expect(elementEntry4.category).toBe('dummy');
            expect(
                (elementEntry4.prototype as (name: string, label: string) => ElementBlock)(
                    'dummy4',
                    'dummy4'
                ) instanceof DummyElementBlock
            ).toBe(true);
        });

        test('register duplicate element specification entries and verify', () => {
            const status = registerElementSpecificationEntries({
                dummy1: {
                    label: 'dummy1',
                    type: 'Data',
                    category: 'dummy',
                    prototype: DummyElementData,
                },
                dummy2: {
                    label: 'dummy2',
                    type: 'Expression',
                    category: 'dummy',
                    prototype: DummyElementExpression,
                },
                dummy3: {
                    label: 'dummy3',
                    type: 'Statement',
                    category: 'dummy',
                    prototype: DummyElementStatement,
                },
                dummy4: {
                    label: 'dummy4',
                    type: 'Block',
                    category: 'dummy',
                    prototype: DummyElementBlock,
                },
            });
            expect(status).toEqual([false, false, false, false]);
        });

        test('remove valid element specification entry and verify', () => {
            const removeStatus = removeElementSpecificationEntry('dummy0');
            const elementEntry = queryElementSpecification('dummy0')!;

            expect(removeStatus).toBe(true);
            expect(elementEntry).toBe(null);
        });

        test('remove invalid element specification entry and verify', () => {
            const removeStatus = removeElementSpecificationEntry('dummy0');
            const elementEntry = queryElementSpecification('dummy0')!;

            expect(removeStatus).toBe(false);
            expect(elementEntry).toBe(null);
        });

        test('remove valid element specification entries and verify', () => {
            const removeStatus = removeElementSpecificationEntries([
                'dummy1',
                'dummy2',
                'dummy3',
                'dummy4',
            ]);
            expect(removeStatus).toEqual([true, true, true, true]);
            expect(queryElementSpecification('dummy1')!).toBe(null);
            expect(queryElementSpecification('dummy2')!).toBe(null);
            expect(queryElementSpecification('dummy3')!).toBe(null);
            expect(queryElementSpecification('dummy4')!).toBe(null);
        });

        test('remove invalid element specification entries and verify', () => {
            const removeStatus = removeElementSpecificationEntries([
                'dummy1',
                'dummy2',
                'dummy3',
                'dummy4',
            ]);
            expect(removeStatus).toEqual([false, false, false, false]);
            expect(queryElementSpecification('dummy1')!).toBe(null);
            expect(queryElementSpecification('dummy2')!).toBe(null);
            expect(queryElementSpecification('dummy3')!).toBe(null);
            expect(queryElementSpecification('dummy4')!).toBe(null);
        });

        test('reset element specification table and verify', () => {
            resetElementSpecificationTable();
            expect(queryElementSpecification('dummy3')!).toBe(null);
            expect(queryElementSpecification('dummy4')!).toBe(null);
        });

        test('generate snapshot and verify', () => {
            registerElementSpecificationEntries(elementSpecificationEntries);
            expect(
                Object.entries(getSpecificationSnapshot()).map(([key, value]) => [
                    key,
                    value.prototypeName,
                ])
            ).toEqual([
                ['value-boolean', 'ElementValueBoolean'],
                ['value-number', 'ElementValueNumber'],
                ['value-string', 'ElementValueString'],
                ['box-generic', 'ElementBoxGeneric'],
                ['box-boolean', 'ElementBoxBoolean'],
                ['box-number', 'ElementBoxNumber'],
                ['box-string', 'ElementBoxString'],
                ['boxidentifier-generic', 'ElementBoxIdentifierGeneric'],
                ['boxidentifier-boolean', 'ElementBoxIdentifierBoolean'],
                ['boxidentifier-number', 'ElementBoxIdentifierNumber'],
                ['boxidentifier-string', 'ElementBoxIdentifierString'],
                ['operator-math-plus', 'ElementOperatorMathPlus'],
                ['operator-math-minus', 'ElementOperatorMathMinus'],
                ['operator-math-times', 'ElementOperatorMathTimes'],
                ['operator-math-divide', 'ElementOperatorMathDivide'],
                ['operator-math-modulus', 'ElementOperatorMathModulus'],
                ['repeat', 'ElementRepeat'],
                ['if', 'ElementIf'],
                ['process', 'ElementProcess'],
                ['routine', 'ElementRoutine'],
                ['print', 'ElementPrint'],
            ]);

            resetElementSpecificationTable();
            expect(getSpecificationSnapshot()).toEqual({});

            registerElementSpecificationEntry('mydummy', {
                label: 'dummy',
                type: 'Data',
                category: 'dummy',
                prototype: DummyElementData,
                values: ['1', '2', '3'],
            });
            expect(getSpecificationSnapshot()['mydummy'].values).toEqual(['1', '2', '3']);
        });
    });
});
