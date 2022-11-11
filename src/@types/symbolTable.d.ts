/**
 * Interface for a tree-like data structure which transparently exposes a flat-map object.
 * @typeParam T an object type (lists the keys and their respective value types)
 */
// eslint-disable-next-line
export interface ILayeredMap<T extends Object> {
    /** Root frame ID. */
    get rootID(): string;
    /**
     * Adds a new child frame from a parent frame.
     * @param frameParentID parent frame ID
     * @throws UndefinedError if frame with frameParentID doesn't exist
     */
    addFrame(frameParentID: string): string;
    /**
     * Removes an existing frame.
     * @param frameID frame ID
     * @throws UndefinedError if frame with frameID doesn't exist
     * @throws InvalidOperationError if frameID is ID of root frame
     * @throws InvalidOperationError if frame with frameID has child frames
     */
    removeFrame(frameID: string): void;
    /**
     * Updates the key-value dictionary of a frame.
     * @param frameID frame ID
     * @param keyMap new key-value dictionary
     * @throws InvalidOperationError if frame ID doesn't exist
     */
    updateFrameKeyMap(frameID: string, keyMap: T): void;
    /**
     * Returns a flat key-value dictionary projected until the root frame from a frame.
     * @param frameID frame ID
     * @throws InvalidOperationError if frame ID doesn't exist
     */
    projectFlatMap(frameID: string): T;
}

// == context ======================================================================================

/**
 * Interface for a `Context` instance.
 * @typeParam T type-definition of the context.
 */
// eslint-disable-next-line
export interface IContext<T extends Object> {
    /** Context ID. */
    get contextID(): string;
    /** Global key-value dictionary of the context. */
    get contextGlobalKeyMap(): T;
    set contextGlobalKeyMap(keyMap: T);
    /** Local key-value dictionary of the context. */
    get contextLocalKeyMap(): T;
    set contextLocalKeyMap(keyMap: T);
}

/** Interface for a `Context` stack. */
// eslint-disable-next-line
export interface IContextStack<T extends Object> extends IContext<T> {
    /** Pushes a new context frame into the stack. */
    pushFrame(): void;
    /**
     * Removes topmost context frame from the stack.
     * @throws InvalidOperationError if popping root frame
     */
    popFrame(): void;
}

/** Interface for a `Context` manager. */
// eslint-disable-next-line
export interface IContextManager<T extends Object> {
    /** Creates a new context stack. */
    createContextStack(): IContextStack<T>;
    /**
     * Returns an existing context stack.
     * @param contextStackID context stack ID
     * @throws InvalidAccessError if context stack with contextStackID doesn't exist
     */
    getContextStack(contextStackID: string): IContextStack<T>;
    /**
     * Removes an existing context stack.
     * @param contextStackID context stack ID
     * @throws InvalidAccessError if context stack with contextStackID doesn't exist
     */
    removeContextStack(contextStackID: string): void;
    /** Global key-value dictionary of the context set. */
    get contextGlobalKeyMap(): T;
    /**
     * Updates the global key-value dictionary of the context set.
     * @param keyMap new key-value dictionary
     * @param commit whether to persist the new dictionary over reset cycles
     */
    updateContextGlobalKeyMap(keyMap: T, commit?: boolean): void;
    /** Resets states. */
    reset(): void;
}
