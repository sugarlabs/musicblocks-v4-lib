import { TData, TDataName } from '@/@types/syntax/data';

// -- types ----------------------------------------------------------------------------------------

/** Type describing a variable entry. */
type IVariable = {
    dataType: TDataName;
    value: TData;
};

/** Type describing a set of variables. */
type IVariableTable = {
    [variable: string]: IVariable;
};

// -- private variables ----------------------------------------------------------------------------

/** Stores the global table. */
let _globalTable: IVariableTable = {};
/** Stores the programs' tables. */
let _programTable: { [program: string]: IVariableTable } = {};
/** Stores the routines' table. */
let _routineTable: { [routine: string]: IVariableTable } = {};

// -- private function -----------------------------------------------------------------------------

/**
 * A helper that adds a variable for a program or routine. If already present, overwrites it.
 * @param variable - name of the variable
 * @param dataType - data type of the variable
 * @param value - value of the variable
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `program` or `routine`
 */
function _addTableVariable(
    variable: string,
    dataType: TDataName,
    value: TData,
    selector: string,
    tableName: 'program' | 'routine'
): void {
    const table = tableName === 'program' ? _programTable : _routineTable;
    if (!(selector in table)) {
        table[selector] = {};
    }
    table[selector][variable] = { dataType, value };
}

/**
 * A helper that fetches a variable for a program or routine.
 * @param variable - name of the variable
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `program` or `routine`
 * @returns the variable entry if present, else `null`
 */
function _getTableVariable(
    variable: string,
    selector: string,
    tableName: 'program' | 'routine'
): IVariable | null {
    const table = tableName === 'program' ? _programTable : _routineTable;
    return selector in table && variable in table[selector] ? table[selector][variable] : null;
}

/**
 * A helper that returns names of all variables for a program or routine.
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `program` or `routine`
 * @returns a list of all variable names for a program or routine
 */
function _getTableVariableNames(selector: string, tableName: 'program' | 'routine'): string[] {
    const table = tableName === 'program' ? _programTable : _routineTable;
    return selector in table ? Object.keys(table[selector]) : [];
}
/**
 * A helper that returns names of all variables for a program or routine with their data types.
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `program` or `routine`
 * @returns an object with key-value pairs of variable names and corresponding data type
 */
function _getTableVariableNamesWithTypes(
    selector: string,
    tableName: 'program' | 'routine'
): { [variable: string]: TDataName } {
    const table = tableName === 'program' ? _programTable : _routineTable;
    if (!(selector in table)) {
        return {};
    }

    const res: { [variable: string]: TDataName } = {};
    Object.entries(table[selector]).forEach(([variable, { dataType }]) => {
        res[variable] = dataType;
    });
    return res;
}

/**
 * A helper that returns names of all program or routine variables.
 * @param tableName - `program` or `routine`
 * @returns an object with key-value pairs of program or routine names and corresponding list of
 * variable names
 */
function _getTableVariableNamesAll(tableName: 'program' | 'routine'): {
    [key: string]: string[];
} {
    const table = tableName === 'program' ? _programTable : _routineTable;
    const res: { [key: string]: string[] } = {};
    Object.entries(table).forEach(([key, variables]) => {
        res[key] = Object.keys(variables);
    });
    return res;
}

/**
 * A helper that returns names and types of all program or routine variables.
 * @param tableName - `program` or `routine`
 * @returns an object with key-value pairs of program or routine names and corresponding object with
 * key-value pairs of variable names and data types.
 */
function _getTableVariableNamesWithTypesAll(tableName: 'program' | 'routine'): {
    [key: string]: { [variable: string]: TDataName };
} {
    const table = tableName === 'program' ? _programTable : _routineTable;
    const res: { [key: string]: { [variable: string]: TDataName } } = {};
    Object.entries(table).forEach(([key, variables]) => {
        res[key] = {};
        Object.entries(variables).forEach(([variable, { dataType }]) => {
            res[key][variable] = dataType;
        });
    });
    return res;
}

