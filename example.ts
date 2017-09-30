import {compareSysData} from "./index";

class MySys {
    public name : string;
    constructor(private n: number) {
        this.name = `sys ${this.n}`;
    }

    public async getInfo() {
        return this.n;
    }
}

console.log(`~~~ Example ~~~`);
(async() => {
    const res = await compareSysData<MySys, number>([
            new MySys(1),
            new MySys(1),
            new MySys(1),
            new MySys(3),
            new MySys(5),
        ],
        s => s.getInfo(),
        (d1, d2) => ({success: d1 == d2, delta: d1 - d2 }),
        'linear'
    );

    console.log(res.results);
})();