import {
    ElementBoxBoolean,
    ElementBoxNumber,
    ElementBoxString,
    ElementBoxGeneric
} from './elementBox';
import { getGlobalVariable } from '../../../symbol-table/symbolTable';

describe('Box Elements', () => {
    const elementBox = new ElementBoxGeneric('box-generic');

    test('instantiate and verify instance variables', () => {
        expect(elementBox.name).toBe('box-generic');
        expect(elementBox.kind).toBe('Instruction');
        expect(elementBox.type).toBe('Statement');
        expect(elementBox.argCount).toBe(2);
        expect(elementBox.argLabels).toEqual(['name', 'value']);
    });

    describe('class ElementBoxBoolean', () => {
        let elementBoxBoolean: ElementBoxBoolean;

        test('execute with parameters and verify variable addition in symbol table', () => {
            elementBoxBoolean = new ElementBoxBoolean('box-boolean');
            elementBoxBoolean.onVisit({ name: 'booleanBox', value: true });
            expect(getGlobalVariable('booleanBox')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });
    });

    describe('class ElementBoxNumber', () => {
        let elementBoxNumber: ElementBoxNumber;

        test('execute with parameters and verify variable addition in symbol table', () => {
            elementBoxNumber = new ElementBoxNumber('box-number');
            elementBoxNumber.onVisit({ name: 'numberBox', value: 5 });
            expect(getGlobalVariable('numberBox')).toEqual({
                dataType: 'number',
                value: 5
            });
        });
    });

    describe('class ElementBoxString', () => {
        let elementBoxString: ElementBoxString;

        test('execute with parameters and verify variable addition in symbol table', () => {
            elementBoxString = new ElementBoxString('box-string');
            elementBoxString.onVisit({ name: 'stringBox', value: 'foo' });
            expect(getGlobalVariable('stringBox')).toEqual({
                dataType: 'string',
                value: 'foo'
            });
        });
    });

    describe('class ElementBoxGeneric', () => {
        test('execute with boolean value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric('box-generic');
            elementBoxGeneric.onVisit({ name: 'genericBox', value: true });
            expect(getGlobalVariable('genericBox')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });

        test('execute with number value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric('box-generic');
            elementBoxGeneric.onVisit({ name: 'genericBox', value: 5 });
            expect(getGlobalVariable('genericBox')).toEqual({
                dataType: 'number',
                value: 5
            });
        });

        test('execute with string value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric('box-generic');
            elementBoxGeneric.onVisit({ name: 'genericBox', value: 'foo' });
            expect(getGlobalVariable('genericBox')).toEqual({
                dataType: 'string',
                value: 'foo'
            });
        });
    });
});
