import {compareSysData} from "../src/compareSysData";
import {SysMock} from "./SysMock";
import {QueryError, QueryResult} from "../src/QueryInterfaces";
import {CompareInfo} from "../src/CompareInterfaces";
import Spy = jasmine.Spy;

require('jasmine-co').install();

describe('compareSysData', () => {
    const mockQuery = sys => sys.getVal();
    const mockQueryRes = {
        datas: new Map<SysMock, any>(),
        errors: new Map<SysMock, QueryError>()
    } as QueryResult<SysMock, any>;
    const mockCompareInfo = [] as CompareInfo<SysMock>[];

    let mockSysQuery: Spy;
    let mockCompareStrategy: Spy;
    let mockCompare: Spy;

    beforeEach(() => {
        mockSysQuery = jasmine.createSpy('mock query').and.returnValue(Promise.resolve(mockQueryRes));
        mockCompareStrategy = jasmine.createSpy('mock compare strat').and.returnValue(mockCompareInfo);
        mockCompare = jasmine.createSpy('mock compare', (d1, d2) => ({success: d1 == d2}));
    });

    describe('validations', () => {
        it(`should throw if given less than two systems to compare`, async() => {
            try {
                await compareSysData<SysMock, any>(
                    undefined,
                    sys => sys.getVal(),
                    mockCompare,
                    mockCompareStrategy,
                    mockSysQuery
                );
                fail('did not throw');
            } catch (e) {
                // success
            }

            try {
                await compareSysData<SysMock, any>(
                    [],
                    sys => sys.getVal(),
                    mockCompare,
                    mockCompareStrategy,
                    mockSysQuery
                );
                fail('did not throw');
            } catch (e) {
                // success
            }

            try {
                await compareSysData<SysMock, any>(
                    [new SysMock(1)],
                    sys => sys.getVal(),
                    (d1, d2) => ({success: d1 == d2}),
                    mockCompareStrategy,
                    mockSysQuery
                );
                fail('did not throw');
            } catch (e) {
                // success
            }
        });

        it(`should throw if given no compare strategy`, async() => {
            try {
                const res = await compareSysData<SysMock, any>(
                    [new SysMock(1), new SysMock(2), new SysMock(3),],
                    sys => sys.getVal(),
                    mockCompare,
                    undefined,
                    mockSysQuery
                );
                fail('did not throw');
            } catch (e) {
                // success
            }
        });
    });

    it(`should query data and send it to compare strategy`, async() => {
        const mockSystems = [new SysMock(1), new SysMock(2), new SysMock(3),];
        try {

            await compareSysData<SysMock, any>(
                mockSystems,
                mockQuery,
                mockCompare,
                mockCompareStrategy,
                mockSysQuery
            );

            expect(mockSysQuery).toHaveBeenCalledWith(mockSystems, mockQuery);
            expect(mockCompareStrategy).toHaveBeenCalledWith(mockQueryRes.datas, mockCompare);
        } catch (e) {
            fail(e);
        }
    });

    it(`should return query errors and comparing results`, async() => {
        const mockSystems = [new SysMock(1), new SysMock(2), new SysMock(3),];
        try {
            const res = await compareSysData<SysMock, any>(
                mockSystems,
                sys => sys.getVal(),
                mockCompare,
                mockCompareStrategy,
                mockSysQuery
            );

            expect(res.queryErrors).toBe(mockQueryRes.errors);
            expect(res.results).toBe(mockCompareInfo);
        } catch (e) {
            fail(e);
        }
    });
});