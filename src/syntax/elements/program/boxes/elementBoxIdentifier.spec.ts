import {
    ElementBoxIdentifierGeneric,
    ElementBoxIdentifierBoolean,
    ElementBoxIdentifierNumber,
    ElementBoxIdentifierString
} from './elementBoxIdentifier';
import { SymbolTable } from '../../../symbol-table/symbolTable';

const symbolTable = new SymbolTable();

symbolTable.addGlobalVariable('myVar1', 'boolean', true);
symbolTable.addGlobalVariable('myVar2', 'number', 5);
symbolTable.addGlobalVariable('myVar3', 'string', 'foo');

describe('Box Identifier Elements', () => {
    describe('class ElementBoxIdentifierGeneric', () => {
        const elementBoxIdentifierGeneric = new ElementBoxIdentifierGeneric();

        test('update label to name with boolean variable in symbol table and verify evaluation', () => {
            elementBoxIdentifierGeneric.updateLabel('myVar1');
            elementBoxIdentifierGeneric.evaluate(symbolTable);
            expect(elementBoxIdentifierGeneric.value).toBe(true);
        });

        test('update label to name with number variable in symbol table and verify evaluation', () => {
            elementBoxIdentifierGeneric.updateLabel('myVar2');
            elementBoxIdentifierGeneric.evaluate(symbolTable);
            expect(elementBoxIdentifierGeneric.value).toBe(5);
        });

        test('update label to name with string variable in symbol table and verify evaluation', () => {
            elementBoxIdentifierGeneric.updateLabel('myVar3');
            elementBoxIdentifierGeneric.evaluate(symbolTable);
            expect(elementBoxIdentifierGeneric.value).toBe('foo');
        });

        test('update label to name with no variable in symbol table and expect error', () => {
            elementBoxIdentifierGeneric.updateLabel('myVar');
            expect(() => elementBoxIdentifierGeneric.evaluate(symbolTable)).toThrowError(
                'ItemNotFoundError: box "myVar" does not exist'
            );
        });
    });

    describe('class ElementBoxIdentifierBoolean', () => {
        const elementBoxIdentifierBoolean = new ElementBoxIdentifierBoolean();

        test('update label to name with boolean variable in symbol table and verify evaluation', () => {
            elementBoxIdentifierBoolean.updateLabel('myVar1');
            elementBoxIdentifierBoolean.evaluate(symbolTable);
            expect(elementBoxIdentifierBoolean.value).toBe(true);
        });

        test('update label to name with boolean variable not in symbol table and expect error', () => {
            elementBoxIdentifierBoolean.updateLabel('myVar2');
            expect(() => elementBoxIdentifierBoolean.evaluate(symbolTable)).toThrowError(
                'ItemNotFoundError: box "myVar2" of type "boolean" does not exist'
            );
        });
    });

    describe('class ElementBoxIdentifierNumber', () => {
        const elementBoxIdentifierNumber = new ElementBoxIdentifierNumber();

        test('update label to name with number variable in symbol table and verify evaluation', () => {
            elementBoxIdentifierNumber.updateLabel('myVar2');
            elementBoxIdentifierNumber.evaluate(symbolTable);
            expect(elementBoxIdentifierNumber.value).toBe(5);
        });

        test('update label to name with number variable not in symbol table and expect error', () => {
            elementBoxIdentifierNumber.updateLabel('myVar1');
            expect(() => elementBoxIdentifierNumber.evaluate(symbolTable)).toThrowError(
                'ItemNotFoundError: box "myVar1" of type "number" does not exist'
            );
        });
    });

    describe('class ElementBoxIdentifierString', () => {
        const elementBoxIdentifierString = new ElementBoxIdentifierString();

        test('update label to name with string variable in symbol table and verify evaluation', () => {
            elementBoxIdentifierString.updateLabel('myVar3');
            elementBoxIdentifierString.evaluate(symbolTable);
            expect(elementBoxIdentifierString.value).toBe('foo');
        });

        test('update label to name with string variable not in symbol table and expect error', () => {
            elementBoxIdentifierString.updateLabel('myVar1');
            expect(() => elementBoxIdentifierString.evaluate(symbolTable)).toThrowError(
                'ItemNotFoundError: box "myVar1" of type "string" does not exist'
            );
        });
    });
});
