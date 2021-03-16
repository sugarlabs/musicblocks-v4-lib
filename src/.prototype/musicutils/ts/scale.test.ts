/**
 * Unit tests for scale
 */

import { Scale } from './scale';

const compare_scales = (scale1:string[], scale2:string[]) => {
    
    if(scale1.length != scale2.length) 
        return false;

    scale1 = scale1.slice(-1);
    scale1.sort();
    scale2 = scale2.slice(-1);
    scale2.sort();
    
    for(let i=0;i < scale1.length;i++){
        if(scale1[i] != scale2[i])
            return false;
    }
    return true;


};
describe('SCALE TESTS', () => {
    const s = new Scale([2, 2, 1, 2, 2, 2, 1], 0);
    test("c major ", () => {
        // C Major
        expect(compare_scales(s.get_scale(), ["n0", "n2", "n4", "n5", "n7", "n9", "n11", "n0"])).toBe(true);
    });

    test("get scale when pitch_format is passed as an argument", () => {
        expect(compare_scales(s.get_scale([
            "c",
            "c#",
            "d",
            "d#",
            "e",
            "f",
            "f#",
            "g",
            "g#",
            "a",
            "a#",
            "b",            
        ]),
        ["c", "d", "e", "f", "g", "a", "b", "c"])).toBe(true);
    });

    const s1 = new Scale([2, 2, 1, 2, 2, 2, 1], 7); // G major 
    test("g major", () => {
        expect(compare_scales(
            s1.get_scale(), ["n7", "n9", "n11", "n0", "n2", "n4", "n6", "n7"]
        )).toBe(true);
    });

    test("Scale and ocatve delta ", () => {
        expect(s1.get_scale_and_octave_deltas()[1][3]).toBe(1);
    });


})