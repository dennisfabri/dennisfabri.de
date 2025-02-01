import { Calculator } from './Calculator';
import { Types } from "./Types";
import { Sexes } from "./Sexes";
import { Agegroup } from "./Agegroup";
import { Year } from "./Year";
import { YearAgegroup, TimesHistory } from "./TimesHistory";
import { Chart } from "../../node_modules/chart.js/dist/chart.js";

export class Controller {
    private parent: HTMLElement | null;
    private prefix: string;

    private settingsId: string;
    private formId: string;
    private chartId: string;
    private historyId: string;

    private typeId: string;
    private agegroupId: string;
    private sexId: string;

    private data: Year[];

    private calculator: Calculator;

    private calculators: Calculator[];

    constructor() {
        this.data = [];
        this.calculator = new Calculator();
        this.calculators = [];

        this.parent = null;
        this.prefix = "";
        this.settingsId = "";
        this.formId = "";
        this.chartId = "";
        this.historyId = "";
        this.typeId = "";
        this.agegroupId = "";
        this.sexId = "";
    }

    public configure(parentId: string, data: Year[]): void {
        this.data = data;

        this.data.forEach(element => {
            this.calculators.push(new Calculator());
        });

        if (document != null) {
            this.parent = document.getElementById(parentId);
        }
        this.prefix = parentId + "_";

        this.settingsId = this.prefix + "settings";
        this.formId = this.prefix + "form";
        this.chartId = this.prefix + "chart";
        this.historyId = this.prefix + "history";
        this.typeId = this.prefix + "type";
        this.agegroupId = this.prefix + "agegroup";
        this.sexId = this.prefix + "sex";
    }

    private removeOptions(select: HTMLSelectElement) {
        var length = select.options.length;
        for (var i = length - 1; i >= 0; i--) {
            select.options.remove(i);
        }
    }

    private getTypeHTMLElement(): HTMLSelectElement {
        return document.getElementById(this.typeId) as HTMLSelectElement;
    }

    private getAgegroupHTMLElement(): HTMLSelectElement {
        return document.getElementById(this.agegroupId) as HTMLSelectElement;
    }

    private getSexHTMLElement(): HTMLSelectElement {
        return document.getElementById(this.sexId) as HTMLSelectElement;
    }

    private getFormHTMLElement(): HTMLDivElement {
        return document.getElementById(this.formId) as HTMLDivElement;
    }

    private getYear(): Year {
        return this.data[0];
    }

    private getType(): Types {
        var index = this.getTypeHTMLElement().selectedIndex;
        return index == 0 ? Types.individual : Types.team;
    }

    private getAgegroup(): Agegroup {
        var index = this.getAgegroupHTMLElement().selectedIndex;
        return this.getYear().getAgegroups().filter(a => a.getType() == this.getType())[index];
    }

    private getSex(): Sexes {
        var index = this.getSexHTMLElement().selectedIndex;
        return index == 0 ? Sexes.female : Sexes.male;
    }

    private updateAgegroups() {
        var aks = document.getElementById(this.agegroupId) as HTMLSelectElement;

        this.removeOptions(aks);

        var year = this.getYear();
        var type = this.getType();

        var items = year.getAgegroups().filter(ag => ag.getType() == type).map(ag => ag.getName());

        items.forEach(function (value) {
            var element = document.createElement("option");
            element.innerText = value;
            aks.appendChild(element);
        });

        this.resetForm();
    }

    private getTimeId(index: number) {
        return this.prefix + "time_" + index;
    }

    private getFormattedTimeId(index: number) {
        return this.prefix + "formatted_" + index;
    }

    private getPointsId(index: number) {
        return this.prefix + "points_" + index;
    }

    private getPointsSumId() {
        return this.prefix + "pointssum";
    }

