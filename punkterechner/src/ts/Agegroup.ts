import { Types } from "./Types";
import { Discipline } from "./Discipline";

export class Agegroup {

    private readonly name: string;
    private readonly maxUsedAmount: number;
    private readonly disciplines: Discipline[];
    private readonly type: Types;

    constructor(type: Types, name: string, maxUsedAmount: number, disciplines: Discipline[]) {
        this.type = type;
        this.maxUsedAmount = maxUsedAmount;
        this.name = name;
        this.disciplines = disciplines;
    }

    public getType(): Types {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }

    public getMaxUsedAmount(): number {
        return this.maxUsedAmount;
    }

    public getDisciplines(): Discipline[] {
        return this.disciplines;
    }
}