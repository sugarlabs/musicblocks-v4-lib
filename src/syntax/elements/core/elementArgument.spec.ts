import { ElementArgument, ElementExpression, ElementData } from './elementArgument';

class DummyElementArgument<T> extends ElementArgument<T> {}

describe('class ElementArgument', () => {
    test('instantiate class of type number that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<number>(
            'dummy',
            'Data',
            {},
            ['number'],
            0
        );
        expect(dummyElementArgument.returnType).toEqual(['number']);
    });

    test('instantiate class of type string that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<string>(
            'dummy',
            'Data',
            {},
            ['string'],
            'foo'
        );
        expect(dummyElementArgument.returnType).toEqual(['string']);
    });

    test('instantiate class of type boolean that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<boolean>(
            'dummy',
            'Data',
            {},
            ['boolean'],
            true
        );
        expect(dummyElementArgument.returnType).toEqual(['boolean']);
    });

    test('instantiate class of type number or string that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<string | number>(
            'dummy',
            'Data',
            {},
            ['string', 'number'],
            0
        );
        expect(dummyElementArgument.returnType).toEqual(['string', 'number']);
    });
});

class DummyElementData<T> extends ElementData<T> {}

class DummyElementDataOverrideNumber extends ElementData<number> {
    public get value(): number {
        return this._value * 2;
    }
}

class DummyElementDataOverrideString extends ElementData<string> {
    public get value(): string {
        return `foo ${this._value} bar`;
    }
}

class DummyElementDataOverrideBoolean extends ElementData<boolean> {
    public get value(): boolean {
        return !this._value;
    }
}

describe('class ElementData', () => {
    describe('instantiation', () => {
        test('instantiate class of type number that extends ElementData and validate API', () => {
            const dummyElementDataNumber1 = new DummyElementData<number>(
                'dummy',
                {},
                ['number'],
                0
            );
            expect(dummyElementDataNumber1.value).toBe(0);
            const dummyElementDataNumber2 = new DummyElementData<number>(
                'dummy',
                {},
                ['number'],
                5
            );
            expect(dummyElementDataNumber2.value).toBe(5);
            const dummyElementDataNumber3 = new DummyElementData<number>(
                'dummy',
                {},
                ['number'],
                -5
            );
            expect(dummyElementDataNumber3.value).toBe(-5);
        });

        test('instantiate class of type string that extends ElementData and validate API', () => {
            const dummyElementDataString1 = new DummyElementData<string>(
                'dummy',
                {},
                ['string'],
                'foo'
            );
            expect(dummyElementDataString1.value).toBe('foo');
            const dummyElementDataString2 = new DummyElementData<string>(
                'dummy',
                {},
                ['string'],
                ''
            );
            expect(dummyElementDataString2.value).toBe('');
        });

        test('instantiate class of type boolean that extends ElementData and validate API', () => {
            const dummyElementDataBoolean1 = new DummyElementData<boolean>(
                'dummy',
                {},
                ['boolean'],
                true
            );
            expect(dummyElementDataBoolean1.value).toBe(true);
            const dummyElementDataBoolean2 = new DummyElementData<boolean>(
                'dummy',
                {},
                ['boolean'],
                false
            );
            expect(dummyElementDataBoolean2.value).toBe(false);
        });
    });

    describe('update', () => {
        test('update value in instance of class of type number that extends ElementData and validate', () => {
            const dummyElementDataNumber = new DummyElementData<number>('dummy', {}, ['number'], 0);
            expect(dummyElementDataNumber.value).toBe(0);
            dummyElementDataNumber.update(5);
            expect(dummyElementDataNumber.value).toBe(5);
            dummyElementDataNumber.update(-5);
            expect(dummyElementDataNumber.value).toBe(-5);
        });

        test('update value in instance of class of type string that extends ElementData and validate', () => {
            const dummyElementDataString = new DummyElementData<string>(
                'dummy',
                {},
                ['string'],
                ''
            );
            expect(dummyElementDataString.value).toBe('');
            dummyElementDataString.update('foo');
            expect(dummyElementDataString.value).toBe('foo');
        });

        test('update value in instance of class of type boolean that extends ElementData and validate', () => {
            const dummyElementDataBoolean = new DummyElementData<boolean>(
                'dummy',
                {},
                ['boolean'],
                true
            );
            expect(dummyElementDataBoolean.value).toBe(true);
            dummyElementDataBoolean.update(false);
            expect(dummyElementDataBoolean.value).toBe(false);
        });
    });

    describe('override', () => {
        test('override value in instance of class of type number that extends ElementData and validate', () => {
            const dummyElementDataBoolean = new DummyElementDataOverrideNumber(
                'dummy',
                {},
                ['number'],
                5
            );
            expect(dummyElementDataBoolean.value).toBe(10);
            dummyElementDataBoolean.update(-5);
            expect(dummyElementDataBoolean.value).toBe(-10);
        });

        test('override value in instance of class of type string that extends ElementData and validate', () => {
            const dummyElementDataBoolean = new DummyElementDataOverrideString(
                'dummy',
                {},
                ['string'],
                'foobar'
            );
            expect(dummyElementDataBoolean.value).toBe('foo foobar bar');
            dummyElementDataBoolean.update('');
            expect(dummyElementDataBoolean.value).toBe('foo  bar');
        });

        test('override value in instance of class of type boolean that extends ElementData and validate', () => {
            const dummyElementDataBoolean = new DummyElementDataOverrideBoolean(
                'dummy',
                {},
                ['boolean'],
                true
            );
            expect(dummyElementDataBoolean.value).toBe(false);
            dummyElementDataBoolean.update(false);
            expect(dummyElementDataBoolean.value).toBe(true);
        });
    });
});

