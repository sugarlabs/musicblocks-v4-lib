import {
    ElementBoxBoolean,
    ElementBoxNumber,
    ElementBoxString,
    ElementBoxGeneric,
} from './elementBox';
import { getGlobalVariable } from '../../execution/symbolTable';

// -------------------------------------------------------------------------------------------------

describe('Box Elements', () => {
    test('instantiate and verify instance variables', () => {
        const elementBox = new ElementBoxGeneric('box-generic', 'Box');
        expect(elementBox.name).toBe('box-generic');
        expect(elementBox.label).toBe('Box');
        expect(elementBox.kind).toBe('Instruction');
        expect(elementBox.type).toBe('Statement');
        expect(elementBox.argCount).toBe(2);
        expect(elementBox.argLabels).toEqual(['name', 'value']);
    });

    describe('class ElementBoxBoolean', () => {
        test('execute with parameters and verify variable addition in symbol table', () => {
            const elementBoxBoolean = new ElementBoxBoolean('box-boolean', 'Box (boolean)');
            expect(elementBoxBoolean.label).toBe('Box (boolean)');
            elementBoxBoolean.onVisit({ name: 'booleanBox', value: true });
            expect(getGlobalVariable('booleanBox')).toEqual({
                dataType: 'boolean',
                value: true,
            });
        });
    });

    describe('class ElementBoxNumber', () => {
        test('execute with parameters and verify variable addition in symbol table', () => {
            const elementBoxNumber = new ElementBoxNumber('box-number', 'Box (number)');
            expect(elementBoxNumber.label).toBe('Box (number)');
            elementBoxNumber.onVisit({ name: 'numberBox', value: 5 });
            expect(getGlobalVariable('numberBox')).toEqual({
                dataType: 'number',
                value: 5,
            });
        });
    });

    describe('class ElementBoxString', () => {
        test('execute with parameters and verify variable addition in symbol table', () => {
            const elementBoxString = new ElementBoxString('box-string', 'Box (string)');
            expect(elementBoxString.label).toBe('Box (string)');
            elementBoxString.onVisit({ name: 'stringBox', value: 'foo' });
            expect(getGlobalVariable('stringBox')).toEqual({
                dataType: 'string',
                value: 'foo',
            });
        });
    });

    describe('class ElementBoxGeneric', () => {
        test('execute with boolean value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric('box-generic', 'Box');
            elementBoxGeneric.onVisit({ name: 'genericBox', value: true });
            expect(getGlobalVariable('genericBox')).toEqual({
                dataType: 'boolean',
                value: true,
            });
        });

        test('execute with number value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric('box-generic', 'Box');
            elementBoxGeneric.onVisit({ name: 'genericBox', value: 5 });
            expect(getGlobalVariable('genericBox')).toEqual({
                dataType: 'number',
                value: 5,
            });
        });

        test('execute with string value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric('box-generic', 'Box');
            elementBoxGeneric.onVisit({ name: 'genericBox', value: 'foo' });
            expect(getGlobalVariable('genericBox')).toEqual({
                dataType: 'string',
                value: 'foo',
            });
        });
    });
});
