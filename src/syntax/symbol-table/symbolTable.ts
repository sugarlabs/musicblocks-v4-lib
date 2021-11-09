import { TData, TDataName } from '@/@types/syntax/data';
import { ISymbolTable, IVariable, IVariableTable } from '@/@types/syntax/symbolTable';

/**
 * @class
 * Defines the symbol table that stores the defined variables with  their values and types.
 */
export class SymbolTable implements ISymbolTable {
    /** Stores the global table. */
    private _globalTable: IVariableTable;
    /** Stores the programs' tables. */
    private _programTable: {
        [key: string]: IVariableTable;
    };
    /** Stores the routines' table. */
    private _routineTable: {
        [key: string]: IVariableTable;
    };

    constructor() {
        this._globalTable = {};
        this._programTable = {};
        this._routineTable = {};
    }

    public addGlobalVariable(variable: string, dataType: 'number', value: number): void;
    public addGlobalVariable(variable: string, dataType: 'string', value: string): void;
    public addGlobalVariable(variable: string, dataType: 'boolean', value: boolean): void;
    public addGlobalVariable(variable: string, dataType: TDataName, value: TData): void {
        this._globalTable[variable] = { dataType, value };
    }

    public getGlobalVariable(variable: string): IVariable | null {
        return variable in this._globalTable ? this._globalTable[variable] : null;
    }

    public getGlobalVariableNames(): string[] {
        return Object.keys(this._globalTable);
    }

    public getGlobalVariableNamesWithTypes(): { [variable: string]: TDataName } {
        const table: { [variable: string]: TDataName } = {};
        Object.entries(this._globalTable).forEach(([variable, { dataType }]) => {
            table[variable] = dataType;
        });
        return table;
    }

    public removeGlobalVariable(variable: string): void {
        if (variable in this._globalTable) {
            delete this._globalTable[variable];
        }
    }

