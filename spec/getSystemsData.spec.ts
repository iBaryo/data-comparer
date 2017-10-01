import {getSysData} from "../src/getSysData";
import {SysMock} from "./SysMock";

require('jasmine-co').install();

describe('getSysData', () => {
    let mockResults : Array<any>;

    beforeEach(() => {
        mockResults = [false, 1, '2', {x: 3}, Promise.resolve(4)]
    });

    it('should return empty data and error maps when there are no systems', async() => {
        const res = await getSysData<SysMock, any>([], sys => sys.getVal());
        expect(res.datas).toEqual(jasmine.any(Map));
        expect(res.datas.size).toBe(0);
        expect(res.errors).toEqual(jasmine.any(Map));
        expect(res.errors.size).toBe(0);
    });

    it(`should return the system's result`, async() => {
        const mockSys = new SysMock(mockResults[0]);
        const res = await getSysData<SysMock, any>(
            [mockSys],
            sys => sys.getVal()
        );
        expect(res.datas.size).toBe(1);
        expect(res.datas.has(mockSys)).toBeTruthy();
        expect(res.datas.get(mockSys)).toBe(mockResults[0]);
        expect(res.errors.size).toBe(0);
    });

    it(`should return the system's async result`, async() => {
        const mockSys = new SysMock(mockResults[0]);
        const res = await getSysData<SysMock, any>(
            [mockSys],
            sys => sys.getValAsync()
        );
        expect(res.datas.size).toBe(1);
        expect(res.datas.has(mockSys)).toBeTruthy();
        expect(res.datas.get(mockSys)).toBe(mockResults[0]);
        expect(res.errors.size).toBe(0);
    });

    it(`should return different systems' results`, async() => {
        const mockSystems = mockResults.map(res => new SysMock(res));
        const res = await getSysData<SysMock, any>(
            mockSystems,
            sys => sys.getVal()
        );

        expect(res.datas.size).toBe(mockSystems.length);
        for (let i in mockSystems) {
            const sys = mockSystems[i];
            expect(res.datas.has(sys)).toBeTruthy();

            const expRes = mockResults[i];
            expect(res.datas.get(sys)).toBe(expRes instanceof Promise ? await expRes : expRes);
        }

        expect(res.errors.size).toBe(0);
    });

    it('should save system error', async() => {
        const mockSys = new SysMock(mockResults[0], true);
        const res = await getSysData<SysMock, any>(
            [mockSys],
            sys => sys.getVal()
        );
        expect(res.datas.size).toBe(0);
        expect(res.errors.size).toBe(1);
        expect(res.errors.has(mockSys)).toBeTruthy();
        expect(res.errors.get(mockSys)).toBe(mockResults[0]);
    });

    it('should save async system error', async() => {
        const mockSys = new SysMock(mockResults[0], true);
        const res = await getSysData<SysMock, any>(
            [mockSys],
            sys => sys.getValAsync()
        );
        expect(res.datas.size).toBe(0);
        expect(res.errors.size).toBe(1);
        expect(res.errors.has(mockSys)).toBeTruthy();
        expect(res.errors.get(mockSys)).toBe(mockResults[0]);
    });

    it(`should return different systems' errors`, async() => {
        const mockSystems = mockResults.map(res => new SysMock(res, true));
        const res = await getSysData<SysMock, any>(
            mockSystems,
            sys => sys.getVal()
        );

        expect(res.errors.size).toBe(mockSystems.length);
        for (let i in mockSystems) {
            const sys = mockSystems[i];
            expect(res.errors.has(sys)).toBeTruthy();

            const expRes = mockResults[i];
            expect(res.errors.get(sys)).toBe(expRes);
        }

        expect(res.datas.size).toBe(0);
    });

    it(`should return different systems' errors and data`, async() => {
        const mockSystems = mockResults.map((res, i) => new SysMock(res, i % 2 != 0));
        const res = await getSysData<SysMock, any>(
            mockSystems,
            sys => sys.getVal()
        );

        expect(res.datas.size).toBe(Math.floor(mockSystems.length / 2) + (mockSystems.length % 2));
        expect(res.errors.size).toBe(Math.floor(mockSystems.length / 2));

        for (let i in mockSystems) {
            const sys = mockSystems[i];
            const resultType = sys.shouldThrow ? res.errors : res.datas;
            expect(resultType.has(sys)).toBeTruthy();

            const expRes = mockResults[i];
            expect(resultType.get(sys)).toBe(!sys.shouldThrow && expRes instanceof Promise ? await expRes : expRes);
        }
    });
});