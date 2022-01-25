import {
    IElementSpecificationData,
    IElementSpecificationExpression,
    IElementSpecificationStatement,
    IElementSpecificationBlock,
    IElementSpecification,
    TElementName,
} from '../../@types/specification';

// -- private variables ----------------------------------------------------------------------------

/** Stores the specifications for each element as a key-value pair of name: specification. */
let _elementSpecification: {
    [identifier: string]:
        | IElementSpecificationData
        | IElementSpecificationExpression
        | IElementSpecificationStatement
        | IElementSpecificationBlock;
} = {};

// -- public functions -----------------------------------------------------------------------------

/**
 * Registers a syntax element specification from a given specification entry data.
 * @param name name of the syntax element
 * @param specification specification entry data
 */
export function registerElementSpecificationEntry(
    name: string,
    specification: IElementSpecification
): void {
    const { label, type, category, prototype } = specification;

    const specificationTableEntry: IElementSpecification = {
        label,
        type,
        category,
        // @ts-ignore
        prototype: (name: string, label: string) => new prototype(name, label),
    };

    Object.entries(specification).forEach(([key, value]) => {
        if (!['label', 'type', 'category', 'prototype'].includes(key)) {
            // @ts-ignore
            specificationTableEntry[key] = value;
        }
    });

    _elementSpecification[name] = specificationTableEntry as unknown as
        | IElementSpecificationData
        | IElementSpecificationExpression
        | IElementSpecificationStatement
        | IElementSpecificationBlock;
}

/**
 * Registers a syntax element specification from a given specification entry table.
 * @param specification specification entry table object with key-value pairs of element name and
 *  corresponding specification entry data
 */
export function registerElementSpecificationEntries(specification: {
    [identifier: string]: IElementSpecification;
}): void {
    Object.entries(specification).forEach(([identifier, specification]) =>
        registerElementSpecificationEntry(identifier, specification)
    );
}

/**
 * Removes specification for a syntax element.
 * @param name name of the syntax element
 */
export function removeElementSpecificationEntry(name: string): void {
    if (name in _elementSpecification) {
        delete _elementSpecification[name];
    }
}

/**
 * Removes specification for a list of syntax element.
 * @param names list of names of the syntax element
 */
export function removeElementSpecificationEntries(names: string[]): void {
    names.forEach((name) => removeElementSpecificationEntry(name));
}

/**
 * Returns the element specification for a syntax element.
 * @param name name of the syntax element
 * @returns element specification if exists, else `null`
 */
export function queryElementSpecification(
    name: string
):
    | IElementSpecificationData
    | IElementSpecificationExpression
    | IElementSpecificationStatement
    | IElementSpecificationBlock
    | null {
    return name in _elementSpecification ? { ..._elementSpecification[name] } : null;
}

/**
 * Returns the names of available syntax elements.
 * @returns a list of syntax element names.
 */
export function getElementNames(): string[] {
    return Object.keys(_elementSpecification) as TElementName[];
}

/**
 * Returns the categories of available syntax elements.
 * @returns a list of syntax element categories
 */
export function getElementCategories(): string[] {
    return [...new Set(Object.entries(_elementSpecification).map(([_, { category }]) => category))];
}

/**
 * Resets the element specification to factory list.
 */
export function resetElementSpecificationTable(): void {
    _elementSpecification = {};
}

resetElementSpecificationTable();
