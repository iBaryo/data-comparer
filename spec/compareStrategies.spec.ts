import {CompareStrategies} from "../src/CompareStrategies";
import {SysMock} from "./SysMock";

const factorial = require('factorial');

describe('compareStrategies', () => {
    const mockSystems = [
        new SysMock(1),
        new SysMock(2),
        new SysMock(1),
        new SysMock(1),
        new SysMock(1)
    ];
    const mockCompare = (d1, d2) => ({success: d1 == d2});
    const mockData = new Map<SysMock, any>(mockSystems.map(sys => [sys, sys.getVal()]) as Array<any>);

    it('linear', () => {
        const res = CompareStrategies.linear<SysMock, any>(
            mockData,
            mockCompare
        );

        expect(res.length).toBe(mockSystems.length - 1);
        for (let i = 0; i < res.length; ++i) {
            expect(res[i].sys1).toBe(mockSystems[i]);
            expect(res[i].sys2).toBe(mockSystems[i + 1]);
            expect(res[i].result).toEqual(mockCompare(mockSystems[i].getVal(), mockSystems[i + 1].getVal()));
        }
    });

    it('mesh', () => {
        const res = CompareStrategies.mesh<SysMock, any>(
            mockData,
            mockCompare
        );

        expect(res.length).toBe(factorial(mockSystems.length)/(factorial(mockSystems.length - 2)*factorial(2)));
        mockSystems.forEach(sys =>
            expect(
                res.filter(r => r.sys1 == sys || r.sys2 == sys).length
            ).toBe(mockSystems.length - 1)
        );
    });
});