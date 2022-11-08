import * as symbolTable from '.';

// -------------------------------------------------------------------------------------------------

describe('Symbol Table', () => {
    describe('global variables', () => {
        test('add a new number variable and verify entry by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar1', 'number', 5);
            expect(symbolTable.getGlobalVariable('myVar1')).toEqual({
                dataType: 'number',
                value: 5,
            });
        });

        test('add a new string variable and verify entry by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar2', 'string', 'foo');
            expect(symbolTable.getGlobalVariable('myVar2')).toEqual({
                dataType: 'string',
                value: 'foo',
            });
        });

        test('add a new boolean variable and verify entry by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar3', 'boolean', true);
            expect(symbolTable.getGlobalVariable('myVar3')).toEqual({
                dataType: 'boolean',
                value: true,
            });
        });

        test('add an existing variable and verify overwrite by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar1', 'boolean', true);
            expect(symbolTable.getGlobalVariable('myVar1')).toEqual({
                dataType: 'boolean',
                value: true,
            });
        });

        test('fetch a non-existing variable and expect null', () => {
            expect(symbolTable.getGlobalVariable('myVar')).toBe(null);
        });

        test('remove an existing variable and verify', () => {
            symbolTable.addGlobalVariable('myVarx', 'number', 0);
            expect(symbolTable.getGlobalVariable('myVarx')).toEqual({
                dataType: 'number',
                value: 0,
            });
            symbolTable.removeGlobalVariable('myVarx');
            expect(symbolTable.getGlobalVariable('myVarx')).toBe(null);
        });
    });

    describe('process variables', () => {
        test('add a new variable to a new process and verify entry by fetching the entry for the variable', () => {
            symbolTable.addProcessVariable('myVar1', 'number', 5, 'myProcess1');
            expect(symbolTable.getProcessVariable('myVar1', 'myProcess1')).toEqual({
                dataType: 'number',
                value: 5,
            });
        });

        test('add a new variable to an existing process and verify entry by fetching the entry for the variable', () => {
            symbolTable.addProcessVariable('myVar2', 'string', 'foo', 'myProcess1');
            expect(symbolTable.getProcessVariable('myVar2', 'myProcess1')).toEqual({
                dataType: 'string',
                value: 'foo',
            });
        });

        test('add an existing variable to a new process and verify entry by fetching the entry for the variable', () => {
            symbolTable.addProcessVariable('myVar1', 'boolean', true, 'myProcess2');
            expect(symbolTable.getProcessVariable('myVar1', 'myProcess2')).toEqual({
                dataType: 'boolean',
                value: true,
            });
        });

        test('add an existing variable-process pair and verify rewrite by fetching the entry for the variable', () => {
            symbolTable.addProcessVariable('myVar1', 'string', 'bar', 'myProcess2');
            expect(symbolTable.getProcessVariable('myVar1', 'myProcess2')).toEqual({
                dataType: 'string',
                value: 'bar',
            });
        });

        test('fetch a non-existing variable in an existing process and expect null', () => {
            expect(symbolTable.getProcessVariable('noVar', 'myProcess1')).toBe(null);
        });

        test('fetch an existing variable in a non-existing process and expect null', () => {
            expect(symbolTable.getProcessVariable('myVar1', 'myProcess')).toBe(null);
        });

        test('fetch an existing variable in an existing process but with no overlap and expect null', () => {
            expect(symbolTable.getProcessVariable('myVar2', 'myProcess2')).toBe(null);
        });
    });

    describe('routine variables', () => {
        test('add a new variable to a new routine and verify entry by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar1', 'number', 5, 'myRoutine1');
            expect(symbolTable.getRoutineVariable('myVar1', 'myRoutine1')).toEqual({
                dataType: 'number',
                value: 5,
            });
        });

        test('add a new variable to an existing routine and verify entry by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar2', 'string', 'foo', 'myRoutine1');
            expect(symbolTable.getRoutineVariable('myVar2', 'myRoutine1')).toEqual({
                dataType: 'string',
                value: 'foo',
            });
        });

        test('add an existing variable to a new routine and verify entry by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar1', 'boolean', true, 'myRoutine2');
            expect(symbolTable.getRoutineVariable('myVar1', 'myRoutine2')).toEqual({
                dataType: 'boolean',
                value: true,
            });
        });

        test('add an existing variable-routine pair and verify rewrite by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar1', 'string', 'bar', 'myRoutine2');
            expect(symbolTable.getRoutineVariable('myVar1', 'myRoutine2')).toEqual({
                dataType: 'string',
                value: 'bar',
            });
        });

        test('fetch a non-existing variable in an existing routine and expect null', () => {
            expect(symbolTable.getRoutineVariable('noVar', 'myRoutine1')).toBe(null);
        });

        test('fetch an existing variable in a non-existing routine and expect null', () => {
            expect(symbolTable.getRoutineVariable('myVar1', 'myRoutine')).toBe(null);
        });

        test('fetch an existing variable in an existing routine but with no overlap and expect null', () => {
            expect(symbolTable.getRoutineVariable('myVar2', 'myRoutine2')).toBe(null);
        });
    });

    describe('variable listing', () => {
        test('verify global variable names', () => {
            expect(new Set(symbolTable.getGlobalVariableNames())).toEqual(
                new Set(['myVar1', 'myVar2', 'myVar3'])
            );
        });

        test('verify global variable names with types', () => {
            expect(new Set(Object.entries(symbolTable.getGlobalVariableNamesWithTypes()))).toEqual(
                new Set([
                    ['myVar1', 'boolean'],
                    ['myVar2', 'string'],
                    ['myVar3', 'boolean'],
                ])
            );
        });

        test('verify process variable names for an existing process', () => {
            expect(new Set(symbolTable.getProcessVariableNames('myProcess1'))).toEqual(
                new Set(['myVar1', 'myVar2'])
            );
        });

        test('verify process variable names with types for an existing process', () => {
            expect(
                new Set(Object.entries(symbolTable.getProcessVariableNamesWithTypes('myProcess1')))
            ).toEqual(
                new Set([
                    ['myVar1', 'number'],
                    ['myVar2', 'string'],
                ])
            );
        });

        test('fetch process variable names for a non-existing process and expect empty list', () => {
            expect(new Set(symbolTable.getProcessVariableNames('myProcess'))).toEqual(new Set([]));
        });

        test('verify all process variable names', () => {
            const variables = symbolTable.getProcessVariableNamesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myProcess1', 'myProcess2']));
            expect(new Set(variables['myProcess1'])).toEqual(new Set(['myVar1', 'myVar2']));
            expect(new Set(variables['myProcess2'])).toEqual(new Set(['myVar1']));
        });

        test('verify all process variable names with types', () => {
            const variables = symbolTable.getProcessVariableNamesWithTypesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myProcess1', 'myProcess2']));
            expect(new Set(Object.entries(variables['myProcess1']))).toEqual(
                new Set([
                    ['myVar1', 'number'],
                    ['myVar2', 'string'],
                ])
            );
            expect(new Set(Object.entries(variables['myProcess2']))).toEqual(
                new Set([['myVar1', 'string']])
            );
        });

        test('verify routine variable names for an existing process', () => {
            expect(new Set(symbolTable.getRoutineVariableNames('myRoutine1'))).toEqual(
                new Set(['myVar1', 'myVar2'])
            );
        });

        test('verify routine variable names with types for an existing process', () => {
            expect(
                new Set(Object.entries(symbolTable.getRoutineVariableNamesWithTypes('myRoutine1')))
            ).toEqual(
                new Set([
                    ['myVar1', 'number'],
                    ['myVar2', 'string'],
                ])
            );
        });

        test('fetch routine variable names for a non-existing process and expect empty list', () => {
            expect(new Set(symbolTable.getRoutineVariableNames('myRoutine'))).toEqual(new Set([]));
        });

        test('verify all routine variable names', () => {
            const variables = symbolTable.getRoutineVariableNamesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myRoutine1', 'myRoutine2']));
            expect(new Set(variables['myRoutine1'])).toEqual(new Set(['myVar1', 'myVar2']));
            expect(new Set(variables['myRoutine2'])).toEqual(new Set(['myVar1']));
        });

        test('verify all routine variable names with types', () => {
            const variables = symbolTable.getRoutineVariableNamesWithTypesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myRoutine1', 'myRoutine2']));
            expect(new Set(Object.entries(variables['myRoutine1']))).toEqual(
                new Set([
                    ['myVar1', 'number'],
                    ['myVar2', 'string'],
                ])
            );
            expect(new Set(Object.entries(variables['myRoutine2']))).toEqual(
                new Set([['myVar1', 'string']])
            );
        });
    });

    describe('flush', () => {
        test('flush all global variables and verify by checking listing', () => {
            symbolTable.flushGlobalVariables();
            expect(symbolTable.getGlobalVariableNames()).toEqual([]);
        });

        test('flush variables of an existing process and verify by checking listing', () => {
            symbolTable.flushProcessVariables('myProcess1');
            const variables = symbolTable.getProcessVariableNamesWithTypesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myProcess2']));
            expect(new Set(Object.entries(variables['myProcess2']))).toEqual(
                new Set([['myVar1', 'string']])
            );
        });

        test('flush all process variables and verify by checking listing', () => {
            symbolTable.flushProcessVariablesAll();
            expect(symbolTable.getProcessVariableNamesAll()).toEqual({});
        });

        test('flush variables of an existing routine and verify by checking listing', () => {
            symbolTable.flushRoutineVariables('myRoutine1');
            const variables = symbolTable.getRoutineVariableNamesWithTypesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myRoutine2']));
            expect(new Set(Object.entries(variables['myRoutine2']))).toEqual(
                new Set([['myVar1', 'string']])
            );
        });

        test('flush all routine variables and verify by checking listing', () => {
            symbolTable.flushRoutineVariablesAll();
            expect(symbolTable.getRoutineVariableNamesAll()).toEqual({});
        });

        test('flush all variables and verify', () => {
            symbolTable.addGlobalVariable('myVar1', 'number', 0);
            symbolTable.addProcessVariable('myVar2', 'number', 0, 'myProcess');
            symbolTable.addRoutineVariable('myVar3', 'number', 0, 'myRoutine');
            expect(new Set(symbolTable.getGlobalVariableNames())).toEqual(new Set(['myVar1']));
            expect(new Set(Object.entries(symbolTable.getProcessVariableNamesAll()))).toEqual(
                new Set([['myProcess', ['myVar2']]])
            );
            expect(new Set(Object.entries(symbolTable.getRoutineVariableNamesAll()))).toEqual(
                new Set([['myRoutine', ['myVar3']]])
            );
            symbolTable.flushAllVariables();
            expect(symbolTable.getGlobalVariableNames()).toEqual([]);
            expect(symbolTable.getProcessVariableNamesAll()).toEqual({});
            expect(symbolTable.getRoutineVariableNamesAll()).toEqual({});
        });
    });
});