    /**
     * A helper that adds a variable for a program or routine. If already present, overwrites it.
     * @param variable - name of the variable
     * @param dataType - data type of the variable
     * @param value - value of the variable
     * @param selector - the key to be used for selection (project ID or routine ID)
     * @param tableName - `program` or `routine`
     */
    private _addTableVariable(
        variable: string,
        dataType: TDataName,
        value: TData,
        selector: string,
        tableName: 'program' | 'routine'
    ): void {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
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
    private _getTableVariable(
        variable: string,
        selector: string,
        tableName: 'program' | 'routine'
    ): IVariable | null {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
        return selector in table && variable in table[selector] ? table[selector][variable] : null;
    }

    /**
     * A helper that returns names of all variables for a program or routine.
     * @param selector - the key to be used for selection (project ID or routine ID)
     * @param tableName - `program` or `routine`
     * @returns a list of all variable names for a program or routine
     */
    private _getTableVariableNames(selector: string, tableName: 'program' | 'routine'): string[] {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
        return selector in table ? Object.keys(table[selector]) : [];
    }

    /**
     * A helper that returns names of all variables for a program or routine with their data types.
     * @param selector - the key to be used for selection (project ID or routine ID)
     * @param tableName - `program` or `routine`
     * @returns an object with key-value pairs of variable names and corresponding data type
     */
    private _getTableVariableNamesWithTypes(
        selector: string,
        tableName: 'program' | 'routine'
    ): { [variable: string]: TDataName } {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
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
    private _getTableVariableNamesAll(tableName: 'program' | 'routine'): {
        [key: string]: string[];
    } {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
        const res: { [key: string]: string[] } = {};
        Object.entries(table).forEach(([key, variables]) => {
            res[key] = Object.keys(variables);
        });
        return res;
    }

    /**
     * A helper that returns names and types of all program or routine variables.
     * @param tableName - `program` or `routine`
     * @returns an object with key-value pairs of program or routine names and corresponding object
     * with key-value pairs of variable names and data types.
     */
    private _getTableVariableNamesWithTypesAll(tableName: 'program' | 'routine'): {
        [key: string]: { [variable: string]: TDataName };
    } {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
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
    private _removeTableVariable(
        variable: string,
        selector: string,
        tableName: 'program' | 'routine'
    ): void {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
        if (selector in table && variable in table[selector]) {
            delete table[selector][variable];
        }
    }

    public addProgramVariable(
        variable: string,
        dataType: 'number',
        value: number,
        program: string
    ): void;
    public addProgramVariable(
        variable: string,
        dataType: 'string',
        value: string,
        program: string
    ): void;
    public addProgramVariable(
        variable: string,
        dataType: 'boolean',
        value: boolean,
        program: string
    ): void;
    public addProgramVariable(
        variable: string,
        dataType: TDataName,
        value: TData,
        program: string
    ): void {
        this._addTableVariable(variable, dataType, value, program, 'program');
    }

    public getProgramVariable(variable: string, program: string): IVariable | null {
        return this._getTableVariable(variable, program, 'program');
    }

    public getProgramVariableNames(program: string): string[] {
        return this._getTableVariableNames(program, 'program');
    }

    public getProgramVariableNamesWithTypes(program: string): { [variable: string]: TDataName } {
        return this._getTableVariableNamesWithTypes(program, 'program');
    }

    public getProgramVariableNamesAll(): { [program: string]: string[] } {
        return this._getTableVariableNamesAll('program');
    }

    public getProgramVariableNamesWithTypesAll(): {
        [program: string]: { [variable: string]: TDataName };
    } {
        return this._getTableVariableNamesWithTypesAll('program');
    }

    public removeProgramVariable(variable: string, program: string): void {
        this._removeTableVariable(variable, program, 'program');
    }

    public addRoutineVariable(
        variable: string,
        dataType: 'number',
        value: number,
        routine: string
    ): void;
    public addRoutineVariable(
        variable: string,
        dataType: 'string',
        value: string,
        routine: string
    ): void;
    public addRoutineVariable(
        variable: string,
        dataType: 'boolean',
        value: boolean,
        routine: string
    ): void;
    public addRoutineVariable(
        variable: string,
        dataType: TDataName,
        value: TData,
        routine: string
    ): void {
        this._addTableVariable(variable, dataType, value, routine, 'routine');
    }

    public getRoutineVariable(variable: string, routine: string): IVariable | null {
        return this._getTableVariable(variable, routine, 'routine');
    }

    public getRoutineVariableNames(routine: string): string[] {
        return this._getTableVariableNames(routine, 'routine');
    }

    public getRoutineVariableNamesWithTypes(routine: string): { [variable: string]: TDataName } {
        return this._getTableVariableNamesWithTypes(routine, 'routine');
    }

    public getRoutineVariableNamesAll(): { [routine: string]: string[] } {
        return this._getTableVariableNamesAll('routine');
    }

    public getRoutineVariableNamesWithTypesAll(): {
        [routine: string]: { [variable: string]: TDataName };
    } {
        return this._getTableVariableNamesWithTypesAll('routine');
    }

    public removeRoutineVariable(variable: string, routine: string): void {
        this._removeTableVariable(variable, routine, 'routine');
    }

    public flushGlobalVariables(): void {
        this._globalTable = {};
    }

    /**
     * A helper that clears all variables for a program or routine.
     * @param selector - the key to be used for selection (project ID or routine ID)
     * @param tableName - `program` or `routine`
     */
    private _flushTableVariables(selector: string, tableName: 'program' | 'routine'): void {
        const table = tableName === 'program' ? this._programTable : this._routineTable;
        if (selector in table) {
            delete table[selector];
        }
    }

    public flushProgramVariables(program: string): void {
        this._flushTableVariables(program, 'program');
    }

    public flushProgramVariablesAll(): void {
        this._programTable = {};
    }

    public flushRoutineVariables(routine: string): void {
        this._flushTableVariables(routine, 'routine');
    }

    public flushRoutineVariablesAll(): void {
        this._routineTable = {};
    }

    public flushAllVariables(): void {
        this.flushGlobalVariables();
        this.flushProgramVariablesAll();
        this.flushRoutineVariablesAll();
    }
}
