import { TData, TDataName } from './data';

/** Object describing a variable entry. */
export type IVariable = {
    dataType: TDataName;
    value: TData;
};

/** Object describing a set of variables. */
export type IVariableTable = {
    [variable: string]: IVariable;
};

/** Interface for the class that implements the symbol table. */
export interface ISymbolTable {
    /**
     * Adds a global variable. If already present, overwrites it.
     * @param variable - name of the variable
     * @param dataType - data type of the variable
     * @param value - value of the variable
     */
    addGlobalVariable(variable: string, dataType: TDataName, value: TData): void;
    /**
     * Fetches a global variable.
     * @param variable - name of the variable
     * @returns the variable entry if present, else `null`
     */
    getGlobalVariable(variable: string): IVariable | null;
    /**
     * Returns names of all global variables.
     * @returns a list of all global variable names
     */
    getGlobalVariableNames(): string[];
    /**
     * Returns names of all global variables with their data types.
     * @returns an object with key-value pairs of variable names and corresponding data type
     */
    getGlobalVariableNamesWithTypes(): { [variable: string]: TDataName };
    /**
     * Removes a global variable if present.
     * @param variable - name of the variable
     */
    removeGlobalVariable(variable: string): void;
    /**
     * Adds a variable for a program. If already present, overwrites it.
     * @param variable - name of the variable
     * @param dataType - data type of the variable
     * @param value - value of the variable
     * @param program - ID of the program
     */
    addProgramVariable(variable: string, dataType: TDataName, value: TData, program: string): void;
    /**
     * Fetches a variable for a program.
     * @param variable - name of the variable
     * @param program - ID of the program
     * @returns the variable entry if present, else `null`
     */
    getProgramVariable(variable: string, program: string): IVariable | null;
    /**
     * Returns names of all variables for a program.
     * @param program - ID of the program
     * @returns a list of all variable names for a program
     */
    getProgramVariableNames(program: string): string[];
    /**
     * Returns names of all variables for a program with their data types.
     * @param program - ID of the program
     * @returns an object with key-value pairs of variable names and corresponding data type
     */
    getProgramVariableNamesWithTypes(program: string): { [variable: string]: TDataName };
    /**
     * Returns names of all program variables.
     * @returns an object with key-value pairs of program names and corresponding list of variable
     * names
     */
    getProgramVariableNamesAll(): { [program: string]: string[] };
    /**
     * Returns names and types of all program variables.
     * @returns an object with key-value pairs of program names and corresponding object with key-value
     * pairs of variable names and data types.
     */
    getProgramVariableNamesWithTypesAll(): { [program: string]: { [variable: string]: TDataName } };
    /**
     * Removes a variable for a program if present.
     * @param variable - name of the variable
     * @param program - ID of the program
     */
    removeProgramVariable(variable: string, program: string): void;
    /**
     * Adds a variable for a routine. If already present, overwrites it.
     * @param variable - name of the variable
     * @param dataType - data type of the variable
     * @param value - value of the variable
     * @param routine - ID of the routine
     */
    addRoutineVariable(variable: string, dataType: TDataName, value: TData, routine: string): void;
    /**
     * Fetches a variable for a routine.
     * @param variable - name of the variable
     * @param routine - ID of the routine
     * @returns the variable entry if present, else `null`
     */
    getRoutineVariable(variable: string, routine: string): IVariable | null;
    /**
     * Returns names of all variables for a routine.
     * @param routine - ID of the routine
     * @returns a list of all variable names for a routine
     */
    getRoutineVariableNames(routine: string): string[];
    /**
     * Returns names of all variables for a routine with their data types.
     * @param routine - ID of the routine
     * @returns an object with key-value pairs of variable names and corresponding data type
     */
    getRoutineVariableNamesWithTypes(routine: string): { [variable: string]: TDataName };
    /**
     * Returns names of all routine variables.
     * @returns an object with key-value pairs of routine names and corresponding list of variable
     * names
     */
    getRoutineVariableNamesAll(): { [routine: string]: string[] };
    /**
     * Returns names and types of all routine variables.
     * @returns an object with key-value pairs of routine names and corresponding object with key-value
     * pairs of variable names and data types.
     */
    getRoutineVariableNamesWithTypesAll(): { [routine: string]: { [variable: string]: TDataName } };
    /**
     * Removes a variable for a routine if present.
     * @param variable - name of the variable
     * @param routine - ID of the routine
     */
    removeRoutineVariable(variable: string, routine: string): void;
    /**
     * Clears all global variables.
     */
    flushGlobalVariables(): void;
    /**
     * Clears all variables for a program.
     * @param program - 0 ID of the program
     */
    flushProgramVariables(program: string): void;
    /**
     * Clears all program variables.
     */
    flushProgramVariablesAll(): void;
    /**
     * Clears all variables for a routine.
     * @param routine - ID of the routine
     */
    flushRoutineVariables(routine: string): void;
    /**
     * Clears all routine variables.
     */
    flushRoutineVariablesAll(): void;
    /**
     * Clears all variable tables.
     */
    flushAllVariables(): void;
}
