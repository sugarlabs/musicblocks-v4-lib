import {
    validateArgumentSequence,
    generateArgumentSequence,
    setExecutionItem,
    getExecutionItem,
    getNextElement,
} from './parser';

import { IParsedElementArgument, IParsedElementInstruction } from '@/@types/execution';

import {
    generateFromSnapshot,
    getCrumbs,
    addNode,
    getProcessNodes,
    resetSyntaxTree,
    getRoutineNodes,
} from '@/syntax/tree/syntaxTree';
import { TreeNodeStatement } from '@/syntax/tree/node';

// -------------------------------------------------------------------------------------------------

describe('Parser', () => {
    describe('static argument parsing', () => {
        test('validate invalid argument sequence and verify', () => {
            generateFromSnapshot({
                process: [],
                routine: [],
                crumbs: [
                    [
                        {
                            elementName: 'box-number',
                            argMap: {
                                name: {
                                    elementName: 'value-string',
                                },
                                value: {
                                    elementName: 'operator-math-plus',
                                    argMap: {
                                        operand1: {
                                            elementName: 'value-number',
                                        },
                                        operand2: null,
                                    },
                                },
                            },
                        },
                    ],
                ],
            });

            const result = validateArgumentSequence(getCrumbs()[0] as TreeNodeStatement);
            expect(result).not.toBe(null);
            expect(result!.instruction.elementName).toBe('operator-math-plus');
            expect(result!.argName).toBe('operand2');
        });

        test('validate valid argument sequence and verify', () => {
            generateFromSnapshot({
                process: [],
                routine: [],
                crumbs: [
                    [
                        {
                            elementName: 'box-number',
                            argMap: {
                                name: {
                                    elementName: 'value-string',
                                },
                                value: {
                                    elementName: 'value-number',
                                },
                            },
                        },
                    ],
                ],
            });

            const result = validateArgumentSequence(getCrumbs()[0] as TreeNodeStatement);
            expect(result).toBe(null);
        });

        test('generate argument sequence', () => {
            generateFromSnapshot({
                process: [],
                routine: [],
                crumbs: [
                    [
                        {
                            elementName: 'box-number',
                            argMap: {
                                name: {
                                    elementName: 'value-string',
                                },
                                value: {
                                    elementName: 'operator-math-plus',
                                    argMap: {
                                        operand1: {
                                            elementName: 'operator-math-minus',
                                            argMap: {
                                                operand1: {
                                                    elementName: 'value-number',
                                                },
                                                operand2: {
                                                    elementName: 'boxidentifier-number',
                                                },
                                            },
                                        },
                                        operand2: {
                                            elementName: 'value-number',
                                        },
                                    },
                                },
                            },
                        },
                    ],
                ],
            });

            const result = validateArgumentSequence(getCrumbs()[0] as TreeNodeStatement);
            expect(result).toBe(null);
            const sequence = generateArgumentSequence(getCrumbs()[0] as TreeNodeStatement);
            expect(sequence.map((item) => item.name)).toEqual([
                'value-string',
                'value-number',
                'boxidentifier-number',
                'operator-math-minus',
                'value-number',
                'operator-math-plus',
            ]);
        });
    });

    describe('dynamic syntax tree parsing', () => {
        describe('execution item', () => {
            test('set execution item to a process node and verify', () => {
                resetSyntaxTree();
                const processNodeID = addNode('process');
                setExecutionItem(processNodeID);
                expect(getExecutionItem()).toBe(processNodeID);
            });

            test('set execution item to a routine node and verify', () => {
                resetSyntaxTree();
                const routineNodeID = addNode('routine');
                setExecutionItem(routineNodeID);
                expect(getExecutionItem()).toBe(routineNodeID);
            });

            test('set execution item to a crumb data element node and verify', () => {
                resetSyntaxTree();
                const nodeID = addNode('value-boolean');
                setExecutionItem(nodeID);
                expect(getExecutionItem()).toBe(nodeID);
            });

            test('set execution item to a crumb expression element node and verify', () => {
                resetSyntaxTree();
                const nodeID = addNode('operator-math-plus');
                setExecutionItem(nodeID);
                expect(getExecutionItem()).toBe(nodeID);
            });

            test('set execution item to a crumb statement element node and verify', () => {
                resetSyntaxTree();
                const nodeID = addNode('box-boolean');
                setExecutionItem(nodeID);
                expect(getExecutionItem()).toBe(nodeID);
            });

            test('set execution item to an invalid node and verify', () => {
                addNode('boxidentifier-boolean');
                setExecutionItem('123456');
                expect(getExecutionItem()).toBe(null);
            });
        });

        describe('parsing sequence', () => {
            test('validate parsing from a crumb data element', () => {
                resetSyntaxTree();
                generateFromSnapshot({
                    process: [],
                    routine: [],
                    crumbs: [
                        [
                            {
                                elementName: 'value-boolean',
                            },
                        ],
                    ],
                });
                const node = getCrumbs()[0].nodeID;
                setExecutionItem(node);
                expect(getExecutionItem()).toBe(node);
                let next = getNextElement();
                expect(next).not.toBe(null);
                expect(next!.instance.name).toBe('value-boolean');
                next = getNextElement();
                expect(next).toBe(null);
            });

            test('validate parsing from a crumb operator element', () => {
                resetSyntaxTree();
                generateFromSnapshot({
                    process: [],
                    routine: [],
                    crumbs: [
                        [
                            {
                                elementName: 'operator-math-plus',
                                argMap: {
                                    operand1: {
                                        elementName: 'value-number',
                                    },
                                    operand2: {
                                        elementName: 'value-string',
                                    },
                                },
                            },
                        ],
                    ],
                });
                const node = getCrumbs()[0].nodeID;
                setExecutionItem(node);
                expect(getExecutionItem()).toBe(node);
                let next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-number');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('operand1');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-string');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('operand2');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('operator-math-plus');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe(null);
                next = getNextElement();
                expect(next).toBe(null);
            });

            test('validate parsing from a crumb statement element', () => {
                resetSyntaxTree();
                generateFromSnapshot({
                    process: [],
                    routine: [],
                    crumbs: [
                        [
                            {
                                elementName: 'box-boolean',
                                argMap: {
                                    name: {
                                        elementName: 'value-string',
                                    },
                                    value: {
                                        elementName: 'value-boolean',
                                    },
                                },
                            },
                            {
                                elementName: 'box-boolean',
                                argMap: {
                                    name: {
                                        elementName: 'value-string',
                                    },
                                    value: {
                                        elementName: 'value-boolean',
                                    },
                                },
                            },
                        ],
                    ],
                });
                const node = getCrumbs()[0].nodeID;
                setExecutionItem(node);
                expect(getExecutionItem()).toBe(node);
                let next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-string');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('name');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-boolean');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('value');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('box-boolean');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-string');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('name');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-boolean');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('value');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('box-boolean');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                next = getNextElement();
                expect(next).toBe(null);
            });

            test('validate parsing a process element', () => {
                resetSyntaxTree();
                generateFromSnapshot({
                    process: [
                        {
                            elementName: 'process',
                            argMap: null,
                            scope: [
                                {
                                    elementName: 'box-boolean',
                                    argMap: {
                                        name: {
                                            elementName: 'value-string',
                                        },
                                        value: {
                                            elementName: 'value-boolean',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    routine: [],
                    crumbs: [],
                });
                const node = getProcessNodes()[0].nodeID;
                setExecutionItem(node);
                expect(getExecutionItem()).toBe(node);
                let next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('process');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-string');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('name');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-boolean');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('value');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('box-boolean');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('process');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                expect((next as IParsedElementInstruction).marker).toBe('rollback__this__');
                next = getNextElement();
                expect(next).toBe(null);
            });

            test('validate parsing a routine element', () => {
                resetSyntaxTree();
                generateFromSnapshot({
                    process: [],
                    routine: [
                        {
                            elementName: 'routine',
                            argMap: {
                                name: {
                                    elementName: 'value-string',
                                },
                            },
                            scope: [
                                {
                                    elementName: 'box-boolean',
                                    argMap: {
                                        name: {
                                            elementName: 'value-string',
                                        },
                                        value: {
                                            elementName: 'value-boolean',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    crumbs: [],
                });
                const node = getRoutineNodes()[0].nodeID;
                setExecutionItem(node);
                expect(getExecutionItem()).toBe(node);
                let next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-string');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('name');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('routine');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-string');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('name');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementArgument).instance.name).toBe('value-boolean');
                expect((next as IParsedElementArgument).type).toBe('Argument');
                expect((next as IParsedElementArgument).marker).toBe('value');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('box-boolean');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                next = getNextElement();
                expect(next).not.toBe(null);
                expect((next as IParsedElementInstruction).instance.name).toBe('routine');
                expect((next as IParsedElementInstruction).type).toBe('Instruction');
                next = getNextElement();
                expect(next).toBe(null);
            });

            test('validate deep element tree for a block', () => {
                resetSyntaxTree();
                generateFromSnapshot({
                    process: [],
                    routine: [
                        {
                            elementName: 'routine',
                            argMap: {
                                name: {
                                    elementName: 'operator-math-plus',
                                    argMap: {
                                        operand1: {
                                            elementName: 'value-string',
                                        },
                                        operand2: {
                                            elementName: 'value-string',
                                        },
                                    },
                                },
                            },
                            scope: [
                                {
                                    elementName: 'box-boolean',
                                    argMap: {
                                        name: {
                                            elementName: 'value-string',
                                        },
                                        value: {
                                            elementName: 'value-boolean',
                                        },
                                    },
                                },
                                {
                                    elementName: 'process',
                                    argMap: null,
                                    scope: [
                                        {
                                            elementName: 'box-boolean',
                                            argMap: {
                                                name: {
                                                    elementName: 'value-string',
                                                },
                                                value: {
                                                    elementName: 'value-boolean',
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    crumbs: [],
                });
                const node = getRoutineNodes()[0].nodeID;
                setExecutionItem(node);
                expect(getExecutionItem()).toBe(node);

                const results: [string, string | null][] = [];
                /* eslint-disable-next-line */
                while (true) {
                    const next = getNextElement();

                    if (next === null) {
                        break;
                    }

                    results.push([next.instance.name, next.marker]);
                }
                expect(results).toEqual([
                    ['value-string', 'operand1'],
                    ['value-string', 'operand2'],
                    ['operator-math-plus', 'name'],
                    ['routine', null],
                    ['value-string', 'name'],
                    ['value-boolean', 'value'],
                    ['box-boolean', null],
                    ['process', null],
                    ['value-string', 'name'],
                    ['value-boolean', 'value'],
                    ['box-boolean', null],
                    ['process', 'rollback__this__'],
                    ['routine', 'rollback__this__'],
                ]);
            });
        });
    });
});
