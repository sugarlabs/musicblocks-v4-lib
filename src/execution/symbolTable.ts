import { TData, TDataName } from '../@types/data';
import { IVariable } from '../@types/execution';

// -- types ----------------------------------------------------------------------------------------

/** Type describing a set of variables. */
type IVariableTable = {
    [dataType in TDataName]: {
        [variable: string]: IVariable;
    };
};

// -- private variables ----------------------------------------------------------------------------

/** Stores the global table. */
let _globalTable: IVariableTable = { string: {}, number: {}, boolean: {} };
/** Stores the processes' tables. */
let _processTable: { [process: string]: IVariableTable } = {};
/** Stores the routines' table. */
let _routineTable: { [routine: string]: IVariableTable } = {};

// -- private functions ----------------------------------------------------------------------------

/**
 * A helper that adds a variable for a process or routine. If already present, overwrites it.
 * @param variable - name of the variable
 * @param dataType - data type of the variable
 * @param value - value of the variable
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `process` or `routine`
 */
function _addTableVariable(
    variable: string,
    dataType: TDataName,
    value: TData,
    selector: string,
    tableName: 'process' | 'routine'
): void {
    const table = tableName === 'process' ? _processTable : _routineTable;
    if (!(selector in table)) {
        table[selector] = { string: {}, number: {}, boolean: {} };
    }
    table[selector][dataType][variable] = { dataType, value };
}

/**
 * A helper that fetches a variable for a process or routine.
 * If the optional arg `dataType` is `undefined`, it will fetch the variable in the given order of
 * data types - string, number, boolean for process or routine.
 * @param variable - name of the variable
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `process` or `routine`
 * @param dataType - (optional) data type of the variable.
 * @returns the variable entry if present, else `null`
 */
