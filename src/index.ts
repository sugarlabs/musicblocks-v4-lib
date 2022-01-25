// -- execution ------------------------------------------------------------------------------------

import * as interpreter from './execution/interpreter';
import * as parser from './execution/parser';
import * as symbolTable from './execution/symbolTable';

export const engine = {
    interpreter,
    parser,
    symbolTable,
};

// -- syntax ---------------------------------------------------------------------------------------

import * as warehouse from './syntax/warehouse/warehouse';
import * as syntaxTree from './syntax/tree/syntaxTree';
import * as specification from './syntax/specification/specification';

export const syntax = {
    warehouse,
    specification,
    tree: syntaxTree,
};

// -- library --------------------------------------------------------------------------------------

import * as libSpecification from './library/specification';
import * as elementBox from './library/elements/elementBox';
import * as elementBoxIdentifier from './library/elements/elementBoxIdentifier';
import * as elementConditional from './library/elements/elementConditional';
import * as elementLoop from './library/elements/elementLoop';
import * as elementOperatorMath from './library/elements/elementOperatorMath';
import * as elementPrint from './library/elements/elementPrint';
import * as elementProgram from './library/elements/elementProgram';
import * as elementValue from './library/elements/elementValue';

export const library = {
    specification: libSpecification,
    elements: {
        elementBox,
        elementBoxIdentifier,
        elementConditional,
        elementLoop,
        elementOperatorMath,
        elementPrint,
        elementProgram,
        elementValue,
    },
};

// -- types ----------------------------------------------------------------------------------------

export { TData, TDataName } from './@types/data';
export {
    IElementSyntax,
    IElementArgument,
    IElementData,
    IElementExpression,
    IElementInstruction,
    IElementStatement,
    IElementBlock,
} from './@types/elements';
export {
    IVariable,
    IParsedElementArgument,
    IParsedElementInstruction,
    IParsedElement,
    TPCOverride,
} from './@types/execution';
export {
    TElementKind,
    TElementType,
    TElementNameData,
    TElementNameExpression,
    TElementNameStatement,
    TElementNameBlock,
    TElementName,
    IElementSpecificationData,
    IElementSpecificationEntryData,
    IElementSpecificationExpression,
    IElementSpecificationEntryExpression,
    IElementSpecificationInstruction,
    IElementSpecificationStatement,
    IElementSpecificationEntryStatement,
    IElementSpecificationBlock,
    IElementSpecificationEntryBlock,
    IElementSpecification,
} from './@types/specification';
export {
    ITreeSnapshotDataInput,
    ITreeSnapshotData,
    ITreeSnapshotExpressionInput,
    ITreeSnapshotExpression,
    ITreeSnapshotStatementInput,
    ITreeSnapshotStatement,
    ITreeSnapshotBlockInput,
    ITreeSnapshotBlock,
    ITreeSnapshotInput,
    ITreeSnapshot,
    ITreeNode,
    ITreeNodeArgument,
    ITreeNodeData,
    ITreeNodeExpression,
    ITreeNodeInstruction,
    ITreeNodeStatement,
    ITreeNodeBlock,
} from './@types/syntaxTree';
