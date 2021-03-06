#Data Comparer
Comparing data easily from the same api of different systems (useful after migrations).

## Install
```
npm i data-comparer
```

## Usage
```typescript
import {compareSysData, Validator} from "data-comparer";

// Lets say we have a class to wrap my system's api, customizable to different environments
class MySys {
    public name: string;

    constructor(private env: number) {
        this.name = `sys ${this.env}`;
    }

    // We can query the data using an async api method.
    public async getInfo() {
        return this.env;
    }
}

// Lets define our relevant environments
const mySystems = [
    new MySys(1),
    new MySys(1),
    new MySys(1),
    new MySys(3),
    new MySys(5),
];

console.log(`~~~ Example ~~~`);
(async() => {

    console.log('==== via class:');
    // Create a validator for our tested systems.
    const validator = new Validator<MySys>(mySystems);

    // Now validating with...
    let res = await validator.validate<number>({
        query: sys => sys.getInfo(), // How we query each system (supports promises)
        compare: (d1, d2) => ({success: d1 == d2, delta: d1 - d2}), // How we compare two sets of system data
        strategy: 'mesh' // The compare strategy - more later
    });

    console.log(res.queryErrors); // Errors from querying data
    console.log(res.results); // Comparison results



    console.log('==== comparing via function:');
    res = await compareSysData<MySys, number>(
        mySystems, // Our tested api wrappers
        sys => sys.getInfo(), // How we query each system (supports promises)
        (d1, d2) => ({success: d1 == d2, delta: d1 - d2}), // How we compare two sets of system data
        'linear'
    );

    console.log(res.results);
})();
```

###Compare Strategies
* linear: sys1 with sys2, sys2 with sys3, sys3 with sys4, etc.
* mesh: each system with each other system.
* or just send a custom function from type:
```typescript
export type CompareStrategyFn<T extends System, D> = (datas: Map<T, D>, compare: CompareFn<D>) => CompareInfo<T>[];
export interface CompareInfo<T extends System> {
    sys1 : T,
    sys2 : T,
    result : CompareResult|Promise<CompareResult>
}
export interface CompareResult {
    success: boolean;
}
```

##Running the example
After cloning the repo',
```
npm i && npm start
```
for running the tests
```
npm test
```