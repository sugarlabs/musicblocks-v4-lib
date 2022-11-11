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
