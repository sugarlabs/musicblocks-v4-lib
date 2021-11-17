import { IParsedElement } from '@/@types/execution';

import {
    TreeNode,
    TreeNodeData,
    TreeNodeExpression,
    TreeNodeStatement,
    TreeNodeBlock,
} from '@/syntax/tree/node';

import { getProcessNodes, getRoutineNodes, getCrumbs } from '@/syntax/tree/syntaxTree';

import { getInstance } from '@/syntax/warehouse/warehouse';

import { TData } from '@/@types/data';
import { ElementData, ElementExpression } from '@/syntax/elements/core/elementArgument';
import { ElementBlock, ElementStatement } from '@/syntax/elements/core/elementInstruction';

// -- private variables ----------------------------------------------------------------------------

/** Stores the list of process element nodes. */
let _processNodes: TreeNodeBlock[] = [];
/** Stores the list of routine element nodes. */
let _routineNodes: TreeNodeBlock[] = [];
/** Stores the list of crumb stack top element nodes. */
let _crumbNodes: TreeNode[] = [];

/** Type definition for an execution call stack frame. */
interface IFrame {
    node: TreeNode;
    pages: { node: TreeNode; marker: string }[] | null;
}

/** Maintains the parsing state. */
let _programMap: {
    process: {
        [nodeID: string]: {
            node: TreeNodeStatement | TreeNodeBlock;
            frames: IFrame[];
            pc: TreeNode | null;
        };
    };
    routine: {
        [nodeID: string]: {
            node: TreeNodeStatement | TreeNodeBlock;
            frames: IFrame[];
            pc: TreeNode | null;
        };
    };
    crumbs: {
        [nodeID: string]: {
            node: TreeNode;
            frames: IFrame[];
            pc: TreeNode | null;
        };
    };
} = {
    process: {},
    routine: {},
    crumbs: {},
};

/** Stores a reference to the starting node of parsing. */
let _executionItem: { node: TreeNode; bucket: 'process' | 'routine' | 'crumbs' } | null = null;

// -- private functions ----------------------------------------------------------------------------

/**
 * Helper that resets the parser.
 */
function _reset(): void {
    _processNodes = getProcessNodes();
    _routineNodes = getRoutineNodes();
    _crumbNodes = getCrumbs();

    _programMap = {
        process: {},
        routine: {},
        crumbs: {},
    };

    for (const processNode of _processNodes) {
        _programMap['process'][processNode.nodeID] = {
            node: processNode,
            frames: [],
            pc: null,
        };
    }

    for (const routineNode of _routineNodes) {
        _programMap['routine'][routineNode.nodeID] = {
            node: routineNode,
            frames: [],
            pc: null,
        };
    }

    for (const crumbNode of _crumbNodes) {
        _programMap['crumbs'][crumbNode.nodeID] = {
            node: crumbNode,
            frames: [],
            pc: null,
        };
    }

    _executionItem = null;
}

// -- public functions -----------------------------------------------------------------------------

/**
 * Recursively validates the argument sequence for a syntax tree instruction node. Checks if there are
 * `null` argument connections.
 * @param instructionNode - syntax tree instruction node
 * @returns `null` if valid, else an object of the invalid syntax tree non-data node and arg name.
 */
export function validateArgumentSequence(
    instructionNode: TreeNodeStatement | TreeNodeBlock
): { instruction: TreeNodeExpression | TreeNodeStatement | TreeNodeBlock; argName: string } | null {
    if (Object.keys(instructionNode.argConnections).length === 0) {
        return null;
    }

    function __validateArgumentSequence(
        node: TreeNodeExpression | TreeNodeStatement | TreeNodeBlock
    ): {
        instruction: TreeNodeExpression | TreeNodeStatement | TreeNodeBlock;
        argName: string;
    } | null {
        for (const [argName, argNode] of Object.entries(node.argConnections)) {
            if (argNode === null) {
                return {
                    instruction: node,
                    argName,
                };
            } else {
                if (argNode instanceof TreeNodeExpression) {
                    const result = __validateArgumentSequence(argNode);
                    if (result !== null) {
                        return result;
                    }
                }
            }
        }
        return null;
    }

    return __validateArgumentSequence(instructionNode);
}

