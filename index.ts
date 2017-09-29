import {compareSysData} from "./src/Comparer";

class MySys {
    constructor(private n: number) {
    }

    public async getInfo() {
        return this.n;
    }
}


(async() => {
    const res = await compareSysData<MySys, number>([
            new MySys(1),
            new MySys(2)
        ],
        s => s.getInfo(),
        (d1, d2) => {console.log(d2); return Promise.resolve({success: d1 == d2})},
        'linear'
    );

    console.log(res.results[0]);
})();