/**
 * Removes a variable for a program or routine if present.
 * @param variable - name of the variable
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `program` or `routine`
 */
function _removeTableVariable(
    variable: string,
    selector: string,
    tableName: 'program' | 'routine'
): void {
    const table = tableName === 'program' ? _programTable : _routineTable;
    if (selector in table && variable in table[selector]) {
        delete table[selector][variable];
    }
}

/**
 * A helper that clears all variables for a program or routine.
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `program` or `routine`
 */
function _flushTableVariables(selector: string, tableName: 'program' | 'routine'): void {
    const table = tableName === 'program' ? _programTable : _routineTable;
    if (selector in table) {
        delete table[selector];
    }
}

// -- public functions -----------------------------------------------------------------------------

/**
 * Adds a global variable. If already present, overwrites it.
 * @param variable - name of the variable
 * @param dataType - data type of the variable
 * @param value - value of the variable
 */
export function addGlobalVariable(variable: string, dataType: 'number', value: number): void;
export function addGlobalVariable(variable: string, dataType: 'string', value: string): void;
export function addGlobalVariable(variable: string, dataType: 'boolean', value: boolean): void;
export function addGlobalVariable(variable: string, dataType: TDataName, value: TData): void {
    _globalTable[variable] = { dataType, value };
}

/**
 * Fetches a global variable.
 * @param variable - name of the variable
 * @returns the variable entry if present, else `null`
 */
export function getGlobalVariable(variable: string): IVariable | null {
    return variable in _globalTable ? _globalTable[variable] : null;
}

/**
 * Returns names of all global variables.
 * @returns a list of all global variable names
 */
export function getGlobalVariableNames(): string[] {
    return Object.keys(_globalTable);
}

/**
 * Returns names of all global variables with their data types.
 * @returns an object with key-value pairs of variable names and corresponding data type
 */
export function getGlobalVariableNamesWithTypes(): { [variable: string]: TDataName } {
    const table: { [variable: string]: TDataName } = {};
    Object.entries(_globalTable).forEach(([variable, { dataType }]) => {
        table[variable] = dataType;
    });
    return table;
}

/**
 * Removes a global variable if present.
 * @param variable - name of the variable
 */
export function removeGlobalVariable(variable: string): void {
    if (variable in _globalTable) {
        delete _globalTable[variable];
    }
}

/**
 * Adds a variable for a program. If already present, overwrites it.
 * @param variable - name of the variable
 * @param dataType - data type of the variable
 * @param value - value of the variable
 * @param program - ID of the program
 */
export function addProgramVariable(
    variable: string,
    dataType: 'number',
    value: number,
    program: string
): void;
export function addProgramVariable(
    variable: string,
    dataType: 'string',
    value: string,
    program: string
): void;
export function addProgramVariable(
    variable: string,
    dataType: 'boolean',
    value: boolean,
    program: string
): void;
export function addProgramVariable(
    variable: string,
    dataType: TDataName,
    value: TData,
    program: string
): void {
    _addTableVariable(variable, dataType, value, program, 'program');
}

/**
 * Fetches a variable for a program.
 * @param variable - name of the variable
 * @param program - ID of the program
 * @returns the variable entry if present, else `null`
 */
export function getProgramVariable(variable: string, program: string): IVariable | null {
    return _getTableVariable(variable, program, 'program');
}

/**
 * Returns names of all variables for a program.
 * @param program - ID of the program
 * @returns a list of all variable names for a program
 */
export function getProgramVariableNames(program: string): string[] {
    return _getTableVariableNames(program, 'program');
}

/**
 * Returns names of all variables for a program with their data types.
 * @param program - ID of the program
 * @returns an object with key-value pairs of variable names and corresponding data type
 */
export function getProgramVariableNamesWithTypes(program: string): {
    [variable: string]: TDataName;
} {
    return _getTableVariableNamesWithTypes(program, 'program');
}

/**
 * Returns names of all program variables.
 * @returns an object with key-value pairs of program names and corresponding list of variable
 * names
 */
export function getProgramVariableNamesAll(): { [program: string]: string[] } {
    return _getTableVariableNamesAll('program');
}