class DummyElementExpressionNumber extends ElementExpression<number> {
    evaluate(params: { foo: string; bar: number }): void {
        this._value = params.foo.length * params.bar;
    }
}

class DummyElementExpressionString extends ElementExpression<string> {
    evaluate(params: { op1: string; op2: string }): void {
        this._value = params.op1 + params.op2;
    }
}

class DummyElementExpressionBoolean extends ElementExpression<boolean> {
    evaluate(params: { op1: boolean; op2: boolean }): void {
        const { op1, op2 } = params;
        this._value = (op1 && !op2) || (!op1 && op2);
    }
}

class DummyElementExpressionMixed extends ElementExpression<string | number> {
    evaluate(params: { op1: string; op2: number }): void {
        const { op1, op2 } = params;
        this._value = op1.length > op2 ? op1 : op2;
    }
}

describe('class ElementExpression', () => {
    test('evaluate and validate instance of class that inherits ElementExpression and returns number', () => {
        const dummyElementExpressionNumber = new DummyElementExpressionNumber(
            'dummy',
            {},
            ['number'],
            0
        );
        dummyElementExpressionNumber.evaluate({ foo: 'abc', bar: 5 });
        expect(dummyElementExpressionNumber.value).toBe(15);
    });

    test('evaluate and validate instance of class that inherits ElementExpression and returns string', () => {
        const dummyElementExpressionString = new DummyElementExpressionString(
            'dummy',
            {},
            ['string'],
            ''
        );
        dummyElementExpressionString.evaluate({ op1: 'foo', op2: 'bar' });
        expect(dummyElementExpressionString.value).toBe('foobar');
    });

    test('evaluate and validate instance of class that inherits ElementExpression and returns boolean', () => {
        const dummyElementExpressionNumberBoolean = new DummyElementExpressionBoolean(
            'dummy',
            {},
            ['boolean'],
            true
        );
        dummyElementExpressionNumberBoolean.evaluate({ op1: true, op2: false });
        expect(dummyElementExpressionNumberBoolean.value).toBe(true);
    });

    test('evaluate and validate instance of class that inherits ElementExpression and returns string or number', () => {
        const dummyElementExpressionNumberMixed1 = new DummyElementExpressionMixed(
            'dummy',
            {},
            ['string', 'number'],
            0
        );
        dummyElementExpressionNumberMixed1.evaluate({ op1: 'foobar', op2: 5 });
        expect(dummyElementExpressionNumberMixed1.value).toBe('foobar');
        const dummyElementExpressionNumberMixed2 = new DummyElementExpressionMixed(
            'dummy',
            {},
            ['string', 'number'],
            0
        );
        dummyElementExpressionNumberMixed2.evaluate({ op1: 'foo', op2: 5 });
        expect(dummyElementExpressionNumberMixed2.value).toBe(5);
    });
});
