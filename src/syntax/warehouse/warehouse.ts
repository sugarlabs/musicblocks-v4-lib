import { v4 as uuidv4 } from 'uuid';

import { TElementKind, TElementType } from '../../@types/specification';
import {
    getElementNames,
    getElementCategories,
    queryElementSpecification,
} from '../specification/specification';

import { TData } from '../../@types/data';
import { ElementSyntax } from '../elements/elementSyntax';
import { ElementData, ElementExpression } from '../elements/elementArgument';
import { ElementStatement, ElementBlock } from '../elements/elementInstruction';

// -- private variables ----------------------------------------------------------------------------

/** A non-generic wrapper for class `ElementData`. */
abstract class _ElementDataCover extends ElementData<TData> {}
/** A non-generic wrapper for class `ElementExpression`. */
abstract class _ElementExpressionCover extends ElementExpression<TData> {}

/** Stores the count of element name. */
let _elementNameCountMap: { [elementName: string]: number } = {};
/** Stores the count of element kind. */
let _elementKindCountMap: { [elementKind: string]: number } = {};
/** Stores the count of element type. */
let _elementTypeCountMap: { [elementKind: string]: number } = {};
/** Stores the count of element category. */
let _elementCategoryCountMap: { [elementKind: string]: number } = {};

/** Stores an extensive table of element name, kind, type, category, instance, by instance ID. */
let _elementMap: {
    [elementID: string]:
        | {
              instance: _ElementDataCover;
              type: 'Data';
              name: string;
              kind: 'Argument';
              category: string;
          }
        | {
              instance: _ElementExpressionCover;
              type: 'Expression';
              name: string;
              kind: 'Argument';
              category: string;
          }
        | {
              instance: ElementStatement;
              type: 'Statement';
              name: string;
              kind: 'Instruction';
              category: string;
          }
        | {
              instance: ElementBlock;
              type: 'Block';
              name: string;
              kind: 'Instruction';
              category: string;
          };
} = {};

// -- private functions ----------------------------------------------------------------------------

/**
 * Helper function that creates a new instance, adds to element table, and updates count tables.
 * @param elementName - name of the element
 * @param instanceID - key for entry in element table
 * @param instance - element instance
 * @param type - type of the element
 * @param category - category of the element
 */
function _addInstance(
    elementName: string,
    instanceID: string,
    instance: ElementSyntax,
    type: TElementType,
    category: string
): void {
    const kind = type === 'Data' || type === 'Expression' ? 'Argument' : 'Instruction';

    switch (type) {
        case 'Data':
            _elementMap[instanceID] = {
                instance: instance as _ElementDataCover,
                name: elementName,
                type: type as 'Data',
                kind: 'Argument',
                category: category as string,
            };
            break;
        case 'Expression':
            _elementMap[instanceID] = {
                instance: instance as _ElementExpressionCover,
                name: elementName,
                type: type as 'Expression',
                kind: 'Argument',
                category: category as string,
            };
            break;
        case 'Statement':
            _elementMap[instanceID] = {
                instance: instance as ElementStatement,
                name: elementName,
                type: type as 'Statement',
                kind: 'Instruction',
                category: category as string,
            };
            break;
        case 'Block':
            _elementMap[instanceID] = {
                instance: instance as ElementBlock,
                name: elementName,
                type: type as 'Block',
                kind: 'Instruction',
                category: category as string,
            };
            break;
    }

    _elementNameCountMap[elementName]++;
    _elementKindCountMap[kind]++;
    _elementTypeCountMap[type]++;
    _elementCategoryCountMap[category]++;
}

/**
 * Helper that resets the element name count table.
 */
function _resetElementNameCountMap(): void {
    _elementNameCountMap = {};
    getElementNames().forEach((elementName) => (_elementNameCountMap[elementName] = 0));
}

/**
 * Helper that resets the element kind count table.
 */
function _resetElementKindCountMap(): void {
    _elementKindCountMap = {
        Argument: 0,
        Instruction: 0,
    };
}

/**
 * Helper that resets the element type count table.
 */
function _resetElementTypeCountMap(): void {
    _elementTypeCountMap = {
        Data: 0,
        Expression: 0,
        Statement: 0,
        Block: 0,
    };
}

/**
 * Helper that resets the element category count table.
 */
function _resetElementCategoryCountMap(): void {
    _elementCategoryCountMap = {};
    getElementCategories().forEach((category) => (_elementCategoryCountMap[category] = 0));
}

