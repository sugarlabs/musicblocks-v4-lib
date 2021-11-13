import { ElementValueBoolean, ElementValueNumber, ElementValueString } from './elementValue';

describe('class ElementValueBoolean', () => {
    let elementValueBoolean: ElementValueBoolean;

    test('instantiate element and verify initial value', () => {
        elementValueBoolean = new ElementValueBoolean('value-boolean', 'true');
        expect(elementValueBoolean.value).toBe(true);
        expect(elementValueBoolean.label).toBe('true');
    });

    test('update label and verify new value', () => {
        elementValueBoolean.updateLabel('false');
        elementValueBoolean.evaluate();
        expect(elementValueBoolean.value).toBe(false);
    });
});

describe('class ElementValueNumber', () => {
    let elementValueNumber: ElementValueNumber;

    test('instantiate element and verify initial value', () => {
        elementValueNumber = new ElementValueNumber('value-number', '0');
        expect(elementValueNumber.value).toBe(0);
        expect(elementValueNumber.label).toBe('0');
    });

    test('update label and verify new value', () => {
        elementValueNumber.updateLabel('5');
        elementValueNumber.evaluate();
        expect(elementValueNumber.value).toBe(5);
    });
});

describe('class ElementValueString', () => {
    let elementValueString: ElementValueString;

    test('instantiate element and verify initial value', () => {
        elementValueString = new ElementValueString('value-string', 'foobar');
        expect(elementValueString.value).toBe('');
        expect(elementValueString.label).toBe('foobar');
    });

    test('update label and verify new value', () => {
        elementValueString.updateLabel('foo');
        elementValueString.evaluate();
        expect(elementValueString.value).toBe('foo');
    });
});
