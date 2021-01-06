import { Record } from './Record';
import { Sexes } from "./Sexes";

interface Map<T> {
    [key: string]: T;
}

export class Discipline {

    private readonly name: string;
    private readonly records: Map<Record> = {};

    constructor(name: string, records: Record[]) {
        this.name = name;
        for (var record of records) {
            this.records[record.getSex()] = record;
        }
    }

    getRecord(sex: Sexes): number {
        var record = this.records[sex];
        if (record == null) {
            return 0;
        }
        return record.getRecord();
    }

    getName(): string {
        return this.name;
    }
}
