import {
    TreeNodeData,
    TreeNodeExpression,
    TreeNodeStatement,
    TreeNodeBlock,
} from '@/syntax/tree/node';

import { getInstance } from '@/syntax/warehouse/warehouse';

import { TData } from '@/@types/data';
import { ElementData, ElementExpression } from '@/syntax/elements/core/elementArgument';

// -- private functions ----------------------------------------------------------------------------

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
