import {
    TElementNameData,
    TElementNameExpression,
    TElementNameStatement,
    TElementNameBlock,
    TElementName,
} from '@/@types/specification';
import {
    registerElementSpecificationEntry,
    registerElementSpecificationEntries,
    queryElementSpecification,
    removeElementSpecificationEntry,
    removeElementSpecificationEntries,
    resetElementSpecificationTable,
} from './specification';

import { TData } from '@/@types/data';
import { ElementData, ElementExpression } from '../elements/core/elementArgument';
import { ElementStatement, ElementBlock } from '../elements/core/elementInstruction';

// -------------------------------------------------------------------------------------------------

abstract class ElementDataCover extends ElementData<TData> {}
abstract class ElementExpressionCover extends ElementExpression<TData> {}

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
                    name: TElementNameData,
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
                    name: TElementNameExpression,
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
                    name: TElementNameStatement,
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
                    name: TElementNameBlock,
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
            constructor(name: TElementName, label: string) {
                super(name, label, {}, ['number'], 0);
            }
            public evaluate(): void {
                1;
            }
        }

        class DummyElementExpression extends ElementExpression<TData> {
            constructor(name: TElementName, label: string) {
                super(name, label, {}, ['number'], 0);
            }
            public evaluate(): void {
                1;
            }
        }

        class DummyElementStatement extends ElementStatement {
            constructor(name: TElementName, label: string) {
                super(name, label, {});
            }
            public onVisit(): void {
                1;
            }
        }

        class DummyElementBlock extends ElementBlock {
            constructor(name: TElementName, label: string) {
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

        test('register element specification entry and verify', () => {
            registerElementSpecificationEntry('dummy0', {
                label: 'dummy0',
                type: 'Block',
                category: 'dummy',
                prototype: DummyElementBlock,
            });
            const elementEntry = queryElementSpecification('dummy0' as TElementName)!;
            expect(elementEntry.label).toBe('dummy0');
            expect(elementEntry.type).toBe('Block');
            expect(elementEntry.category).toBe('dummy');
            expect(
                (
                    elementEntry.prototype as (
                        name: TElementNameBlock,
                        label: string
                    ) => ElementBlock
                )('dummy0' as TElementNameBlock, 'dummy0') instanceof DummyElementBlock
            ).toBe(true);
        });

        test('register element specification entries and verify', () => {
            registerElementSpecificationEntries({
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

            const elementEntry1 = queryElementSpecification('dummy1' as TElementName)!;
            const elementEntry2 = queryElementSpecification('dummy2' as TElementName)!;
            const elementEntry3 = queryElementSpecification('dummy3' as TElementName)!;
            const elementEntry4 = queryElementSpecification('dummy4' as TElementName)!;

            expect(elementEntry1.label).toBe('dummy1');
            expect(elementEntry1.type).toBe('Data');
            expect(elementEntry1.category).toBe('dummy');
            expect(
                (
                    elementEntry1.prototype as (
                        name: TElementNameData,
                        label: string
                    ) => ElementDataCover
                )('dummy1' as TElementNameData, 'dummy1') instanceof DummyElementData
            ).toBe(true);

            expect(elementEntry2.label).toBe('dummy2');
            expect(elementEntry2.type).toBe('Expression');
            expect(elementEntry2.category).toBe('dummy');
            expect(
                (
                    elementEntry2.prototype as (
                        name: TElementNameExpression,
                        label: string
                    ) => ElementExpressionCover
                )('dummy2' as TElementNameExpression, 'dummy2') instanceof DummyElementExpression
            ).toBe(true);

            expect(elementEntry3.label).toBe('dummy3');
            expect(elementEntry3.type).toBe('Statement');
            expect(elementEntry3.category).toBe('dummy');
            expect(
                (
                    elementEntry3.prototype as (
                        name: TElementNameStatement,
                        label: string
                    ) => ElementStatement
                )('dummy3' as TElementNameStatement, 'dummy3') instanceof DummyElementStatement
            ).toBe(true);

            expect(elementEntry4.label).toBe('dummy4');
            expect(elementEntry4.type).toBe('Block');
            expect(elementEntry4.category).toBe('dummy');
            expect(
                (
                    elementEntry4.prototype as (
                        name: TElementNameBlock,
                        label: string
                    ) => ElementBlock
                )('dummy4' as TElementNameBlock, 'dummy4') instanceof DummyElementBlock
            ).toBe(true);
        });

        test('remove element specification entry and verify', () => {
            removeElementSpecificationEntry('dummy0' as TElementName);
            const elementEntry = queryElementSpecification('dummy0' as TElementName)!;
            expect(elementEntry).toBe(null);
        });

        test('remove element specification entries and verify', () => {
            removeElementSpecificationEntries(['dummy1' as TElementName, 'dummy2' as TElementName]);
            expect(queryElementSpecification('dummy1' as TElementName)!).toBe(null);
            expect(queryElementSpecification('dummy2' as TElementName)!).toBe(null);
            expect(queryElementSpecification('dummy3' as TElementName)!).not.toBe(null);
            expect(queryElementSpecification('dummy4' as TElementName)!).not.toBe(null);
        });

        test('reset element specification table and verify', () => {
            resetElementSpecificationTable();
            expect(queryElementSpecification('dummy3' as TElementName)!).toBe(null);
            expect(queryElementSpecification('dummy4' as TElementName)!).toBe(null);
            expect(queryElementSpecification('value-boolean')).not.toBe(null);
        });
    });
});
