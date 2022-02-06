// == SYNTAX =======================================================================================

// -- elements -------------------------------------------------------------------------------------

export { TData, TDataName } from './@types/data';

export { ElementData, ElementExpression } from './syntax/elements/elementArgument';
export { ElementStatement, ElementBlock } from './syntax/elements/elementInstruction';

// -- specification --------------------------------------------------------------------------------

export { IElementSpecification } from './@types/specification';

export {
    registerElementSpecificationEntry,
    registerElementSpecificationEntries,
    removeElementSpecificationEntry,
    removeElementSpecificationEntries,
    queryElementSpecification,
    getElementNames,
    getElementCategories,
    resetElementSpecificationTable,
    getSpecificationSnapshot,
    checkValueAssignment,
} from './syntax/specification/specification';

// -- syntax tree ----------------------------------------------------------------------------------

export { ITreeSnapshotInput } from './@types/syntaxTree';

export {
    getProcessNodes,
    getRoutineNodes,
    getCrumbs,
    getNode,
    generateSnapshot,
    generateFromSnapshot,
    resetSyntaxTree,
    assignNodeValue,
} from './syntax/tree/syntaxTree';

// -- warehouse ------------------------------------------------------------------------------------

export {
    getInstance,
    getNameCount,
    getNameCountAll,
    getTypeCount,
    getTypeCountAll,
    getKindCount,
    getKindCountAll,
    getCategoryCount,
    getCategoryCountAll,
} from './syntax/warehouse/warehouse';

// == EXECUTION ====================================================================================

export { TPCOverride } from './@types/execution';

export {
    declareVariable,
    queryVariable,
    overrideProgramCounter,
    releaseProgramCounter,
    run,
} from './execution/interpreter';

// == LIBRARY ======================================================================================

// -- specification --------------------------------------------------------------------------------

export { default as librarySpecification } from './library/specification';

// -- elements -------------------------------------------------------------------------------------

export {
    ElementValueBoolean,
    ElementValueNumber,
    ElementValueString,
} from './library/elements/elementValue';

export {
    ElementBoxGeneric,
    ElementBoxBoolean,
    ElementBoxNumber,
    ElementBoxString,
} from './library/elements/elementBox';

export {
    ElementBoxIdentifierGeneric,
    ElementBoxIdentifierBoolean,
    ElementBoxIdentifierNumber,
    ElementBoxIdentifierString,
} from './library/elements/elementBoxIdentifier';

export {
    ElementOperatorMathPlus,
    ElementOperatorMathMinus,
    ElementOperatorMathTimes,
    ElementOperatorMathDivide,
    ElementOperatorMathModulus,
} from './library/elements/elementOperatorMath';

export { ElementIf } from './library/elements/elementConditional';

export { ElementRepeat } from './library/elements/elementLoop';

export { ElementPrint } from './library/elements/elementPrint';

export { ElementProcess, ElementRoutine } from './library/elements/elementProgram';