/**
 * Recursively generates the argument sequence for a syntax tree instruction node.
 * @description
 * Expects that argument sequence is valid — no `null` argument connections.
 * @param instructionNode - syntax tree instruction node
 * @returns a list of argument element instances
 */
export function generateArgumentSequence(
    instructionNode: TreeNodeStatement | TreeNodeBlock
): (ElementData<TData> | ElementExpression<TData>)[] {
    if (Object.keys(instructionNode.argConnections).length === 0) {
        return [];
    }

    function __generateArgumentSequence(
        node: TreeNodeExpression | TreeNodeStatement | TreeNodeBlock
    ): (ElementData<TData> | ElementExpression<TData>)[] {
        let sequence: (ElementData<TData> | ElementExpression<TData>)[] = [];

        Object.entries(node.argConnections!).forEach(([_, argNode]) => {
            if (argNode instanceof TreeNodeExpression) {
                sequence = [...sequence, ...__generateArgumentSequence(argNode!)];
            }
            sequence.push(
                getInstance(argNode!.instanceID)!.instance as
                    | ElementData<TData>
                    | ElementExpression<TData>
            );
        });

        return sequence;
    }

    return __generateArgumentSequence(instructionNode);
}

/**
 * Sets the starting node of parsing.
 * @param nodeID - syntax tree node ID of the starting node.
 */
export function setExecutionItem(nodeID: string): void {
    _reset();

    let executionItemEntry:
        | {
              node: TreeNode;
              frames: IFrame[];
              pc: TreeNode | null;
          }
        | undefined = undefined;

    for (const processNode of _processNodes) {
        if (processNode.nodeID === nodeID) {
            _executionItem = { node: processNode, bucket: 'process' };
            executionItemEntry = _programMap['process'][_executionItem.node.nodeID];
            break;
        }
    }

    for (const routineNode of _routineNodes) {
        if (routineNode.nodeID === nodeID) {
            _executionItem = { node: routineNode, bucket: 'routine' };
            executionItemEntry = _programMap['routine'][_executionItem.node.nodeID];
            break;
        }
    }

    for (const crumbNode of _crumbNodes) {
        if (crumbNode.nodeID === nodeID) {
            _executionItem = { node: crumbNode, bucket: 'crumbs' };
            executionItemEntry = _programMap['crumbs'][_executionItem.node.nodeID];
            break;
        }
    }

    if (executionItemEntry !== undefined) {
        executionItemEntry.pc = _executionItem!.node;
        executionItemEntry.frames.push({
            node: _executionItem!.node,
            pages: null,
        });
    }
}

/**
 * Returns the starting syntax tree node ID of the starting node of parsing.
 * @returns - syntax tree node ID if present, else `null`
 */
export function getExecutionItem(): string | null {
    return _executionItem ? _executionItem.node.nodeID : null;
}

/**
 * Returns the next node in execution sequence.
 * @returns - element entry if present, else `null`
 */
