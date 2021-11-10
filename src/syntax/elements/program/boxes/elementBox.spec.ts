import { SymbolTable } from '../../../symbol-table/symbolTable';
import {
    ElementBoxBoolean,
    ElementBoxNumber,
    ElementBoxString,
    ElementBoxGeneric
} from './elementBox';

const symbolTable = new SymbolTable();

describe('Box Elements', () => {
    const elementBox = new ElementBoxGeneric();

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
            elementBoxBoolean = new ElementBoxBoolean();
            elementBoxBoolean.onVisit({ name: 'booleanBox', value: true }, symbolTable);
            expect(symbolTable.getGlobalVariable('booleanBox')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });
    });

    describe('class ElementBoxNumber', () => {
        let elementBoxNumber: ElementBoxNumber;

        test('execute with parameters and verify variable addition in symbol table', () => {
            elementBoxNumber = new ElementBoxNumber();
            elementBoxNumber.onVisit({ name: 'numberBox', value: 5 }, symbolTable);
            expect(symbolTable.getGlobalVariable('numberBox')).toEqual({
                dataType: 'number',
                value: 5
            });
        });
    });

    describe('class ElementBoxString', () => {
        let elementBoxString: ElementBoxString;

        test('execute with parameters and verify variable addition in symbol table', () => {
            elementBoxString = new ElementBoxString();
            elementBoxString.onVisit({ name: 'stringBox', value: 'foo' }, symbolTable);
            expect(symbolTable.getGlobalVariable('stringBox')).toEqual({
                dataType: 'string',
                value: 'foo'
            });
        });
    });

    describe('class ElementBoxGeneric', () => {
        test('execute with boolean value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric();
            elementBoxGeneric.onVisit({ name: 'genericBox', value: true }, symbolTable);
            expect(symbolTable.getGlobalVariable('genericBox')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });

        test('execute with number value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric();
            elementBoxGeneric.onVisit({ name: 'genericBox', value: 5 }, symbolTable);
            expect(symbolTable.getGlobalVariable('genericBox')).toEqual({
                dataType: 'number',
                value: 5
            });
        });

        test('execute with string value parameter and verify variable addition in symbol table', () => {
            const elementBoxGeneric = new ElementBoxGeneric();
            elementBoxGeneric.onVisit({ name: 'genericBox', value: 'foo' }, symbolTable);
            expect(symbolTable.getGlobalVariable('genericBox')).toEqual({
                dataType: 'string',
                value: 'foo'
            });
        });
    });
});
