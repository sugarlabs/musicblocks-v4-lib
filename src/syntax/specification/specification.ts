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
 * @returns false if element name already exists, else true
 */
export function registerElementSpecificationEntry(
    name: string,
    specification: IElementSpecification
): boolean {
    if (name in _elementSpecification) return false;

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

    return name in _elementSpecification;
}

/**
 * Registers a syntax element specification from a given specification entry table.
 * @param specification specification entry table object with key-value pairs of element name and
 *  corresponding specification entry data
 * @returns a list of boolean , false if element name already exists else true
 */
export function registerElementSpecificationEntries(specification: {
    [identifier: string]: IElementSpecification;
}): boolean[] {
    const registerElementsEntries: boolean[] = [];
    Object.entries(specification).forEach(([identifier, specification]) =>
        registerElementsEntries.push(registerElementSpecificationEntry(identifier, specification))
    );
    return registerElementsEntries;
}

/**
 * Removes specification for a syntax element.
 * @param name name of the syntax element
 * @returns true if element is successfully removed, else false
 */
export function removeElementSpecificationEntry(name: string): boolean {
    if (name in _elementSpecification) {
        delete _elementSpecification[name];
        return !(name in _elementSpecification);
    } else {
        return true;
    }
}

/**
 * Removes specification for a list of syntax element.
 * @param names list of names of the syntax element
 * @returns a list of boolean, true if element is successfully removed, else false
 */
export function removeElementSpecificationEntries(names: string[]): boolean[] {
    const successfullyRemoved: boolean[] = [];
    names.forEach((name) => successfullyRemoved.push(removeElementSpecificationEntry(name)));
    return successfullyRemoved;
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