// -- public functions -----------------------------------------------------------------------------

/**
 * Creates a new instance, adds to element table, and updates count tables.
 * @param elementName - name of the element
 * @returns - unique instance ID for the element instance
 */
export function addInstance(elementName: string): string {
    const elementSpecification = queryElementSpecification(elementName);

    if (elementSpecification === null) {
        throw Error(`InvalidAccessError: element with name "${elementName}" does not exist`);
    }

    const { label, type, category, prototype } = elementSpecification;

    let instance: ElementSyntax;

    switch (type) {
        case 'Data':
            instance = (prototype as (name: string, label: string) => _ElementDataCover)(
                elementName,
                label
            );
            break;
        case 'Expression':
            instance = (prototype as (name: string, label: string) => _ElementExpressionCover)(
                elementName,
                label
            );
            break;
        case 'Statement':
            instance = (prototype as (name: string, label: string) => ElementStatement)(
                elementName,
                label
            );
            break;
        case 'Block':
        default:
            instance = (prototype as (name: string, label: string) => ElementBlock)(
                elementName,
                label
            );
    }

    let instanceID: string;
    do {
        instanceID = uuidv4();
    } while (instanceID in _elementMap);

    _addInstance(elementName, instanceID, instance, type, category);

    return instanceID;
}

/**
 * Fetches the element instance entry from element table.
 * @param instanceID - instance ID of the element in element table
 * @returns element instance with additional properties
 */
export function getInstance(instanceID: string): {
    name: string;
    kind: TElementKind;
    type: TElementType;
    category: string;
    instance: ElementSyntax;
} | null {
    return instanceID in _elementMap ? { ..._elementMap[instanceID] } : null;
}

/**
 * Removes the element entry corresponding to the instance ID and updates count tables.
 * @param instanceID - instance ID of the element in element table
 */
export function removeInstance(instanceID: string): void {
    if (!(instanceID in _elementMap)) {
        return;
    }

    const { name, kind, type, category } = _elementMap[instanceID];
    _elementNameCountMap[name]--;
    _elementKindCountMap[kind]--;
    _elementTypeCountMap[type]--;
    _elementCategoryCountMap[category]--;
    delete _elementMap[instanceID];
}

/**
 * Returns the number of element instances of an element name exists in element table.
 * @param name - name of the element
 * @returns count of the element instances for the element name
 */
export function getNameCount(name: string): number {
    return _elementNameCountMap[name];
}

/**
 * Generates a table of element instance counts by element name.
 * @returns an object with key-value pairs of element name and instance count
 */
export function getNameCountAll(): { [name: string]: number } {
    return { ..._elementNameCountMap };
}

/**
 * Returns the number of element instances of an element kind exists in element table.
 * @param kind - kind of the element
 * @returns count of the element instances for the element kind
 */
export function getKindCount(kind: TElementKind): number {
    return _elementKindCountMap[kind];
}

/**
 * Generates a table of element instance counts by element kind.
 * @returns an object with key-value pairs of element kind and instance count
 */
export function getKindCountAll(): { [kind: string]: number } {
    return { ..._elementKindCountMap };
}

/**
 * Returns the number of element instances of an element type exists in element table.
 * @param type - type of the element
 * @returns count of the element instances for the element type
 */
export function getTypeCount(type: TElementType): number {
    return _elementTypeCountMap[type];
}

/**
 * Generates a table of element instance counts by element type.
 * @returns an object with key-value pairs of element type and instance count
 */
export function getTypeCountAll(): { [type: string]: number } {
    return { ..._elementTypeCountMap };
}

/**
 * Returns the number of element instances of an element category exists in element table.
 * @param category - category of the element
 * @returns count of the element instances for the element category
 */
export function getCategoryCount(category: string): number {
    return _elementCategoryCountMap[category];
}

/**
 * Generates a table of element instance counts by element category.
 * @returns an object with key-value pairs of element category and instance count
 */
export function getCategoryCountAll(): { [category: string]: number } {
    return { ..._elementCategoryCountMap };
}

/**
 * Resets all the count tables and element map.
 */
export function resetWarehouse(): void {
    _elementMap = {};
    _resetElementNameCountMap();
    _resetElementKindCountMap();
    _resetElementTypeCountMap();
    _resetElementCategoryCountMap();
}

resetWarehouse();
