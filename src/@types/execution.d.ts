/** Type describing a variable entry in symbol table. */
export type IVariable = {
    dataType: TDataName;
    value: TData;
};

/** Type definition of the parsed argument element entry returned on fetching next element. */
type IParsedElementArgument = {
    instance: ElementData<TData> | ElementExpression<TData>;
    type: 'Argument';
    marker: string | null;
};

/** Type definition of the parsed instruction element entry returned on fetching next element. */
type IParsedElementInstruction = {
    instance: ElementStatement | ElementBlock;
    type: 'Instruction';
    marker: string | null;
};

/** Type definition of the parsed element entry returned on fetching next element. */
type IParsedElement = IParsedElementArgument | IParsedElementInstruction;
