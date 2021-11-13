import { v4 as uuidv4 } from 'uuid';

import {
    TElementName,
    TElementKind,
    TElementType,
    TElementCategory,
    TElementCategoryData,
    TElementCategoryExpression,
    TElementCategoryStatement,
    TElementCategoryBlock,
    TElementNameData,
    TElementNameExpression,
    TElementNameStatement,
    TElementNameBlock,
} from '@/@types/specification';
import elementSpecification from './specification';

import { TData } from '@/@types/data';
import { ElementSyntax } from './elements/core/elementSyntax';
import { ElementData, ElementExpression } from './elements/core/elementArgument';
import { ElementStatement, ElementBlock } from './elements/core/elementInstruction';

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
              name: TElementNameData;
              kind: 'Argument';
              category: TElementCategoryData;
          }
        | {
              instance: _ElementExpressionCover;
              type: 'Expression';
              name: TElementNameExpression;
              kind: 'Argument';
              category: TElementCategoryExpression;
          }
        | {
              instance: ElementStatement;
              type: 'Statement';
              name: TElementNameStatement;
              kind: 'Instruction';
              category: TElementCategoryStatement;
          }
        | {
              instance: ElementBlock;
              type: 'Block';
              name: TElementNameBlock;
              kind: 'Instruction';
              category: TElementCategoryBlock;
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
    elementName: TElementName,
    instanceID: string,
    instance: ElementSyntax,
    type: TElementType,
    category: TElementCategory
): void {
    const kind = type === 'Data' || type === 'Expression' ? 'Argument' : 'Instruction';

    switch (type) {
        case 'Data':
            _elementMap[instanceID] = {
                instance: instance as _ElementDataCover,
                name: elementName as TElementNameData,
                type: type as 'Data',
                kind: 'Argument',
                category: category as TElementCategoryData,
            };
            break;
        case 'Expression':
            _elementMap[instanceID] = {
                instance: instance as _ElementExpressionCover,
                name: elementName as TElementNameExpression,
                type: type as 'Expression',
                kind: 'Argument',
                category: category as TElementCategoryExpression,
            };
            break;
        case 'Statement':
            _elementMap[instanceID] = {
                instance: instance as ElementStatement,
                name: elementName as TElementNameStatement,
                type: type as 'Statement',
                kind: 'Instruction',
                category: category as TElementCategoryStatement,
            };
            break;
        case 'Block':
            _elementMap[instanceID] = {
                instance: instance as ElementBlock,
                name: elementName as TElementNameBlock,
                type: type as 'Block',
                kind: 'Instruction',
                category: category as TElementCategoryBlock,
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
    (Object.keys(elementSpecification) as TElementName[]).forEach(
        (elementName) => (_elementNameCountMap[elementName] = 0)
    );
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
    const categorySet = new Set<TElementCategory>();
    Object.entries(elementSpecification).forEach(([_, { category }]) => categorySet.add(category));
    [...categorySet].forEach((category) => (_elementCategoryCountMap[category] = 0));
}

// -- public functions -----------------------------------------------------------------------------

/**
 * Creates a new instance, adds to element table, and updates count tables.
 * @param elementName - name of the element
 * @returns - unique instance ID for the element instance
 */
export function addInstance(elementName: TElementName): string {
    const { label, type, category, prototype } = elementSpecification[elementName];

    let instance: ElementSyntax;

    switch (type) {
        case 'Data':
            instance = (prototype as (name: TElementNameData, label: string) => _ElementDataCover)(
                elementName as TElementNameData,
                label
            );
            break;
        case 'Expression':
            instance = (
                prototype as (
                    name: TElementNameExpression,
                    label: string
                ) => _ElementExpressionCover
            )(elementName as TElementNameExpression, label);
            break;
        case 'Statement':
            instance = (
                prototype as (name: TElementNameStatement, label: string) => ElementStatement
            )(elementName as TElementNameStatement, label);
            break;
        case 'Block':
        default:
            instance = (prototype as (name: TElementNameBlock, label: string) => ElementBlock)(
                elementName as TElementNameBlock,
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
    name: TElementName;
    kind: TElementKind;
    type: TElementType;
    category: TElementCategory;
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
export function getNameCount(name: TElementName): number {
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
export function getCategoryCount(category: TElementCategory): number {
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