    private updateForm() {
        for (var x = 0; x < this.calculator.getDisciplineCount(); x++) {
            var timeId = this.getTimeId(x);
            var formattedTimeId = this.getFormattedTimeId(x);
            var pointsId = this.getPointsId(x);

            var time = this.calculator.getInputTime(x);
            var timeString = time > 0.5 ? "" + time : "";
            var formattedTimeString = this.calculator.getFormattedTime(x);
            var points = this.calculator.getFormattedPoints(x);

            var timeInputElement = document.getElementById(timeId) as HTMLInputElement;
            if (timeInputElement.value != timeString) {
                timeInputElement.value = timeString;
            }

            var formattedTimeElement = document.getElementById(formattedTimeId) as HTMLTableDataCellElement;
            formattedTimeElement.innerHTML = formattedTimeString;

            var pointsElement = document.getElementById(pointsId) as HTMLTableDataCellElement;
            pointsElement.innerHTML = points;
        };

        var pointsSum = this.calculator.getFormattedPointsSum();
        var pointsSumId = this.getPointsSumId();
        var pointsSumElement = document.getElementById(pointsSumId) as HTMLTableDataCellElement;
        pointsSumElement.innerHTML = pointsSum;

        this.updateHistory();
        this.updateHistoryTable();
    }

    private resetForm() {
        var form = this.getFormHTMLElement();

        var agegroupname = this.getAgegroup().getName();

        var dx = this.data.map(y => new YearAgegroup(y.getYear(), y.getAgegroups().filter(a => a.getType() == this.getType() && a.getName() == agegroupname)[0]));

        this.calculator.setAgegroup(this.getAgegroup(), this.getSex());

        var count = 0;
        this.data.forEach(year => {
            var entry = dx.filter(d => d.year == year.getYear())[0];
            if (entry != undefined && entry.agegroup != undefined) {
                this.calculators[count].setAgegroup(entry.agegroup, this.getSex());
            } else {
                this.calculators[count].resetAgegroup();
            }
            count++;
        });

        var html = ``;
        html += `<div style="background: #0077BB; color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width: 22.8em; float: left; clear: both;">Disziplin</div>`;
        html += `<div style="content: ''; float: left; background: #0077BB; text-color: #FFFFFF;">`;
        html += `  <div style="color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7.6em; float: left;">Eingabe</div>`;
        html += `  <div style="color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7.6em; float: left;">Zeit</div>`;
        html += `  <div style="color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7.6em; float: left;">Punkte</div>`;
        html += `</div>`;

        for (var x = 0; x < this.calculator.getDisciplineCount(); x++) {
            var name = this.calculator.getDisciplineName(x);
            var record = this.calculator.getRecord(x);
            var description = name + " (" + record + "):";

            var timeId = this.getTimeId(x);
            var formattedTimeId = this.getFormattedTimeId(x);
            var pointsId = this.getPointsId(x);

            var color = x % 2 == 0 ? "#FFFFFF" : "#f8f8ff";

            html += `<div style="                   padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width: 22.8em; float: left; clear: both; background: ` + color + `;">` + description + `</div>`;
            html += `<div style="content: ''; float: left; background: ` + color + `;">`;
            html += `  <div style="                   padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width:  7.6em; float: left;"><input onkeyup="getController().timeChanged('` + x + `')" style="text-align: right; line-height: 1; height: auto; padding: 0.2em; width: 100%;" name="` + timeId + `" id="` + timeId + `" type="text" size="6" maxlength="6" value=""/></div>`;
            html += `  <div style="text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7.6em; float: left;" id="` + formattedTimeId + `"></div>`;
            html += `  <div style="text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7.6em; float: left;" id="` + pointsId + `"></div>`;
            html += `</div>`;
        }

        var sumcolor = this.calculator.getDisciplineCount() % 2 == 0 ? "#FFFFFF" : "#f8f8ff";

        var pointsSumId = this.getPointsSumId();

        html += `<div style="border-top: 1px solid #e7eaed; text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; width: 22.8em; float: left; clear: both; background: ` + sumcolor + `;">&nbsp;</div>`;
        html += `<div style="content: ''; background: ` + sumcolor + `;">`;
        html += `  <div style="border-top: 1px solid #e7eaed; text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; width: 15.2em; float: left; background: ` + sumcolor + `;">Gesamtpunkte:</div>`;
        html += `  <div style="border-top: 1px solid #e7eaed; text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; width:  7.6em; float: left; background: ` + sumcolor + `;" id="` + pointsSumId + `"></div>`;
        html += `</div>`;

        form.innerHTML = html;

        this.updateForm();
    }

