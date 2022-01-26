import { run } from './interpreter';

import { generateFromSnapshot, generateSnapshot, getNode } from '../syntax/tree/syntaxTree';

import { registerElementSpecificationEntries } from '../syntax/specification/specification';
import elementSpecification from '../library/specification';
import { getInstance } from '../syntax/warehouse/warehouse';

// -------------------------------------------------------------------------------------------------

registerElementSpecificationEntries(elementSpecification);

describe('Interpreter', () => {
    test('run a process and verify', () => {
        /*
        fibonacci sequence
        
        a = 0
        b = 1
        repeat(10)
            print(c)
            c = plus(a, b)
            a = b
            b = c
        
        expect 1, 1, 2, 3, 5, 8, 13, 21, 34, 55
         */

        generateFromSnapshot({
            process: [
                {
                    elementName: 'process',
                    argMap: null,
                    scope: [
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
                        {
                            elementName: 'repeat',
                            argMap: {
                                times: {
                                    elementName: 'value-number',
                                },
                            },
                            scope: [
                                {
                                    elementName: 'print',
                                    argMap: {
                                        value: {
                                            elementName: 'boxidentifier-number',
                                        },
                                    },
                                },
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
                                                    elementName: 'boxidentifier-number',
                                                },
                                                operand2: {
                                                    elementName: 'boxidentifier-number',
                                                },
                                            },
                                        },
                                    },
                                },
                                {
                                    elementName: 'box-number',
                                    argMap: {
                                        name: {
                                            elementName: 'value-string',
                                        },
                                        value: {
                                            elementName: 'boxidentifier-number',
                                        },
                                    },
                                },
                                {
                                    elementName: 'box-number',
                                    argMap: {
                                        name: {
                                            elementName: 'value-string',
                                        },
                                        value: {
                                            elementName: 'boxidentifier-number',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
            routine: [],
            crumbs: [],
        });
        const snapshot = generateSnapshot();

        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[0].argMap['name']['nodeID'])!.instanceID
        )!.instance.updateLabel('a');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[0].argMap['value']['nodeID'])!.instanceID
        )!.instance.updateLabel('0');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[1].argMap['name']['nodeID'])!.instanceID
        )!.instance.updateLabel('b');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[1].argMap['value']['nodeID'])!.instanceID
        )!.instance.updateLabel('1');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[2].argMap['name']['nodeID'])!.instanceID
        )!.instance.updateLabel('c');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[2].argMap['value']['nodeID'])!.instanceID
        )!.instance.updateLabel('1');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[3].argMap['times']['nodeID'])!.instanceID
        )!.instance.updateLabel('10');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[3].scope[0].argMap['value']['nodeID'])!.instanceID
        )!.instance.updateLabel('c');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[3].scope[1].argMap['name']['nodeID'])!.instanceID
        )!.instance.updateLabel('c');
        getInstance(
            getNode(
                // @ts-ignore
                snapshot.process[0].scope[3].scope[1].argMap['value']['argMap']['operand1'][
                    'nodeID'
                ]
            )!.instanceID
        )!.instance.updateLabel('a');
        getInstance(
            getNode(
                // @ts-ignore
                snapshot.process[0].scope[3].scope[1].argMap['value']['argMap']['operand2'][
                    'nodeID'
                ]
            )!.instanceID
        )!.instance.updateLabel('b');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[3].scope[2].argMap['name']['nodeID'])!.instanceID
        )!.instance.updateLabel('a');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[3].scope[2].argMap['value']['nodeID'])!.instanceID
        )!.instance.updateLabel('b');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[3].scope[3].argMap['name']['nodeID'])!.instanceID
        )!.instance.updateLabel('b');
        getInstance(
            // @ts-ignore
            getNode(snapshot.process[0].scope[3].scope[3].argMap['value']['nodeID'])!.instanceID
        )!.instance.updateLabel('c');

        const node = snapshot.process[0];
        run(node.nodeID);
    });
});
