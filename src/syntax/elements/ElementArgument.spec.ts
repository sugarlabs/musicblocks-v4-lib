import { ElementArgument, ElementExpression, ElementValue } from './ElementArgument';

class DummyElementArgument<T> extends ElementArgument<T> {}

describe('class ElementArgument', () => {
    test('instantiate class of type number that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<number>(
            'dummy',
            'Value',
            {},
            ['number'],
            0
        );
        expect(dummyElementArgument.returnType).toEqual(['number']);
    });

    test('instantiate class of type string that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<string>(
            'dummy',
            'Value',
            {},
            ['string'],
            'foo'
        );
        expect(dummyElementArgument.returnType).toEqual(['string']);
    });

    test('instantiate class of type boolean that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<boolean>(
            'dummy',
            'Value',
            {},
            ['boolean'],
            true
        );
        expect(dummyElementArgument.returnType).toEqual(['boolean']);
    });

    test('instantiate class of type number or string that extends ElementArgument and validate returnType', () => {
        const dummyElementArgument = new DummyElementArgument<string | number>(
            'dummy',
            'Value',
            {},
            ['string', 'number'],
            0
        );
        expect(dummyElementArgument.returnType).toEqual(['string', 'number']);
    });
});

class DummyElementValue<T> extends ElementValue<T> {}

class DummyElementValueOverrideNumber extends ElementValue<number> {
    public get value(): number {
        return this._value * 2;
    }
}

class DummyElementValueOverrideString extends ElementValue<string> {
    public get value(): string {
        return `foo ${this._value} bar`;
    }
}

class DummyElementValueOverrideBoolean extends ElementValue<boolean> {
    public get value(): boolean {
        return !this._value;
    }
}

describe('class ElementValue', () => {
    describe('instantiation', () => {
        test('instantiate class of type number that extends ElementValue and validate API', () => {
            const dummyElementValueNumber1 = new DummyElementValue<number>(
                'dummy',
                {},
                ['number'],
                0
            );
            expect(dummyElementValueNumber1.value).toBe(0);
            const dummyElementValueNumber2 = new DummyElementValue<number>(
                'dummy',
                {},
                ['number'],
                5
            );
            expect(dummyElementValueNumber2.value).toBe(5);
            const dummyElementValueNumber3 = new DummyElementValue<number>(
                'dummy',
                {},
                ['number'],
                -5
            );
            expect(dummyElementValueNumber3.value).toBe(-5);
        });

        test('instantiate class of type string that extends ElementValue and validate API', () => {
            const dummyElementValueString1 = new DummyElementValue<string>(
                'dummy',
                {},
                ['string'],
                'foo'
            );
            expect(dummyElementValueString1.value).toBe('foo');
            const dummyElementValueString2 = new DummyElementValue<string>(
                'dummy',
                {},
                ['string'],
                ''
            );
            expect(dummyElementValueString2.value).toBe('');
        });

        test('instantiate class of type boolean that extends ElementValue and validate API', () => {
            const dummyElementValueBoolean1 = new DummyElementValue<boolean>(
                'dummy',
                {},
                ['boolean'],
                true
            );
            expect(dummyElementValueBoolean1.value).toBe(true);
            const dummyElementValueBoolean2 = new DummyElementValue<boolean>(
                'dummy',
                {},
                ['boolean'],
                false
            );
            expect(dummyElementValueBoolean2.value).toBe(false);
        });
    });

    describe('update', () => {
        test('update value in instance of class of type number that extends ElementValue and validate', () => {
            const dummyElementValueNumber = new DummyElementValue<number>(
                'dummy',
                {},
                ['number'],
                0
            );
            expect(dummyElementValueNumber.value).toBe(0);
            dummyElementValueNumber.update(5);
            expect(dummyElementValueNumber.value).toBe(5);
            dummyElementValueNumber.update(-5);
            expect(dummyElementValueNumber.value).toBe(-5);
        });

        test('update value in instance of class of type string that extends ElementValue and validate', () => {
            const dummyElementValueString = new DummyElementValue<string>(
                'dummy',
                {},
                ['string'],
                ''
            );
            expect(dummyElementValueString.value).toBe('');
            dummyElementValueString.update('foo');
            expect(dummyElementValueString.value).toBe('foo');
        });

        test('update value in instance of class of type boolean that extends ElementValue and validate', () => {
            const dummyElementValueBoolean = new DummyElementValue<boolean>(
                'dummy',
                {},
                ['boolean'],
                true
            );
            expect(dummyElementValueBoolean.value).toBe(true);
            dummyElementValueBoolean.update(false);
            expect(dummyElementValueBoolean.value).toBe(false);
        });
    });

    describe('override', () => {
        test('override value in instance of class of type number that extends ElementValue and validate', () => {
            const dummyElementValueBoolean = new DummyElementValueOverrideNumber(
                'dummy',
                {},
                ['number'],
                5
            );
            expect(dummyElementValueBoolean.value).toBe(10);
            dummyElementValueBoolean.update(-5);
            expect(dummyElementValueBoolean.value).toBe(-10);
        });

        test('override value in instance of class of type string that extends ElementValue and validate', () => {
            const dummyElementValueBoolean = new DummyElementValueOverrideString(
                'dummy',
                {},
                ['string'],
                'foobar'
            );
            expect(dummyElementValueBoolean.value).toBe('foo foobar bar');
            dummyElementValueBoolean.update('');
            expect(dummyElementValueBoolean.value).toBe('foo  bar');
        });

        test('override value in instance of class of type boolean that extends ElementValue and validate', () => {
            const dummyElementValueBoolean = new DummyElementValueOverrideBoolean(
                'dummy',
                {},
                ['boolean'],
                true
            );
            expect(dummyElementValueBoolean.value).toBe(false);
            dummyElementValueBoolean.update(false);
            expect(dummyElementValueBoolean.value).toBe(true);
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
