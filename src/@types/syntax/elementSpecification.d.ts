export type TElementCategoryData = 'value' | 'boxidentifier';
export type TElementCategoryExpression = 'operator-math';
export type TElementCategoryStatement = 'box';
export type TElementCategoryBlock = 'block-dummy';

export type TElementCategory =
    | TElementCategoryData
    | TElementCategoryExpression
    | TElementCategoryStatement
    | TElementCategoryBlock;

export type TElementDataName =
    // value elements
    | 'value-boolean'
    | 'value-number'
    | 'value-string'
    // box identifier elements
    | 'boxidentifier-generic'
    | 'boxidentifier-boolean'
    | 'boxidentifier-number'
    | 'boxidentifier-string';

export type TElementExpressionName =
    // math operator elements
    | 'operator-math-plus'
    | 'operator-math-minus'
    | 'operator-math-times'
    | 'operator-math-divide'
    | 'operator-math-modulus';

export type TElementStatementName =
    // box elements
    'box-generic' | 'box-boolean' | 'box-number' | 'box-string';

export type TElementBlockName = 'block-dummy';

export type TElementName =
    | 'dummy'
    | TElementDataName
    | TElementExpressionName
    | TElementStatementName
    | TElementBlockName;
