import { TData, TDataName } from '@/@types/data';
import { IVariable, TPCOverride } from '@/@types/execution';

import { addGlobalVariable, getGlobalVariable } from './symbolTable';
import { setPCOverride, clearPCOverride } from './parser';

// -- public functions -----------------------------------------------------------------------------

/**
 * Adds a new variable entry to the symbol table.
 * @param variable - name of the variable
 * @param dataType - data type of the variable
 * @param value - value of the variable
 */
export function declareVariable(variable: string, dataType: 'number', value: number): void;
export function declareVariable(variable: string, dataType: 'string', value: string): void;
export function declareVariable(variable: string, dataType: 'boolean', value: boolean): void;
export function declareVariable(variable: string, dataType: TDataName, value: TData): void {
    addGlobalVariable(variable, dataType, value);
}

/**
 * Fetches a variable entry from the symbol table.
 * @param variable - name of the variable
 * @returns the variable entry if present, else `null`
 */
export function queryVariable(variable: string): IVariable | null {
    return getGlobalVariable(variable);
}

/**
 * Sets a program counter override signal for the current execution item.
 * @param signal - program counter override signal
 */
export function overrideProgramCounter(signal: TPCOverride): void {
    setPCOverride(signal);
}

/**
 * Clears any program counter override signal for the current execution item.
 */
export function releaseProgramCounter(): void {
    clearPCOverride();
}