export function getNextElement(): IParsedElement | null {
    if (_executionItem === null) {
        /*
         * Nothing to execute
         */
        return null;
    }

    const executionItemEntry = _programMap[_executionItem.bucket][_executionItem.node.nodeID];

    const nextNode = executionItemEntry.pc;
    const frames = executionItemEntry.frames;

    if (nextNode === null) {
        if (frames.length === 0) {
            /*
             * Successful end of execution
             */

            _reset();
            return null;
        } else {
            /*
             * ERROR: Missing argument
             */

            return null;
        }
    }

    const instance = getInstance(nextNode.instanceID)!.instance;

    function __handlePages(): { element: IParsedElement } | { marker: string | null } {
        const frame = frames[frames.length - 1];

        if (frame.pages === null) {
            frame.pages = [];

            Object.entries(
                (nextNode as TreeNodeExpression | TreeNodeStatement | TreeNodeBlock).argConnections
            ).forEach(([argName, argNode]) =>
                frame.pages!.push({
                    node: argNode!,
                    marker: argName,
                })
            );

            frame.pages = frame.pages.reverse();
        }

        if (frame.pages.length !== 0) {
            if (frame.pages[0].marker === 'rollback__this__') {
                frames.pop();

                return { marker: 'rollback__this__' };
            }

            const upcomingNode = frame.pages[frame.pages.length - 1].node;

            frames.push({
                node: upcomingNode,
                pages: null,
            });

            executionItemEntry.pc = upcomingNode;

            return { element: getNextElement()! };
        } else {
            if (nextNode instanceof TreeNodeBlock) {
                frame.pages = [
                    {
                        node: nextNode as TreeNode,
                        marker: 'rollback__this__',
                    },
                ];

                frames.push({
                    node: nextNode.innerConnection as TreeNode,
                    pages: null,
                });

                executionItemEntry.pc = nextNode.innerConnection;

                return {
                    element: {
                        type: 'Instruction',
                        instance: instance as ElementBlock,
                        marker: null,
                    },
                };
            }

            frames.pop();

            let marker: string | null = null;

            if (nextNode instanceof TreeNodeExpression && frames.length !== 0) {
                const topFramePages = frames[frames.length - 1].pages!;
                marker = topFramePages[topFramePages.length - 1].marker;
                frames[frames.length - 1].pages!.pop();
            }

            return { marker };
        }
    }

    if (nextNode instanceof TreeNodeData) {
        frames.pop();

        let marker: string | null = null;

        if (frames.length !== 0) {
            const topFramePages = frames[frames.length - 1].pages!;
            marker = topFramePages[topFramePages.length - 1].marker;
            frames[frames.length - 1].pages!.pop();
        }

        const element: IParsedElement = {
            type: 'Argument',
            instance: instance as ElementData<TData>,
            marker,
        };

        executionItemEntry.pc = nextNode.connectedTo;

        return element;
    } else if (nextNode instanceof TreeNodeExpression) {
        const result = __handlePages();
        if ('element' in result) {
            return result.element;
        }

        const element: IParsedElement = {
            type: 'Argument',
            instance: instance as ElementExpression<TData>,
            marker: result.marker,
        };

        executionItemEntry.pc = nextNode.connectedTo;

        return element;
    } else if (nextNode instanceof TreeNodeStatement) {
        const result = __handlePages();
        if ('element' in result) {
            return result.element;
        }

        if (nextNode.afterConnection === null) {
            if (frames.length !== 0) {
                executionItemEntry.pc = frames[frames.length - 1].node;
            } else {
                executionItemEntry.pc = nextNode.afterConnection;
            }
        } else {
            frames.push({
                node: nextNode.afterConnection as TreeNodeStatement | TreeNodeBlock,
                pages: null,
            });
            executionItemEntry.pc = nextNode.afterConnection;
        }

        return {
            type: 'Instruction',
            instance: instance as ElementStatement,
            marker: null,
        };
    } /* nextNode instanceOf TreeNodeBlock */ else {
        const result = __handlePages();
        if ('element' in result) {
            return result.element;
        }

        if ((nextNode as TreeNodeBlock).afterConnection === null) {
            if (frames.length !== 0) {
                executionItemEntry.pc = frames[frames.length - 1].node;
            } else {
                executionItemEntry.pc = (nextNode as TreeNodeBlock).afterConnection;
            }
        } else {
            frames.push({
                node: (nextNode as TreeNodeBlock).afterConnection as
                    | TreeNodeStatement
                    | TreeNodeBlock,
                pages: null,
            });
            executionItemEntry.pc = (nextNode as TreeNodeBlock).afterConnection;
        }

        return {
            type: 'Instruction',
            instance: instance as ElementBlock,
            marker: result.marker,
        };
    }
}

_reset();
