/** Type describing a variable entry in symbol table. */
export type IVariable = {
    dataType: TDataName;
    value: TData;
};

/** Type definition of the parsed argument element entry returned on fetching next element. */
export type IParsedElementArgument = {
    instance: ElementData<TData> | ElementExpression<TData>;
    type: 'Argument';
    marker: string | null;
};

/** Type definition of the parsed instruction element entry returned on fetching next element. */
export type IParsedElementInstruction = {
    instance: ElementStatement | ElementBlock;
    type: 'Instruction';
    marker: string | null;
};

/** Type definition of the parsed element entry returned on fetching next element. */
export type IParsedElement = IParsedElementArgument | IParsedElementInstruction;

/* Type definition for program counter override signals. */
export type TPCOverride =
    | '__rollback__'
    | '__rollback__i'
    | '__skip__'
    | '__skipscope__'
    | '__goinnerfirst__'
    | '__goinnerlast__'
    | '__goup__'
    | '__repeat__'
    | null;
