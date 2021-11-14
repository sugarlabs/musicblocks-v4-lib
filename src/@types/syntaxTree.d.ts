import {
    TElementNameData,
    TElementNameExpression,
    TElementNameStatement,
    TElementNameBlock,
    TElementName,
} from './specification';

// -- snapshots ------------------------------------------------------------------------------------

/** Type definition for the snapshot of a data element. */
export interface ITreeSnapshotData {
    /** Name of the data element. */
    elementName: TElementNameData;
}

/** Type definition for the snapshot of an expression element. */
export interface ITreeSnapshotExpression {
    /** Name of the expression element. */
    elementName: TElementNameExpression;
    /** Object with key-value pairs of argument name and snapshot of the corresponding argument. */
    argMap: { [argName: string]: ITreeSnapshotData | ITreeSnapshotExpression | null } | null;
}

/** Type definition for the snapshot of a statement element. */
export interface ITreeSnapshotStatement {
    /** Name of the statement element. */
    elementName: TElementNameStatement;
    /** Object with key-value pairs of argument name and snapshot of the corresponding argument. */
    argMap: { [argName: string]: ITreeSnapshotData | ITreeSnapshotExpression | null } | null;
}

/** Type definition for the snapshot of a block element. */
export interface ITreeSnapshotBlock {
    /** Name of the block element. */
    elementName: TElementNameBlock;
    /** Object with key-value pairs of argument name and snapshot of the corresponding argument. */
    argMap: { [argName: string]: ITreeSnapshotData | ITreeSnapshotExpression | null } | null;
    /** List of snaphots of the elements nested in the block. */
    scope: (ITreeSnapshotStatement | ITreeSnapshotBlock)[];
}

/** Type definition for the snapshot of the entire syntax tree. */
export interface ITreeSnapshot {
    /** List of snapshots of all process elements. */
    process: ITreeSnapshotBlock[];
    /** List of snapshots of all routine elements. */
    routine: ITreeSnapshotBlock[];
    /** List of snapshot lists of all non-process and non-routine element stacks. */
    crumbs: (
        | ITreeSnapshotData
        | ITreeSnapshotExpression
        | ITreeSnapshotStatement
        | ITreeSnapshotBlock
    )[][];
}

// -- nodes ----------------------------------------------------------------------------------------

/** Type definition for the class that implements a generic syntax tree node. */
interface ITreeNode {
    /** Name of the syntax element. */
    elementName: TElementName;
    /** Node ID of the syntax tree node instance. */
    nodeID: string;
    /** Warehouse ID of the syntax element instance. */
    instanceID: string;
}

/** Type definition for a generic syntax tree argument node. */
export interface ITreeNodeArgument extends ITreeNode {
    /** Syntax tree node reference to the connector syntax tree node. */
    connectedTo: Exclude<ITreeNode, ITreeNodeData> | null;
}

/** Type definition for the class that implements a syntax tree data node. */
export interface ITreeNodeData extends ITreeNodeArgument {
    /** Name of the data element. */
    elementName: TElementNameData;
    /** Returns a snapshot of the syntax tree data node. */
    snapshot: ITreeSnapshotData;
}

/** Type definition for the class that implements a syntax tree expression node. */
export interface ITreeNodeExpression extends ITreeNodeArgument {
    /** Name of the expression element. */
    elementName: TElementNameExpression;
    /** Returns a snapshot of the syntax tree expression node. */
    snapshot: ITreeSnapshotExpression;
    /**
     * Adds an argument connection.
     * @param argName - name of the argument
     * @param node - node instance of the connecting node
     */
    public attachArg(argName: string, node: ITreeNodeData | ITreeNodeExpression): void;
    /**
     * Removes an argument connection.
     * @param argName - name of the argument
     */
    public detachArg(argName: string): void;
}

/** Type definition for a generic syntax tree instruction node. */
export interface ITreeNodeInstruction extends ITreeNode {
    /**
     * Adds an argument connection.
     * @param argName - name of the argument
     * @param node - node instance of the connecting node
     */
    public attachArg(argName: string, node: ITreeNodeData | ITreeNodeExpression): void;
    /**
     * Removes an argument connection.
     * @param argName - name of the argument
     */
    public detachArg(argName: string): void;
    /** Syntax tree node reference of the preceding instruction element. */
    beforeConnection: ITreeNodeInstruction | null;
    /** Syntax tree node reference of the following instruction element. */
    afterConnection: ITreeNodeInstruction | null;
    /** Syntax tree node reference of the block element which nests this node. */
    parentBlock: TreeNodeBlock | null;
    /** Nest level of this node. */
    nestLevel: number;
}

/** Type definition for the class that implements a syntax tree statement node. */
export interface ITreeNodeStatement extends ITreeNodeInstruction {
    /** Name of the statement element. */
    elementName: TElementNameStatement;
    /** Returns a snapshot of the syntax tree statement node. */
    snapshot: ITreeSnapshotStatement;
}

/** Type definition for the class that implements a syntax tree block node. */
export interface ITreeNodeBlock extends ITreeNodeInstruction {
    /** Name of the block element. */
    elementName: TElementNameBlock;
    /** Returns a snapshot of the syntax tree block node. */
    snapshot: ITreeSnapshotBlock;
    /** Syntax tree node reference of the first nested instruction element. */
    innerConnection: ITreeNodeInstruction | null;
    /** Number of nodes nested inside this node. */
    innerCount: number;
}
