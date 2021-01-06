import { Sexes } from "./Sexes";

export class Record {

    private readonly sex: Sexes;
    private readonly record: number;

    constructor(sex: Sexes, record: number) {
        this.sex = sex;
        this.record = record;
    }

    public getSex(): Sexes {
        return this.sex;
    }

    public getRecord() {
        return this.record;
    }
}
