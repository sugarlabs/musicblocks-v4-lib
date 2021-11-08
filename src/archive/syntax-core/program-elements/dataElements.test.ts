import { SymbolTable } from '../symbolTable';
import { DataElement } from './dataElements';
import { ValueElement } from './valueElements';

describe('namespace DataElement', () => {
    describe('initialization and verification', () => {
        test('initialize IntDataElement with IntElement object and verify', () => {
            const dataElem = new DataElement.IntDataElement();
            dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            dataElem.args.setArg('value', new ValueElement.IntElement(5));
            const arg = dataElem.args.getArg('value');
            if (arg !== null) {
                expect(arg.getData({}).value).toBe(5);
            } else {
                throw Error('Object should not be null.');
            }
        });

        test('initialize IntDataElement with ArgumentElement object of unaccepted return-type and expect error', () => {
            expect(() => {
                const dataElem = new DataElement.IntDataElement();
                dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
                dataElem.args.setArg('value', new ValueElement.TrueElement());
            }).toThrowError('"TBoolean" is not a valid type for "value".');
        });

        test('initialize FloatDataElement with FloatElement object and verify', () => {
            const dataElem = new DataElement.FloatDataElement();
            dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            dataElem.args.setArg('value', new ValueElement.FloatElement(5.234));
            const arg = dataElem.args.getArg('value');
            if (arg !== null) {
                expect(arg.getData({}).value).toBe(5.234);
            } else {
                throw Error('Object should not be null.');
            }
        });

        test('initialize FloatDataElement with ArgumentElement object of unaccepted return-type and expect error', () => {
            expect(() => {
                const dataElem = new DataElement.FloatDataElement();
                dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
                dataElem.args.setArg('value', new ValueElement.TrueElement());
            }).toThrowError('"TBoolean" is not a valid type for "value".');
        });

        test('initialize CharDataElement with CharElement object and verify', () => {
            const dataElem = new DataElement.CharDataElement();
            dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            dataElem.args.setArg('value', new ValueElement.CharElement(97));
            const arg = dataElem.args.getArg('value');
            if (arg !== null) {
                expect(arg.getData({}).value).toBe('a');
            } else {
                throw Error('Object should not be null.');
            }
        });

        test('initialize CharDataElement with ArgumentElement object of unaccepted return-type and expect error', () => {
            expect(() => {
                const dataElem = new DataElement.CharDataElement();
                dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
                dataElem.args.setArg('value', new ValueElement.TrueElement());
            }).toThrowError('"TBoolean" is not a valid type for "value".');
        });

        test('initialize StringDataElement with StringElement object and verify', () => {
            const dataElem = new DataElement.StringDataElement();
            dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            dataElem.args.setArg('value', new ValueElement.StringElement('string'));
            const arg = dataElem.args.getArg('value');
            if (arg !== null) {
                expect(arg.getData({}).value).toBe('string');
            } else {
                throw Error('Object should not be null.');
            }
        });

        test('initialize StringDataElement with ArgumentElement object of unaccepted return-type and expect error', () => {
            expect(() => {
                const dataElem = new DataElement.StringDataElement();
                dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
                dataElem.args.setArg('value', new ValueElement.TrueElement());
            }).toThrowError('"TBoolean" is not a valid type for "value".');
        });

        test('initialize BooleanDataElement with BooleanElement object and verify', () => {
            const dataElem = new DataElement.BooleanDataElement();
            dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            dataElem.args.setArg('value', new ValueElement.TrueElement());
            const arg = dataElem.args.getArg('value');
            if (arg !== null) {
                expect(arg.getData({}).value).toBe(true);
            } else {
                throw Error('Object should not be null.');
            }
        });

        test('initialize BooleanDataElement with ArgumentElement object of unaccepted return-type and expect error', () => {
            expect(() => {
                const dataElem = new DataElement.BooleanDataElement();
                dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
                dataElem.args.setArg('value', new ValueElement.IntElement(5));
            }).toThrowError('"TInt" is not a valid type for "value".');
        });

        // test('initialize AnyDataElement with StringElement object and verify', () => {
        //     const dataElem = new DataElement.AnyDataElement();
        //     dataElem.argIdentifier = new ValueElement.StringElement('myBox');
        //     dataElem.argValue = new ValueElement.StringElement('any');
        //     const arg = dataElem.args.getArg('value');
        //     if (arg !== null) {
        //         expect(arg.data.value).toBe('any');
        //     } else {
        //         throw Error('Object should not be null');
        //     }
        // });
    });

    const symbolTable = new SymbolTable();

    describe('value element verification', () => {
        test('verify reference in created DataValueElement after assigning a IntDataElement', () => {
            const dataElem = new DataElement.IntDataElement();
            const argIdentifier = new ValueElement.StringElement('myIntBox');
            const argValue = new ValueElement.IntElement(5);
            dataElem.args.setArg('identifier', argIdentifier);
            dataElem.args.setArg('value', argValue);
            dataElem.onVisit({
                args: {
                    identifier: argIdentifier.getData({}),
                    value: argValue.getData({})
                },
                symbolTable
            });
            const valueElement = dataElem.valueElement;
            expect(valueElement instanceof ValueElement.IntDataValueElement).toBe(true);
            expect(valueElement.getData({ symbolTable }).value).toBe(5);
            const dataElement = valueElement.getData({ symbolTable });
            expect(dataElement).toEqual(argValue.getData({}));
        });

        // test('attempt to fetch TInt reference while assigning a null as value and expect error', () => {
        //     const dataElem = new DataElement.IntDataElement();
        //     dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
        //     dataElem.args.setArg('value', null);
        //     expect(() => dataElem.dataElementRef).toThrowError('Value cannot be null.');
        // });

        test('verify reference in created DataValueElement after assigning a FloatDataElement', () => {
            const dataElem = new DataElement.FloatDataElement();
            const argIdentifier = new ValueElement.StringElement('myFloatBox');
            const argValue = new ValueElement.FloatElement(2.71828);
            dataElem.args.setArg('identifier', argIdentifier);
            dataElem.args.setArg('value', argValue);
            dataElem.onVisit({
                args: {
                    identifier: argIdentifier.getData({}),
                    value: argValue.getData({})
                },
                symbolTable
            });
            const valueElement = dataElem.valueElement;
            expect(valueElement instanceof ValueElement.FloatDataValueElement).toBe(true);
            expect(valueElement.getData({ symbolTable }).value).toBe(2.71828);
            const dataElement = valueElement.getData({ symbolTable });
            expect(dataElement).toEqual(argValue.getData({}));
        });

        // test('attempt to fetch TFloat reference while assigning a null as value and expect error', () => {
        //     const dataElem = new DataElement.FloatDataElement();
        //     dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
        //     dataElem.args.setArg('value', null);
        //     expect(() => dataElem.dataElementRef).toThrowError('Value cannot be null.');
        // });

        test('verify reference in created DataValueElement after assigning a CharDataElement', () => {
            // const dataElem = new DataElement.CharDataElement();
            // dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            // dataElem.args.setArg('value', new ValueElement.CharElement(97));
            // dataElem.onVisit();
            // const valueElement = dataElem.valueElement;
            // expect(valueElement instanceof ValueElement.CharDataValueElement).toBe(true);
            // expect(valueElement.getData({ symbolTable }).value).toBe('a');
            // const dataElement = valueElement.getData({ symbolTable });
            // expect(dataElement).toEqual(dataElem.dataElementRef);
        });

        // test('attempt to fetch TChar reference while assigning a null as value and expect error', () => {
        //     const dataElem = new DataElement.CharDataElement();
        //     dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
        //     dataElem.args.setArg('value', null);
        //     expect(() => dataElem.dataElementRef).toThrowError('Value cannot be null.');
        // });

        test('verify reference in created DataValueElement after assigning a StringDataElement', () => {
            // const dataElem = new DataElement.StringDataElement();
            // dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            // dataElem.args.setArg('value', new ValueElement.StringElement('string'));
            // dataElem.onVisit();
            // const valueElement = dataElem.valueElement;
            // expect(valueElement instanceof ValueElement.StringDataValueElement).toBe(true);
            // expect(valueElement.getData({ symbolTable }).value).toBe('string');
            // const dataElement = valueElement.getData({ symbolTable });
            // expect(dataElement).toEqual(dataElem.dataElementRef);
        });

        // test('attempt to fetch TString reference while assigning a null as value and expect error', () => {
        //     const dataElem = new DataElement.StringDataElement();
        //     dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
        //     dataElem.args.setArg('value', null);
        //     expect(() => dataElem.dataElementRef).toThrowError('Value cannot be null.');
        // });

        test('verify reference in created DataValueElement after assigning a BooleanDataElement with TrueElement', () => {
            // const dataElem = new DataElement.BooleanDataElement();
            // dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            // dataElem.args.setArg('value', new ValueElement.TrueElement());
            // dataElem.onVisit();
            // const valueElement = dataElem.valueElement;
            // expect(valueElement instanceof ValueElement.BooleanDataValueElement).toBe(true);
            // expect(valueElement.getData({ symbolTable }).value).toBe(true);
            // const dataElement = valueElement.getData({ symbolTable });
            // expect(dataElement).toEqual(dataElem.dataElementRef);
        });

        test('verify reference in created DataValueElement after assigning a BooleanDataElement with FalseElement', () => {
            // const dataElem = new DataElement.BooleanDataElement();
            // dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
            // dataElem.args.setArg('value', new ValueElement.FalseElement());
            // dataElem.onVisit();
            // const valueElement = dataElem.valueElement;
            // expect(valueElement instanceof ValueElement.BooleanDataValueElement).toBe(true);
            // expect(valueElement.getData({ symbolTable }).value).toBe(false);
            // const dataElement = valueElement.getData({ symbolTable });
            // expect(dataElement).toEqual(dataElem.dataElementRef);
        });

        // test('attempt to fetch TBoolean reference while assigning a null as value and expect error', () => {
        //     const dataElem = new DataElement.BooleanDataElement();
        //     dataElem.args.setArg('identifier', new ValueElement.StringElement('myBox'));
        //     dataElem.args.setArg('value', null);
        //     expect(() => dataElem.dataElementRef).toThrowError('Value cannot be null.');
        // });

        // test('verify created ValueElement after executing a AnyDataElement', () => {
        //     const dataElem = new DataElement.AnyDataElement();
        //     dataElem.argIdentifier = new ValueElement.StringElement('myBox');
        //     dataElem.argValue = new ValueElement.FalseElement();
        //     dataElem.onVisit();
        //     const valueElement = dataElem.valueElement;
        //     if (valueElement !== null) {
        //         expect(valueElement instanceof ValueElement.FalseElement).toBe(true);
        //         expect(valueElement.data.value).toBe(false);
        //         const dataElement = valueElement.dataElement;
        //         expect(dataElement).toEqual(dataElem);
        //     } else {
        //         throw Error('Object should not be null');
        //     }
        // });

        // test('attempt to execute a AnyDataElement while assigning a null as value and expect error', () => {
        //     const dataElem = new DataElement.AnyDataElement();
        //     dataElem.argIdentifier = new ValueElement.StringElement('myBox');
        //     dataElem.argValue = null;
        //     expect(() => dataElem.onVisit()).toThrowError('Invalid argument: value cannot be null');
        // });
    });
});
