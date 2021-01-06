import { Agegroup } from "./Agegroup";
import { Sexes } from "./Sexes";
import { Types } from "./Types";
import { Discipline } from "./Discipline";

class CalculatorDiscipline {

    private readonly name: string;
    private readonly record: number;
    private time: number;

    constructor(discipline: Discipline, sex: Sexes) {
        this.name = discipline.getName();
        this.record = discipline.getRecord(sex);
        this.time = 0;
    }

    public getName(): string {
        return this.name;
    }

    public getRecord(): number {
        return this.record;
    }

    public getTime(): number {
        return this.time;
    }

    public setTime(time: number): void {
        this.time = time;
    }

    public getPoints(): number {
        var time = this.getTime();
        var record = this.getRecord();

        var points = 0.0;
        if (time > 0.005) {
            var ratio = time / record;
            if (ratio >= 5) {
                points = 0.0;
            } else if (ratio >= 2) {
                points = 2000.0 / 3.0 - 400.0 / 3.0 * ratio;
            } else {
                points = 467.0 * ratio * ratio - 2001.0 * ratio + 2534.0;
            }
            points = Math.round(points * 100.0) / 100.0;
        }

        return points;
    }
}

class CalculatorAgegroup {
    private readonly name: string;
    private readonly sex: Sexes;
    private readonly maxUsedAmount: number;
    private readonly disciplines: CalculatorDiscipline[];

    constructor(agegroup: Agegroup, sex: Sexes) {
        this.name = agegroup.getName();
        this.sex = sex;
        this.maxUsedAmount = agegroup.getMaxUsedAmount();
        this.disciplines = agegroup.getDisciplines().map(d => new CalculatorDiscipline(d, sex));
    }

    public getName(): string {
        return this.name;
    }

    public getSex(): Sexes {
        return this.sex;
    }
    public getDiscipline(index: number): CalculatorDiscipline {
        return this.disciplines[index];
    }

    getPointsSum(): number {
        var points = this.disciplines.map(d => d.getPoints()).sort((p1, p2) => p2 - p1).slice(0, this.maxUsedAmount);
        var sum = 0.0;
        points.forEach(p => sum += p);
        return sum;
    }

    public getDisciplineName(index: number): string {
        return this.disciplines[index].getName();
    }

    public getDisciplineCount(): number {
        return this.disciplines.length;
    }
}

export class Calculator {
    private agegroup: CalculatorAgegroup;

    constructor() {
        this.agegroup = new CalculatorAgegroup(new Agegroup(Types.individual, "", 0, []), Sexes.female);
    }

    public setAgegroup(agegroup: Agegroup, sex: Sexes): void {
        this.agegroup = new CalculatorAgegroup(agegroup, sex);
    }

    public getSex(): Sexes {
        return this.agegroup.getSex();
    }

    public getAgegroup(): string {
        return this.agegroup.getName();
    }

    private getDiscipline(index: number) {
        return this.agegroup.getDiscipline(index);
    }

    public getDisciplineCount(): number {
        return this.agegroup.getDisciplineCount();
    }

    public getDisciplineName(index: number): string {
        return this.agegroup.getDisciplineName(index);
    }

    public getTime(index: number): number {
        return this.agegroup.getDiscipline(index)?.getTime() ?? 0;
    }

    public getInputTime(index: number): number {
        var time = Math.round(this.getTime(index) * 100);
        var x = time % 6000 + (Math.floor(time / 6000) * 10000);
        return x;
    }

    public setInputTime(index: number, inputTime: number) {
        var minutes = Math.floor(inputTime / 10000);
        var seconds = (inputTime % 10000) / 100.0;
        this.setTime(index, minutes * 60.0 + seconds);
    }

    public getFormattedTime(index: number): string {
        return this.formatTime(this.getTime(index));
    }

    public getRecord(index: number): string {
        return this.formatTime(this.getDiscipline(index)?.getRecord() ?? 0);
    }

    public getPoints(index: number): string {
        return this.formatPoints(this.getDiscipline(index)?.getPoints() ?? 0);
    }

    public getPointsSum(): string {
        return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.agegroup.getPointsSum());
    }

    private setTime(index: number, time: number) {
        this.agegroup.getDiscipline(index)?.setTime(time);
    }

    private formatPoints(points: number): string {
        return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(points);
    }

    private formatTime(time: number) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time % 60);
        var hundrets = Math.round((time % 1) * 100);

        var text = "";
        text += minutes + ":";
        text += (seconds < 10 ? "0" : "") + seconds + ",";
        text += (hundrets < 10 ? "0" : "") + hundrets;
        return text;
    }
}