    private updateHistory(): void {
        var history = new TimesHistory(this.calculator);

        var count = 0;
        this.calculators.forEach(c => {
            history.add(this.data[count].getYear(), c);
            count++;
        });

        var ctx = (document.getElementById(this.chartId) as HTMLCanvasElement);
        ctx.innerHTML = "";
        var chartdata = history.getChartData();
        if (this.chart == undefined) {
            this.chart = new Chart(ctx, chartdata);
        } else {
            this.chart.data = chartdata.data;
        }
        this.chart.update(0);
    }

    private updateHistoryTable(): void {
        var history = new TimesHistory(this.calculator);

        var count = 0;
        this.calculators.forEach(c => {
            history.add(this.data[count].getYear(), c);
            count++;
        });

        var html = history.getHistoryTable();

        var element = document.getElementById(this.historyId);
        if (element != null) {
            element.innerHTML = html;
        }
    }

    private chart: Chart | undefined;

    public typeChanged(): void {
        this.updateAgegroups();
    }

    public agegroupChanged(): void {
        this.resetForm();
    }

    public sexChanged(): void {
        this.resetForm();
    }

    public timeChanged(index: number): void {
        var timeElement = document.getElementById(this.getTimeId(index)) as HTMLInputElement;
        var timeString = timeElement.value.replace(/[^0-9]/gi, '');
        if (timeString != timeElement.value) {
            timeElement.value = timeString;
        }
        var rawTime = parseInt(timeString);
        if (isNaN(rawTime)) {
            rawTime = 0;
        }

        this.calculator.setInputTime(index, rawTime);

        var disciplineName = this.calculator.getDisciplineName(index);

        this.calculators.forEach(c => {
            for (var x = 0; x < c.getDisciplineCount(); x++) {
                if (c.getDisciplineName(x) == disciplineName) {
                    c.setInputTime(x, rawTime);
                }
            }
        });

        this.updateForm();
    }

    public initialize() {
        var html = '';
        html += `<div style="width: auto; padding: 0px; content: ''; display: table; clear: both;" id="` + this.settingsId + `">`;
        html += `<label style="padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width: 22.8em; float: left; clear: both;" for="`+ this.typeId + `"    >Typ:</label><select onchange="getController().typeChanged()"              name="` + this.typeId + `"     id="` + this.typeId + `"     style="margin-top: 0.2em; margin-right: 0.2em; width: 22.8em; float: left;"><option>Einzel</option><option>Mannschaft</option></select>`;
        html += `<label style="padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width: 22.8em; float: left; clear: both;" for="`+ this.agegroupId + `">Altersklasse:</label><select onchange="getController().agegroupChanged()" name="` + this.agegroupId + `" id="` + this.agegroupId + `" style="margin-top: 0.2em; margin-right: 0.2em; width: 22.8em; float: left;"></select>`;
        html += `<label style="padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width: 22.8em; float: left; clear: both;" for="`+ this.sexId + `"     >Geschlecht:</label><select onchange="getController().sexChanged()"        name="` + this.sexId + `"      id="` + this.sexId + `"      style="margin-top: 0.2em; margin-right: 0.2em; width: 22.8em; float: left;"><option>weiblich</option><option>m&auml;nnlich</option></select>`;
        html += `</div>`;
        html += `<br/>`;
        html += `<div style="border: 1px solid #0077BB; width: auto; padding: 0px; content: ''; display: table; clear: both;" id="` + this.formId + `"></div>`;
        html += `<div style="border: 1px solid #0077BB; width: auto; padding: 0px; margin-top: 2em; width: min(100%, 50em);"><canvas id="` + this.chartId + `"></canvas></div>`;
        html += `<div style="border: 1px solid #0077BB; width: auto; padding: 0px; margin-top: 2em; width: min(100%, 50em);" id="` + this.historyId + `"></div>`;

        if (this.parent != null) {
            this.parent.innerHTML = html;
        }

        this.updateAgegroups();
        this.resetForm();
    }
}

var controller = new Controller();

export function getController() {
    return controller;
}