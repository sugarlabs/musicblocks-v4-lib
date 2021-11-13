import { ElementBlock } from './elements/elementInstruction';
import { ElementBoxBoolean } from './elements/boxes/elementBox';
import { ElementOperatorMathPlus } from './elements/operators/elementOperatorMath';
import { ElementValueBoolean } from './elements/values/elementValue';
import {
    addInstance,
    getInstance,
    removeInstance,
    getNameCount,
    getNameCountAll,
    getKindCount,
    getKindCountAll,
    getTypeCount,
    getTypeCountAll,
    getCategoryCount,
    getCategoryCountAll,
    resetWarehouse,
} from './warehouse';

// -------------------------------------------------------------------------------------------------

describe('Syntax Element Warehouse', () => {
    let instanceID1: string;
    let instanceID2: string;
    let instanceID3: string;
    let instanceID4: string;

    describe('adding instance', () => {
        test('add an instance of a data element', () => {
            instanceID1 = addInstance('value-boolean');
            expect(typeof instanceID1).toBe('string');
        });

        test('add an instance of an expression element', () => {
            instanceID2 = addInstance('operator-math-plus');
            expect(typeof instanceID2).toBe('string');
        });

        test('add an instance of a statement element', () => {
            instanceID3 = addInstance('box-boolean');
            expect(typeof instanceID3).toBe('string');
        });

        test('add an instance of a block element', () => {
            instanceID4 = addInstance('block-dummy');
            expect(typeof instanceID4).toBe('string');
        });
    });

    describe('fetching instance', () => {
        test('fetch instance with invalid instance ID and expect null', () => {
            expect(getInstance(instanceID1 + '00')).toBe(null);
        });

        test('fetch instance of a data element with valid instance ID and verify', () => {
            const { name, kind, type, category, instance } = getInstance(instanceID1)!;
            expect(name).toBe('value-boolean');
            expect(kind).toBe('Argument');
            expect(type).toBe('Data');
            expect(category).toBe('value');
            expect(instance instanceof ElementValueBoolean);
        });

        test('fetch instance of an expression element with valid instance ID and verify', () => {
            const { name, kind, type, category, instance } = getInstance(instanceID2)!;
            expect(name).toBe('operator-math-plus');
            expect(kind).toBe('Argument');
            expect(type).toBe('Expression');
            expect(category).toBe('operator-math');
            expect(instance instanceof ElementOperatorMathPlus);
        });

        test('fetch instance of a statement element with valid instance ID and verify', () => {
            const { name, kind, type, category, instance } = getInstance(instanceID3)!;
            expect(name).toBe('box-boolean');
            expect(kind).toBe('Instruction');
            expect(type).toBe('Statement');
            expect(category).toBe('box');
            expect(instance instanceof ElementBoxBoolean);
        });

        test('fetch instance of a block element with valid instance ID and verify', () => {
            const { name, kind, type, category, instance } = getInstance(instanceID4)!;
            expect(name).toBe('block-dummy');
            expect(kind).toBe('Instruction');
            expect(type).toBe('Block');
            expect(category).toBe('block-dummy');
            expect(instance instanceof ElementBlock);
        });
    });

    describe('get stats', () => {
        addInstance('value-boolean');
        addInstance('boxidentifier-boolean');
        addInstance('operator-math-divide');
        addInstance('box-number');

        test('verify name count', () => {
            expect(getNameCount('value-boolean')).toBe(2);
            expect(getNameCount('value-number')).toBe(0);
        });

        test('verify kind count', () => {
            expect(getKindCount('Argument')).toBe(5);
            expect(getKindCount('Instruction')).toBe(3);
        });

        test('verify kind count all', () => {
            expect(new Set(Object.entries(getKindCountAll()))).toEqual(
                new Set([
                    ['Argument', 5],
                    ['Instruction', 3],
                ])
            );
        });

        test('verify type count', () => {
            expect(getTypeCount('Data')).toBe(3);
            expect(getTypeCount('Expression')).toBe(2);
            expect(getTypeCount('Statement')).toBe(2);
            expect(getTypeCount('Block')).toBe(1);
        });

        test('verify type count all', () => {
            expect(new Set(Object.entries(getTypeCountAll()))).toEqual(
                new Set([
                    ['Data', 3],
                    ['Expression', 2],
                    ['Statement', 2],
                    ['Block', 1],
                ])
            );
        });

        test('verify category count', () => {
            expect(getCategoryCount('value')).toBe(2);
            expect(getCategoryCount('boxidentifier')).toBe(1);
            expect(getCategoryCount('operator-math')).toBe(2);
            expect(getCategoryCount('box')).toBe(2);
            expect(getCategoryCount('block-dummy')).toBe(1);
        });

        test('verify category count all', () => {
            expect(new Set(Object.entries(getCategoryCountAll()))).toEqual(
                new Set([
                    ['value', 2],
                    ['boxidentifier', 1],
                    ['operator-math', 2],
                    ['box', 2],
                    ['block-dummy', 1],
                ])
            );
        });
    });

    describe('removing instance', () => {
        test('remove an existing instance ID and verify', () => {
            removeInstance(instanceID1);
            expect(getInstance(instanceID1)).toBe(null);
            expect(getNameCount('value-boolean')).toBe(1);
            expect(getKindCount('Argument')).toBe(4);
            expect(getKindCount('Instruction')).toBe(3);
            expect(getTypeCount('Data')).toBe(2);
            expect(getTypeCount('Expression')).toBe(2);
            expect(getTypeCount('Statement')).toBe(2);
            expect(getTypeCount('Block')).toBe(1);
            expect(getCategoryCount('value')).toBe(1);
            expect(getCategoryCount('boxidentifier')).toBe(1);
            expect(getCategoryCount('operator-math')).toBe(2);
            expect(getCategoryCount('box')).toBe(2);
            expect(getCategoryCount('block-dummy')).toBe(1);
        });
    });

    describe('reset', () => {
        function _checkEmpty(table: { [key: string]: number }): boolean {
            return Object.values(table).reduce((a, b) => a + b) === 0;
        }

        test('reset warehouse and verify from stats', () => {
            resetWarehouse();
            expect(_checkEmpty(getNameCountAll())).toBe(true);
            expect(_checkEmpty(getKindCountAll())).toBe(true);
            expect(_checkEmpty(getTypeCountAll())).toBe(true);
            expect(_checkEmpty(getCategoryCountAll())).toBe(true);
        });
    });
});
