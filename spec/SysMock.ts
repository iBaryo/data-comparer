export class SysMock {
    constructor(public result: any, public shouldThrow = false) {
    }

    public getVal() {
        if (this.shouldThrow)
            throw this.result;
        return this.result;
    }

    public async getValAsync() {
        return this.getVal();
    }
}