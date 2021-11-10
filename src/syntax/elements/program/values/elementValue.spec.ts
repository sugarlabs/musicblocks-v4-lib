import { ElementValueBoolean, ElementValueNumber, ElementValueString } from './elementValue';

describe('class ElementValueBoolean', () => {
    let elementValueBoolean: ElementValueBoolean;

    test('instantiate element and verify initial value', () => {
        elementValueBoolean = new ElementValueBoolean();
        expect(elementValueBoolean.value).toBe(true);
    });

    test('update value and verify new value', () => {
        elementValueBoolean.update(false);
        expect(elementValueBoolean.value).toBe(false);
    });
});

describe('class ElementValueNumber', () => {
    let elementValueNumber: ElementValueNumber;

    test('instantiate element and verify initial value', () => {
        elementValueNumber = new ElementValueNumber();
        expect(elementValueNumber.value).toBe(0);
    });

    test('update value and verify new value', () => {
        elementValueNumber.update(5);
        expect(elementValueNumber.value).toBe(5);
    });
});

describe('class ElementValueString', () => {
    let elementValueString: ElementValueString;

    test('instantiate element and verify initial value', () => {
        elementValueString = new ElementValueString();
        expect(elementValueString.value).toBe('');
    });

    test('update value and verify new value', () => {
        elementValueString.update('foo');
        expect(elementValueString.value).toBe('foo');
    });
});
