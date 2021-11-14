import { validateArgumentSequence, generateArgumentSequence } from './parser';

import { generateFromSnapshot, getCrumbs } from '@/syntax/tree/syntaxTree';
import { TreeNodeStatement } from '@/syntax/tree/node';

// -------------------------------------------------------------------------------------------------

describe('Parser', () => {
    describe('argument parsing', () => {
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
});
