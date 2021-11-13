import {
    TElementBlockName,
    TElementDataName,
    TElementExpressionName,
    TElementStatementName,
} from '@/@types/specification';
import specification from './specification';

import { TData } from '@/@types/data';
import { ElementData, ElementExpression } from './elements/core/elementArgument';
import { ElementStatement, ElementBlock } from './elements/core/elementInstruction';

// -------------------------------------------------------------------------------------------------

abstract class ElementDataCover extends ElementData<TData> {}
abstract class ElementExpressionCover extends ElementExpression<TData> {}

describe('Syntax Element Specification', () => {
    describe('data element', () => {
        const dataElementEntry = specification['value-boolean'];
        expect(dataElementEntry.label).toBe('true');

        test('fetch element and verify entry', () => {
            expect(dataElementEntry.type).toBe('Data');
            expect(dataElementEntry.category).toBe('value');
        });

        test('instantiate prototype fetch from entry query and verify instance', () => {
            const prototype = dataElementEntry.prototype as (
                name: TElementDataName,
                label: string
            ) => ElementDataCover;
            const elementInstance = prototype('value-boolean', dataElementEntry.label);
            expect(elementInstance.name).toBe('value-boolean');
            expect(elementInstance.kind).toBe('Argument');
            expect(elementInstance.type).toBe('Data');
        });
    });

    describe('expression element', () => {
        const dataElementEntry = specification['operator-math-plus'];

        test('fetch element and verify entry', () => {
            expect(dataElementEntry.label).toBe('+');
            expect(dataElementEntry.type).toBe('Expression');
            expect(dataElementEntry.category).toBe('operator-math');
        });

        test('instantiate prototype fetch from entry query and verify instance', () => {
            const prototype = dataElementEntry.prototype as (
                name: TElementExpressionName,
                label: string
            ) => ElementExpressionCover;
            const elementInstance = prototype('operator-math-plus', dataElementEntry.label);
            expect(elementInstance.name).toBe('operator-math-plus');
            expect(elementInstance.kind).toBe('Argument');
            expect(elementInstance.type).toBe('Expression');
        });
    });

    describe('statement element', () => {
        const dataElementEntry = specification['box-generic'];

        test('fetch element and verify entry', () => {
            expect(dataElementEntry.label).toBe('Box');
            expect(dataElementEntry.type).toBe('Statement');
            expect(dataElementEntry.category).toBe('box');
        });

        test('instantiate prototype fetch from entry query and verify instance', () => {
            const prototype = dataElementEntry.prototype as (
                name: TElementStatementName,
                label: string
            ) => ElementStatement;
            const elementInstance = prototype('box-generic', dataElementEntry.label);
            expect(elementInstance.name).toBe('box-generic');
            expect(elementInstance.kind).toBe('Instruction');
            expect(elementInstance.type).toBe('Statement');
        });
    });

    describe('block element', () => {
        const dataElementEntry = specification['block-dummy'];

        test('fetch element and verify entry', () => {
            expect(dataElementEntry.label).toBe('dummy');
            expect(dataElementEntry.type).toBe('Block');
            expect(dataElementEntry.category).toBe('block-dummy');
        });

        test('instantiate prototype fetch from entry query and verify instance', () => {
            const prototype = dataElementEntry.prototype as (
                name: TElementBlockName,
                label: string
            ) => ElementBlock;
            const elementInstance = prototype('block-dummy', dataElementEntry.label);
            expect(elementInstance.name).toBe('block-dummy');
            expect(elementInstance.kind).toBe('Instruction');
            expect(elementInstance.type).toBe('Block');
        });
    });
});
