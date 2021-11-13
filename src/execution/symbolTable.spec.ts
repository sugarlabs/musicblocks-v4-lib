import * as symbolTable from './symbolTable';

describe('Symbol Table', () => {
    describe('global variables', () => {
        test('add a new number variable and verify entry by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar1', 'number', 5);
            expect(symbolTable.getGlobalVariable('myVar1')).toEqual({
                dataType: 'number',
                value: 5
            });
        });

        test('add a new string variable and verify entry by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar2', 'string', 'foo');
            expect(symbolTable.getGlobalVariable('myVar2')).toEqual({
                dataType: 'string',
                value: 'foo'
            });
        });

        test('add a new boolean variable and verify entry by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar3', 'boolean', true);
            expect(symbolTable.getGlobalVariable('myVar3')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });

        test('add an existing variable and verify overwrite by fetching the entry for the variable', () => {
            symbolTable.addGlobalVariable('myVar1', 'boolean', true);
            expect(symbolTable.getGlobalVariable('myVar1')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });

        test('fetch a non-existing variable and expect null', () => {
            expect(symbolTable.getGlobalVariable('myVar')).toBe(null);
        });

        test('remove an existing variable and verify', () => {
            symbolTable.addGlobalVariable('myVarx', 'number', 0);
            expect(symbolTable.getGlobalVariable('myVarx')).toEqual({
                dataType: 'number',
                value: 0
            });
            symbolTable.removeGlobalVariable('myVarx');
            expect(symbolTable.getGlobalVariable('myVarx')).toBe(null);
        });
    });

    describe('program variables', () => {
        test('add a new variable to a new program and verify entry by fetching the entry for the variable', () => {
            symbolTable.addProgramVariable('myVar1', 'number', 5, 'myProgram1');
            expect(symbolTable.getProgramVariable('myVar1', 'myProgram1')).toEqual({
                dataType: 'number',
                value: 5
            });
        });

        test('add a new variable to an existing program and verify entry by fetching the entry for the variable', () => {
            symbolTable.addProgramVariable('myVar2', 'string', 'foo', 'myProgram1');
            expect(symbolTable.getProgramVariable('myVar2', 'myProgram1')).toEqual({
                dataType: 'string',
                value: 'foo'
            });
        });

        test('add an existing variable to a new program and verify entry by fetching the entry for the variable', () => {
            symbolTable.addProgramVariable('myVar1', 'boolean', true, 'myProgram2');
            expect(symbolTable.getProgramVariable('myVar1', 'myProgram2')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });

        test('add an existing variable-program pair and verify rewrite by fetching the entry for the variable', () => {
            symbolTable.addProgramVariable('myVar1', 'string', 'bar', 'myProgram2');
            expect(symbolTable.getProgramVariable('myVar1', 'myProgram2')).toEqual({
                dataType: 'string',
                value: 'bar'
            });
        });

        test('fetch a non-existing variable in an existing program and expect null', () => {
            expect(symbolTable.getProgramVariable('noVar', 'myProgram1')).toBe(null);
        });

        test('fetch an existing variable in a non-existing program and expect null', () => {
            expect(symbolTable.getProgramVariable('myVar1', 'myProgram')).toBe(null);
        });

        test('fetch an existing variable in an existing program but with no overlap and expect null', () => {
            expect(symbolTable.getProgramVariable('myVar2', 'myProgram2')).toBe(null);
        });
    });

    describe('routine variables', () => {
        test('add a new variable to a new routine and verify entry by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar1', 'number', 5, 'myRoutine1');
            expect(symbolTable.getRoutineVariable('myVar1', 'myRoutine1')).toEqual({
                dataType: 'number',
                value: 5
            });
        });

        test('add a new variable to an existing routine and verify entry by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar2', 'string', 'foo', 'myRoutine1');
            expect(symbolTable.getRoutineVariable('myVar2', 'myRoutine1')).toEqual({
                dataType: 'string',
                value: 'foo'
            });
        });

        test('add an existing variable to a new routine and verify entry by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar1', 'boolean', true, 'myRoutine2');
            expect(symbolTable.getRoutineVariable('myVar1', 'myRoutine2')).toEqual({
                dataType: 'boolean',
                value: true
            });
        });

        test('add an existing variable-routine pair and verify rewrite by fetching the entry for the variable', () => {
            symbolTable.addRoutineVariable('myVar1', 'string', 'bar', 'myRoutine2');
            expect(symbolTable.getRoutineVariable('myVar1', 'myRoutine2')).toEqual({
                dataType: 'string',
                value: 'bar'
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
                    ['myVar3', 'boolean']
                ])
            );
        });

        test('verify program variable names for an existing program', () => {
            expect(new Set(symbolTable.getProgramVariableNames('myProgram1'))).toEqual(
                new Set(['myVar1', 'myVar2'])
            );
        });

        test('verify program variable names with types for an existing program', () => {
            expect(
                new Set(Object.entries(symbolTable.getProgramVariableNamesWithTypes('myProgram1')))
            ).toEqual(
                new Set([
                    ['myVar1', 'number'],
                    ['myVar2', 'string']
                ])
            );
        });

        test('fetch program variable names for a non-existing program and expect empty list', () => {
            expect(new Set(symbolTable.getProgramVariableNames('myProgram'))).toEqual(new Set([]));
        });

        test('verify all program variable names', () => {
            const variables = symbolTable.getProgramVariableNamesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myProgram1', 'myProgram2']));
            expect(new Set(variables['myProgram1'])).toEqual(new Set(['myVar1', 'myVar2']));
            expect(new Set(variables['myProgram2'])).toEqual(new Set(['myVar1']));
        });

        test('verify all program variable names with types', () => {
            const variables = symbolTable.getProgramVariableNamesWithTypesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myProgram1', 'myProgram2']));
            expect(new Set(Object.entries(variables['myProgram1']))).toEqual(
                new Set([
                    ['myVar1', 'number'],
                    ['myVar2', 'string']
                ])
            );
            expect(new Set(Object.entries(variables['myProgram2']))).toEqual(
                new Set([['myVar1', 'string']])
            );
        });

        test('verify routine variable names for an existing program', () => {
            expect(new Set(symbolTable.getRoutineVariableNames('myRoutine1'))).toEqual(
                new Set(['myVar1', 'myVar2'])
            );
        });

        test('verify routine variable names with types for an existing program', () => {
            expect(
                new Set(Object.entries(symbolTable.getRoutineVariableNamesWithTypes('myRoutine1')))
            ).toEqual(
                new Set([
                    ['myVar1', 'number'],
                    ['myVar2', 'string']
                ])
            );
        });

        test('fetch routine variable names for a non-existing program and expect empty list', () => {
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
                    ['myVar2', 'string']
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

        test('flush variables of an existing program and verify by checking listing', () => {
            symbolTable.flushProgramVariables('myProgram1');
            const variables = symbolTable.getProgramVariableNamesWithTypesAll();
            expect(new Set(Object.keys(variables))).toEqual(new Set(['myProgram2']));
            expect(new Set(Object.entries(variables['myProgram2']))).toEqual(
                new Set([['myVar1', 'string']])
            );
        });

        test('flush all program variables and verify by checking listing', () => {
            symbolTable.flushProgramVariablesAll();
            expect(symbolTable.getProgramVariableNamesAll()).toEqual({});
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
            symbolTable.addProgramVariable('myVar2', 'number', 0, 'myProgram');
            symbolTable.addRoutineVariable('myVar3', 'number', 0, 'myRoutine');
            expect(new Set(symbolTable.getGlobalVariableNames())).toEqual(new Set(['myVar1']));
            expect(new Set(Object.entries(symbolTable.getProgramVariableNamesAll()))).toEqual(
                new Set([['myProgram', ['myVar2']]])
            );
            expect(new Set(Object.entries(symbolTable.getRoutineVariableNamesAll()))).toEqual(
                new Set([['myRoutine', ['myVar3']]])
            );
            symbolTable.flushAllVariables();
            expect(symbolTable.getGlobalVariableNames()).toEqual([]);
            expect(symbolTable.getProgramVariableNamesAll()).toEqual({});
            expect(symbolTable.getRoutineVariableNamesAll()).toEqual({});
        });
    });
});
