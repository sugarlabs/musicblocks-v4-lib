# Changelog

## 1.0.1 [2022-02-09]

- ([#122](https://github.com/sugarlabs/musicblocks-v4-lib/pull/122))
Added provision to provide initialisation values in snapshot of data elements.
- ([#119](https://github.com/sugarlabs/musicblocks-v4-lib/pull/119))
Added function to **specification** snapshot.
- ([#121](https://github.com/sugarlabs/musicblocks-v4-lib/pull/121))
Removed custom type reliance for element name (`TElementName`).
- ([#120](https://github.com/sugarlabs/musicblocks-v4-lib/pull/120))
Updated package dependencies.
- ([#118](https://github.com/sugarlabs/musicblocks-v4-lib/pull/118))
Added validations in **specification** functions for registering and unregistering _syntax elements_.

## 1.0.0 [2022-01-26]

- Added 3 categories of components: **Syntax Representation**, **Execution Engine**, **Library**

  - **Syntax Representation**

    - Added **Element API**: represents **syntax elements** -- the atomic constructs for building
    programs. There are 2 kinds of **syntax elements**:
      - **Arguments** which return values. These are of 2 types:
        - **Data** which return a value inherently and without operating on other provided values
        - **Expression** which return a value after operating on other provided values
      - **Instructions** which perform a task. These are of 2 types:
        - **Statements** perform a single task
        - **Blocks** encapsulate _statements_ and generally set some states or control the flow to them

    - Added **Specification** component: maintains a table of concrete **syntax elements** which can
    be used to build programs.
    - Added **Warehouse** component: maintains a table of instances of **syntax elements** registered
    in the **specification**. It can also generate statistics about the instances.
    - Added **Syntax Tree** component: represents the _abstract syntax tree_ or _AST_ by maintaining
    interconnections between **syntax elements**.

  - **Execution Engine**

    - Added **Symbol Table** component: maintains tables of dynamic global variables and states which
    the **syntax elements** can use during execution.
    - Added **Parser** component: parses the **syntax tree** in a postorder sequence, and maintains
    _call frame stacks_ and the _program counter_.
    - Added **Interpreter** component: fetches elements from the **parser** and executes them.

    - There are 2 special constructs: **Process** and **Routine**. These are special _block_ elements.
    **Routines** encapsulate _instructions_ that can be executed by multiple **processes**. **Processes**
    encapsulate independent set of _instructions_, and multiple **processes** can run concurrently.
    - There is an additional terminology called **crumbs** which are sets of connected _syntax elements_
    not part of any _process_ or _routine_.

  - **Library**

    - Added basic **Concrete Syntax Elements**
      - **Values**
        - Represent stored values
        - Supports `boolean`, `number`, `string` data-types
      - **Boxes**
        - Represents variable values
        - Support `boolean`, `number`, `string`, `generic` data-types
      - **Box Identifiers**
        - Represents variable identifiers
        - Supports `boolean`, `number`, `string`, `generic` **boxes**
      - **Math Operators**
        - `plus`, `minus`, `times`, `divide`, `modulus` operators
      - **Conditionals**: `if`
      - **Loops**: generic `repeat`
      - **Program**: `process` and `routine`
      - **Miscellaneous**: `print`
    - Added a _specification_ of the above **syntax elements**