function _getTableVariable(
    variable: string,
    selector: string,
    tableName: 'process' | 'routine',
    dataType?: TDataName
): IVariable | null {
    const table = tableName === 'process' ? _processTable : _routineTable;
    if (dataType != undefined) {
        return selector in table && variable in table[selector][dataType]
            ? table[selector][dataType][variable]
            : null;
    } else {
        if (selector in table) {
            if (variable in table[selector]['string']) {
                return table[selector]['string'][variable];
            } else if (variable in table[selector]['number']) {
                return table[selector]['number'][variable];
            } else if (variable in table[selector]['boolean']) {
                return table[selector]['boolean'][variable];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

/**
 * A helper that returns names of all variables for a process or routine.
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `process` or `routine`
 * @returns a list of all variable names for a process or routine
 */
function _getTableVariableNames(selector: string, tableName: 'process' | 'routine'): string[] {
    const table = tableName === 'process' ? _processTable : _routineTable;
    if (selector in table) {
        let res: string[] = [];
        res.push(...Object.keys(table[selector]['string']));
        res.push(...Object.keys(table[selector]['number']));
        res.push(...Object.keys(table[selector]['boolean']));
        res = [...new Set(res)];
        return res;
    } else {
        return [];
    }
}

/**
 * A helper that returns names of all variables for a process or routine with their data types.
 * If there are multiple variables with same name and different data types, all those data types
 * will also be returned in array.
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `process` or `routine`
 * @returns an object with key-value pairs of variable names and array of corresponding data types
 */
function _getTableVariableNamesWithTypes(
    selector: string,
    tableName: 'process' | 'routine'
): { [variable: string]: TDataName[] } {
    const table = tableName === 'process' ? _processTable : _routineTable;
    if (!(selector in table)) {
        return {};
    }

    const res: { [variable: string]: TDataName[] } = {};

    Object.entries(table[selector]['string']).forEach(([variable, { dataType }]) => {
        if (!(variable in res)) {
            res[variable] = [];
        }
        res[variable].push(dataType);
    });
    Object.entries(table[selector]['number']).forEach(([variable, { dataType }]) => {
        if (!(variable in res)) {
            res[variable] = [];
        }
        res[variable].push(dataType);
    });
    Object.entries(table[selector]['boolean']).forEach(([variable, { dataType }]) => {
        if (!(variable in res)) {
            res[variable] = [];
        }
        res[variable].push(dataType);
    });
    return res;
}

/**
 * A helper that returns names of all process or routine variables.
 * @param tableName - `process` or `routine`
 * @returns an object with key-value pairs of process or routine names and corresponding list of all
 * variable names in an array
 */
function _getTableVariableNamesAll(tableName: 'process' | 'routine'): {
    [key: string]: string[];
} {
    const table = tableName === 'process' ? _processTable : _routineTable;
    const res: { [key: string]: string[] } = {};
    Object.entries(table).forEach(([key, variables]) => {
        res[key] = [];
        res[key].push(...Object.keys(variables['string']));
        res[key].push(...Object.keys(variables['number']));
        res[key].push(...Object.keys(variables['boolean']));
        res[key] = [...new Set(res[key])];
    });
    return res;
}

/**
 * A helper that returns names and types of all process or routine variables.
 * @param tableName - `process` or `routine`
 * @returns an object with key-value pairs of process or routine names and corresponding object with
 * key-value pairs of variable names and data types array.
 */
function _getTableVariableNamesWithTypesAll(tableName: 'process' | 'routine'): {
    [key: string]: { [variable: string]: TDataName[] };
} {
    const table = tableName === 'process' ? _processTable : _routineTable;
    const res: { [key: string]: { [variable: string]: TDataName[] } } = {};
    Object.entries(table).forEach(([key, variables]) => {
        res[key] = {};
        Object.entries(variables['string']).forEach(([variable, { dataType }]) => {
            if (!(variable in res[key])) {
                res[key][variable] = [];
            }
            res[key][variable].push(dataType);
        });
        Object.entries(variables['number']).forEach(([variable, { dataType }]) => {
            if (!(variable in res[key])) {
                res[key][variable] = [];
            }
            res[key][variable].push(dataType);
        });
        Object.entries(variables['boolean']).forEach(([variable, { dataType }]) => {
            if (!(variable in res[key])) {
                res[key][variable] = [];
            }
            res[key][variable].push(dataType);
        });
    });
    return res;
}

/**
 * Removes a variable for a process or routine if present.
 * @param variable - name of the variable
 * @param dataType - type of the variable
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `process` or `routine`
 */
function _removeTableVariable(
    variable: string,
    dataType: TDataName,
    selector: string,
    tableName: 'process' | 'routine'
): void {
    const table = tableName === 'process' ? _processTable : _routineTable;
    if (selector in table && variable in table[selector][dataType]) {
        delete table[selector][dataType][variable];
    }
}

/**
 * A helper that clears all variables for a process or routine.
 * @param selector - the key to be used for selection (project ID or routine ID)
 * @param tableName - `process` or `routine`
 */
function _flushTableVariables(selector: string, tableName: 'process' | 'routine'): void {
    const table = tableName === 'process' ? _processTable : _routineTable;
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
export function addGlobalVariable(variable: string, dataType: TDataName, value: TData): void {
    _globalTable[dataType][variable] = { dataType, value };
}

/**
 * Fetches a global variable.
 * If the optional arg `dataType` is `undefined`, it will try to fetch the global variable in the
 * given order of data types - string, number, boolean.
 * @param variable - name of the variable
 * @param dataType - (optional) type of the variable
 * @returns the variable entry if present, else `null`
 */
export function getGlobalVariable(variable: string, dataType?: TDataName): IVariable | null {
    if (dataType != undefined) {
        return variable in _globalTable[dataType] ? _globalTable[dataType][variable] : null;
    } else {
        if (variable in _globalTable['string']) {
            return _globalTable['string'][variable];
        } else if (variable in _globalTable['number']) {
            return _globalTable['number'][variable];
        } else if (variable in _globalTable['boolean']) {
            return _globalTable['boolean'][variable];
        } else return null;
    }
}

/**
 * Returns names of all global variables.
 * @returns a list of all global variable names
 */
export function getGlobalVariableNames(): string[] {
    let res: string[] = [];
    res.push(...Object.keys(_globalTable['string']));
    res.push(...Object.keys(_globalTable['boolean']));
    res.push(...Object.keys(_globalTable['number']));
    res = [...new Set(res)];
    return res;
}

/**
 * Returns names of all global variables with their corresponding data types.
 * @returns object with key-value pairs of variable names and corresponding data types in an array
 */
export function getGlobalVariableNamesWithTypes(): { [variable: string]: TDataName[] } {
    const table: { [variable: string]: TDataName[] } = {};

    Object.entries(_globalTable['string']).forEach(([variable, { dataType }]) => {
        if (!(variable in table)) {
            table[variable] = [];
        }
        table[variable].push(dataType);
    });
    Object.entries(_globalTable['number']).forEach(([variable, { dataType }]) => {
        if (!(variable in table)) {
            table[variable] = [];
        }
        table[variable].push(dataType);
    });
    Object.entries(_globalTable['boolean']).forEach(([variable, { dataType }]) => {
        if (!(variable in table)) {
            table[variable] = [];
        }
        table[variable].push(dataType);
    });

    return table;
}

/**
 * Removes a global variable if present.
 * If the `dataType` is passed as an argument, function will remove the variable name of the
 * specific data type.
 * If the `dataType` is `undefined`, function will remove all variables with the given variable name
 * @param variable - name of the variable
 * @param dataType - (optional) type of the variable
 */
export function removeGlobalVariable(variable: string, dataType?: TDataName): void {
    if (dataType != undefined) {
        if (variable in _globalTable[dataType]) {
            delete _globalTable[dataType][variable];
        }
    } else {
        if (variable in _globalTable['string']) {
            delete _globalTable['string'][variable];
        }
        if (variable in _globalTable['number']) {
            delete _globalTable['number'][variable];
        }
        if (variable in _globalTable['boolean']) {
            delete _globalTable['boolean'][variable];
        }
    }
}

/**
 * Adds a variable for a process. If already present, overwrites it.
 * @param variable - name of the variable
 * @param dataType - data type of the variable
 * @param value - value of the variable
 * @param process - ID of the process
 */
export function addProcessVariable(
    variable: string,
    dataType: TDataName,
    value: TData,
    process: string
): void {
    _addTableVariable(variable, dataType, value, process, 'process');
}

/**
 * Fetches a variable for a process.
 * If the optional arg `dataType` is `undefined`, it will fetch the variable in the given order of
 * data types - string, number, boolean for the process.
 * @param variable - name of the variable
 * @param process - ID of the process
 * @param dataType - (optional) type of the variable.
 * @returns the variable entry if present, else `null`
 */
export function getProcessVariable(
    variable: string,
    process: string,
    dataType?: TDataName
): IVariable | null {
    return _getTableVariable(variable, process, 'process', dataType);
}

/**
 * Returns names of all variables for a process.
 * @param process - ID of the process
 * @returns a list of all variable names for a process
 */
export function getProcessVariableNames(process: string): string[] {
    return _getTableVariableNames(process, 'process');
}

/**
 * Returns names of all variables for a process with their data types.
 * @param process - ID of the process
 * @returns an object with key-value pairs of variable names and array of corresponding data types
 */
export function getProcessVariableNamesWithTypes(process: string): {
    [variable: string]: TDataName[];
} {
    return _getTableVariableNamesWithTypes(process, 'process');
}

/**
 * Returns names of all process variables.
 * @returns an object with key-value pairs of process names and corresponding list of all  variable
 * names in an array
 */
export function getProcessVariableNamesAll(): { [process: string]: string[] } {
    return _getTableVariableNamesAll('process');
}

/**
 * Returns names and types of all process variables.
 * @returns an object with key-value pairs of process names and corresponding object with key-value
 * pairs of variable names and data types array.
 */
export function getProcessVariableNamesWithTypesAll(): {
    [process: string]: { [variable: string]: TDataName[] };
} {
    return _getTableVariableNamesWithTypesAll('process');
}

/**
 * Removes a variable for a process if present.
 * @param variable - name of the variable
 * @param dataType - type of the variable
 * @param process - ID of the process
 */
export function removeProcessVariable(
    variable: string,
    dataType: TDataName,
    process: string
): void {
    _removeTableVariable(variable, dataType, process, 'process');
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
    dataType: TDataName,
    value: TData,
    routine: string
): void {
    _addTableVariable(variable, dataType, value, routine, 'routine');
}

/**
 * Fetches a variable for a routine.
 * If the optional arg `dataType` is `undefined`, it will fetch the variable in the given order of
 * data types - string, number, boolean for the routine.
 * @param variable - name of the variable
 * @param routine - ID of the routine
 * @param dataType - (optional) type of the variable.
 * @returns the variable entry if present, else `null`
 */
export function getRoutineVariable(
    variable: string,
    routine: string,
    dataType?: TDataName
): IVariable | null {
    return _getTableVariable(variable, routine, 'routine', dataType);
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
 * @returns an object with key-value pairs of variable names and array of corresponding data types
 */
export function getRoutineVariableNamesWithTypes(routine: string): {
    [variable: string]: TDataName[];
} {
    return _getTableVariableNamesWithTypes(routine, 'routine');
}

/**
 * Returns names of all routine variables.
 * @returns an object with key-value pairs of routine names and corresponding list of all variable
 * names in an array
 */
export function getRoutineVariableNamesAll(): { [routine: string]: string[] } {
    return _getTableVariableNamesAll('routine');
}

/**
 * Returns names and types of all routine variables.
 * @returns an object with key-value pairs of routine names and corresponding object with key-value
 * pairs of variable names and data types array.
 */
export function getRoutineVariableNamesWithTypesAll(): {
    [routine: string]: { [variable: string]: TDataName[] };
} {
    return _getTableVariableNamesWithTypesAll('routine');
}

/**
 * Removes a variable for a routine if present.
 * @param variable - name of the variable
 * @param dataType - type of the variable
 * @param routine - ID of the routine
 */
export function removeRoutineVariable(
    variable: string,
    dataType: TDataName,
    routine: string
): void {
    _removeTableVariable(variable, dataType, routine, 'routine');
}

/**
 * Clears all global variables.
 */
export function flushGlobalVariables(): void {
    _globalTable = { string: {}, number: {}, boolean: {} };
}

/**
 * Clears all variables for a process.
 * @param process - 0 ID of the process
 */
export function flushProcessVariables(process: string): void {
    _flushTableVariables(process, 'process');
}

/**
 * Clears all process variables.
 */
export function flushProcessVariablesAll(): void {
    _processTable = {};
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
    flushProcessVariablesAll();
    flushRoutineVariablesAll();
}