/**
 * Returns names and types of all program variables.
 * @returns an object with key-value pairs of program names and corresponding object with key-value
 * pairs of variable names and data types.
 */
export function getProgramVariableNamesWithTypesAll(): {
    [program: string]: { [variable: string]: TDataName };
} {
    return _getTableVariableNamesWithTypesAll('program');
}

/**
 * Removes a variable for a program if present.
 * @param variable - name of the variable
 * @param program - ID of the program
 */
export function removeProgramVariable(variable: string, program: string): void {
    _removeTableVariable(variable, program, 'program');
}

/**
 * Adds a variable for a routine. If already present, overwrites it.
 * @param variable - name of the variable
 * @param dataType - data type of the variable
 * @param value - value of the variable
 * @param routine - ID of the routine
 */
export function addRoutineVariable(
    variable: string,
    dataType: 'number',
    value: number,
    routine: string
): void;
export function addRoutineVariable(
    variable: string,
    dataType: 'string',
    value: string,
    routine: string
): void;
export function addRoutineVariable(
    variable: string,
    dataType: 'boolean',
    value: boolean,
    routine: string
): void;
export function addRoutineVariable(
    variable: string,
    dataType: TDataName,
    value: TData,
    routine: string
): void {
    _addTableVariable(variable, dataType, value, routine, 'routine');
}

/**
 * Fetches a variable for a routine.
 * @param variable - name of the variable
 * @param routine - ID of the routine
 * @returns the variable entry if present, else `null`
 */
export function getRoutineVariable(variable: string, routine: string): IVariable | null {
    return _getTableVariable(variable, routine, 'routine');
}

/**
 * Returns names of all variables for a routine.
 * @param routine - ID of the routine
 * @returns a list of all variable names for a routine
 */
export function getRoutineVariableNames(routine: string): string[] {
    return _getTableVariableNames(routine, 'routine');
}

/**
 * Returns names of all variables for a routine with their data types.
 * @param routine - ID of the routine
 * @returns an object with key-value pairs of variable names and corresponding data type
 */
export function getRoutineVariableNamesWithTypes(routine: string): {
    [variable: string]: TDataName;
} {
    return _getTableVariableNamesWithTypes(routine, 'routine');
}

/**
 * Returns names of all routine variables.
 * @returns an object with key-value pairs of routine names and corresponding list of variable
 * names
 */
export function getRoutineVariableNamesAll(): { [routine: string]: string[] } {
    return _getTableVariableNamesAll('routine');
}

/**
 * Returns names and types of all routine variables.
 * @returns an object with key-value pairs of routine names and corresponding object with key-value
 * pairs of variable names and data types.
 */
export function getRoutineVariableNamesWithTypesAll(): {
    [routine: string]: { [variable: string]: TDataName };
} {
    return _getTableVariableNamesWithTypesAll('routine');
}

/**
 * Removes a variable for a routine if present.
 * @param variable - name of the variable
 * @param routine - ID of the routine
 */
export function removeRoutineVariable(variable: string, routine: string): void {
    _removeTableVariable(variable, routine, 'routine');
}

/**
 * Clears all global variables.
 */
export function flushGlobalVariables(): void {
    _globalTable = {};
}

/**
 * Clears all variables for a program.
 * @param program - 0 ID of the program
 */
export function flushProgramVariables(program: string): void {
    _flushTableVariables(program, 'program');
}

/**
 * Clears all program variables.
 */
export function flushProgramVariablesAll(): void {
    _programTable = {};
}

/**
 * Clears all variables for a routine.
 * @param routine - ID of the routine
 */
export function flushRoutineVariables(routine: string): void {
    _flushTableVariables(routine, 'routine');
}

/**
 * Clears all routine variables.
 */
export function flushRoutineVariablesAll(): void {
    _routineTable = {};
}

/**
 * Clears all variable tables.
 */
export function flushAllVariables(): void {
    flushGlobalVariables();
    flushProgramVariablesAll();
    flushRoutineVariablesAll();
}
