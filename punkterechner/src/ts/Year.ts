import { Agegroup } from "./Agegroup";

export class Year {
    private readonly year: number;
    private readonly agegroups: Agegroup[];

    constructor(year: number, agegroups: Agegroup[]) {
        this.year = year;
        this.agegroups = agegroups;
    }

    public getYear(): number {
        return this.year;
    }

    public getAgegroups(): Agegroup[] {
        return this.agegroups;
    }
}
