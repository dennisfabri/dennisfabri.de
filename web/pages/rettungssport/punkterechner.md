---
layout: page
title: Punkterechner
date: 2021-01-01 00:00
category: Rettungssport
author: Dennis Fabri
summary: 
permalink: /rettungssport/punkterechner.html
---

# Punkterechner

Der Punkterechner unterstützt die Berechnung von Punkten nach DLRG-Regelwerk mit
den Rec-Werten seit 2007. Die Wertung in der offenen Altersklasse im Einzel erfolgt
über die drei (3) besten Disziplinen. Dabei wird nicht berücksichtigt, ob maximal
vier Disziplinen angegeben wurden, wodurch man für einzelne Schwimmer in einem
Durchgang die Punkte für alle sechs Disziplinen ermitteln kann.

<!-- markdownlint-disable MD013  MD033 MD037-->

<div id="Calculator" />

<script>
var Types;
(function (Types) {
    Types["team"] = "team";
    Types["individual"] = "individual";
})(Types || (Types = {}));
var Sexes;
(function (Sexes) {
    Sexes["female"] = "female";
    Sexes["male"] = "male";
    Sexes["mixed"] = "mixed";
})(Sexes || (Sexes = {}));
class Record {
    constructor(sex, record) {
        this.sex = sex;
        this.record = record;
    }
    getSex() {
        return this.sex;
    }
    getRecord() {
        return this.record;
    }
}
class Discipline {
    constructor(name, records) {
        this.records = {};
        this.name = name;
        for (var record of records) {
            this.records[record.getSex()] = record;
        }
    }
    getRecord(sex) {
        var record = this.records[sex];
        if (record == null) {
            return 0;
        }
        return record.getRecord();
    }
    getName() {
        return this.name;
    }
}
class Agegroup {
    constructor(type, name, maxUsedAmount, disciplines) {
        this.type = type;
        this.maxUsedAmount = maxUsedAmount;
        this.name = name;
        this.disciplines = disciplines;
    }
    getType() {
        return this.type;
    }
    getName() {
        return this.name;
    }
    getMaxUsedAmount() {
        return this.maxUsedAmount;
    }
    getDisciplines() {
        return this.disciplines;
    }
}
class Year {
    constructor(year, agegroups) {
        this.year = year;
        this.agegroups = agegroups;
    }
    getYear() {
        return this.year;
    }
    getAgegroups() {
        return this.agegroups;
    }
}
class CalculatorDiscipline {
    constructor(discipline, sex) {
        this.name = discipline.getName();
        this.record = discipline.getRecord(sex);
        this.time = 0;
    }
    getName() {
        return this.name;
    }
    getRecord() {
        return this.record;
    }
    getTime() {
        return this.time;
    }
    setTime(time) {
        this.time = time;
    }
    getPoints() {
        var time = this.getTime();
        var record = this.getRecord();
        var points = 0.0;
        if (time > 0.005) {
            var ratio = time / record;
            if (ratio >= 5) {
                points = 0.0;
            }
            else if (ratio >= 2) {
                points = 2000.0 / 3.0 - 400.0 / 3.0 * ratio;
            }
            else {
                points = 467.0 * ratio * ratio - 2001.0 * ratio + 2534.0;
            }
            points = Math.round(points * 100.0) / 100.0;
        }
        return points;
    }
}
class CalculatorAgegroup {
    constructor(agegroup, sex) {
        this.name = agegroup.getName();
        this.sex = sex;
        this.maxUsedAmount = agegroup.getMaxUsedAmount();
        this.disciplines = agegroup.getDisciplines().map(d => new CalculatorDiscipline(d, sex));
    }
    getName() {
        return this.name;
    }
    getSex() {
        return this.sex;
    }
    getDiscipline(index) {
        return this.disciplines[index];
    }
    getPointsSum() {
        var points = this.disciplines.map(d => d.getPoints()).sort((p1, p2) => p2 - p1).slice(0, this.maxUsedAmount);
        var sum = 0.0;
        points.forEach(p => sum += p);
        return sum;
    }
    getDisciplineName(index) {
        return this.disciplines[index].getName();
    }
    getDisciplineCount() {
        return this.disciplines.length;
    }
}
class Calculator {
    constructor() {
        this.agegroup = new CalculatorAgegroup(new Agegroup(Types.individual, "", 0, []), Sexes.female);
    }
    setAgegroup(agegroup, sex) {
        this.agegroup = new CalculatorAgegroup(agegroup, sex);
    }
    getSex() {
        return this.agegroup.getSex();
    }
    getAgegroup() {
        return this.agegroup.getName();
    }
    getDiscipline(index) {
        return this.agegroup.getDiscipline(index);
    }
    getDisciplineCount() {
        return this.agegroup.getDisciplineCount();
    }
    getDisciplineName(index) {
        return this.agegroup.getDisciplineName(index);
    }
    getTime(index) {
        var _a, _b;
        return (_b = (_a = this.agegroup.getDiscipline(index)) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0;
    }
    getInputTime(index) {
        var time = Math.round(this.getTime(index) * 100);
        var x = time % 6000 + (Math.floor(time / 6000) * 10000);
        return x;
    }
    setInputTime(index, inputTime) {
        var minutes = Math.floor(inputTime / 10000);
        var seconds = (inputTime % 10000) / 100.0;
        this.setTime(index, minutes * 60.0 + seconds);
    }
    getFormattedTime(index) {
        return this.formatTime(this.getTime(index));
    }
    getRecord(index) {
        var _a, _b;
        return this.formatTime((_b = (_a = this.getDiscipline(index)) === null || _a === void 0 ? void 0 : _a.getRecord()) !== null && _b !== void 0 ? _b : 0);
    }
    getPoints(index) {
        var _a, _b;
        return this.formatPoints((_b = (_a = this.getDiscipline(index)) === null || _a === void 0 ? void 0 : _a.getPoints()) !== null && _b !== void 0 ? _b : 0);
    }
    getPointsSum() {
        return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.agegroup.getPointsSum());
    }
    setTime(index, time) {
        var _a;
        (_a = this.agegroup.getDiscipline(index)) === null || _a === void 0 ? void 0 : _a.setTime(time);
    }
    formatPoints(points) {
        return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(points);
    }
    formatTime(time) {
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
class Controller {
    constructor() {
        this.data = [];
        this.calculator = new Calculator();
        this.parent = null;
        this.prefix = "";
        this.settingsId = "";
        this.formId = "";
        this.yearId = "";
        this.typeId = "";
        this.agegroupId = "";
        this.sexId = "";
    }
    configure(parentId, data) {
        this.data = data;
        if (document != null) {
            this.parent = document.getElementById(parentId);
        }
        this.prefix = parentId + "_";
        this.settingsId = this.prefix + "settings";
        this.formId = this.prefix + "form";
        this.yearId = this.prefix + "year";
        this.typeId = this.prefix + "type";
        this.agegroupId = this.prefix + "agegroup";
        this.sexId = this.prefix + "sex";
    }
    removeOptions(select) {
        var length = select.options.length;
        for (var i = length - 1; i >= 0; i--) {
            select.options.remove(i);
        }
    }
    getYearHTMLElement() {
        return document.getElementById(this.yearId);
    }
    getTypeHTMLElement() {
        return document.getElementById(this.typeId);
    }
    getAgegroupHTMLElement() {
        return document.getElementById(this.agegroupId);
    }
    getSexHTMLElement() {
        return document.getElementById(this.sexId);
    }
    getFormHTMLElement() {
        return document.getElementById(this.formId);
    }
    getYear() {
        var index = this.getYearHTMLElement().selectedIndex;
        return this.data[index];
    }
    getType() {
        var index = this.getTypeHTMLElement().selectedIndex;
        return index == 0 ? Types.individual : Types.team;
    }
    getAgegroup() {
        var index = this.getAgegroupHTMLElement().selectedIndex;
        return this.getYear().getAgegroups().filter(a => a.getType() == this.getType())[index];
    }
    getSex() {
        var index = this.getSexHTMLElement().selectedIndex;
        return index == 0 ? Sexes.female : Sexes.male;
    }
    updateAgegroups() {
        var aks = document.getElementById(this.agegroupId);
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
    updateYears() {
        var years = document.getElementById(this.yearId);
        this.removeOptions(years);
        var items = this.data.map(function (year) { return year.getYear(); });
        items.forEach(function (value) {
            var element = document.createElement("option");
            element.innerText = "" + value;
            years.appendChild(element);
        });
    }
    getSexTranslation(sex) {
        switch (sex) {
            case Sexes.female: return "weiblich";
            case Sexes.male: return "m&auml;nnlich";
            case Sexes.mixed: return "gemischt";
            default:
                return "-";
        }
    }
    getTimeId(index) {
        return this.prefix + "time_" + index;
    }
    getFormattedTimeId(index) {
        return this.prefix + "formatted_" + index;
    }
    getPointsId(index) {
        return this.prefix + "points_" + index;
    }
    getPointsSumId() {
        return this.prefix + "pointssum";
    }
    updateForm() {
        for (var x = 0; x < this.calculator.getDisciplineCount(); x++) {
            var timeId = this.getTimeId(x);
            var formattedTimeId = this.getFormattedTimeId(x);
            var pointsId = this.getPointsId(x);
            var time = this.calculator.getInputTime(x);
            var timeString = time > 0.5 ? "" + time : "";
            var formattedTimeString = this.calculator.getFormattedTime(x);
            var points = this.calculator.getPoints(x);
            var timeInputElement = document.getElementById(timeId);
            if (timeInputElement.value != timeString) {
                timeInputElement.value = timeString;
            }
            var formattedTimeElement = document.getElementById(formattedTimeId);
            formattedTimeElement.innerHTML = formattedTimeString;
            var pointsElement = document.getElementById(pointsId);
            pointsElement.innerHTML = points;
        }
        ;
        var pointsSum = this.calculator.getPointsSum();
        var pointsSumId = this.getPointsSumId();
        var pointsSumElement = document.getElementById(pointsSumId);
        pointsSumElement.innerHTML = pointsSum;
    }
    resetForm() {
        var form = this.getFormHTMLElement();
        this.calculator.setAgegroup(this.getAgegroup(), this.getSex());
        var html = `
          <div style="background: #0077BB; color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width: 22em; float: left; clear: both;">Disziplin</div>
          <div style="content: ''; float: left; background: #0077BB; text-color: #FFFFFF;">
            <div style="color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7em; float: left;">Eingabe</div>
            <div style="color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7em; float: left;">Zeit</div>
            <div style="color: #FFFFFF; text-align: center; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7em; float: left;">Punkte</div>
          </div>
          `;
        for (var x = 0; x < this.calculator.getDisciplineCount(); x++) {
            var name = this.calculator.getDisciplineName(x);
            var record = this.calculator.getRecord(x);
            var description = name + " (" + record + "):";
            var timeId = this.getTimeId(x);
            var formattedTimeId = this.getFormattedTimeId(x);
            var pointsId = this.getPointsId(x);
            var color = x % 2 == 0 ? "#FFFFFF" : "#f8f8ff";
            html += `<div style="                   padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width: 22em; float: left; clear: both; background: ` + color + `;">` + description + `</div>`;
            html += `<div style="content: ''; float: left; background: ` + color + `;">`;
            html += `  <div style="                   padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width:  7em; float: left;"><input onkeyup="getController().timeChanged('` + x + `')" style="text-align: right; line-height: 1; height: auto; padding: 0.2em; width: 100%;" name="` + timeId + `" id="` + timeId + `" type="text" size="6" maxlength="6" value=""/></div>`;
            html += `  <div style="text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7em; float: left;" id="` + formattedTimeId + `"></div>`;
            html += `  <div style="text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; border-top: 0px; width:  7em; float: left;" id="` + pointsId + `"></div>`;
            html += `</div>`;
        }
        var sumcolor = this.calculator.getDisciplineCount() % 2 == 0 ? "#FFFFFF" : "#f8f8ff";
        var pointsSumId = this.getPointsSumId();
        html += `<div style="border-top: 1px solid #e7eaed; text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; width: 22.0em; float: left; clear: both; background: ` + sumcolor + `;">&nbsp;</div>
                 <div style="content: ''; background: ` + sumcolor + `;">
                   <div style="border-top: 1px solid #e7eaed; text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; width: 14em; float: left; background: ` + sumcolor + `;">Gesamtpunkte:</div>
                   <div style="border-top: 1px solid #e7eaed; text-align: right; padding-right: 0.5em; padding-top: 0.25em; padding-bottom: 0.25em; width:  7em; float: left; background: ` + sumcolor + `;" id="` + pointsSumId + `"></div>
                 </div>`;
        form.innerHTML = html;
        this.updateForm();
    }
    yearChanged() {
        this.updateAgegroups();
    }
    typeChanged() {
        this.updateAgegroups();
    }
    agegroupChanged() {
        this.resetForm();
    }
    sexChanged() {
        this.resetForm();
    }
    timeChanged(index) {
        var timeElement = document.getElementById(this.getTimeId(index));
        var timeString = timeElement.value.replace(/[^0-9]/gi, '');
        if (timeString != timeElement.value) {
            timeElement.value = timeString;
        }
        var rawTime = parseInt(timeString);
        if (isNaN(rawTime)) {
            rawTime = 0;
        }
        this.calculator.setInputTime(index, rawTime);
        this.updateForm();
    }
    initialize() {
        var html = '';
        html += `
        <div style="width: auto; padding: 0px; content: ''; display: table; clear: both;" id="` + this.settingsId + `">
          <label style="padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width: 22em; float: left; clear: both;" for="` + this.typeId + `"    >Jahr:</label><select onchange="getController().yearChanged()"             name="` + this.yearId + `"     id="` + this.yearId + `"     style="margin-top: 0.2em; margin-right: 0.2em; width: 21em; float: left;"></select>
          <label style="padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width: 22em; float: left; clear: both;" for="` + this.typeId + `"    >Typ:</label><select onchange="getController().typeChanged()"              name="` + this.typeId + `"     id="` + this.typeId + `"     style="margin-top: 0.2em; margin-right: 0.2em; width: 21em; float: left;"><option>Einzel</option><option>Mannschaft</option></select>
          <label style="padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width: 22em; float: left; clear: both;" for="` + this.agegroupId + `">Altersklasse:</label><select onchange="getController().agegroupChanged()" name="` + this.agegroupId + `" id="` + this.agegroupId + `" style="margin-top: 0.2em; margin-right: 0.2em; width: 21em; float: left;"></select>
          <label style="padding-right: 0.5em; padding-top: 0.10em; padding-bottom: 0.10em; border-top: 0px; width: 22em; float: left; clear: both;" for="` + this.sexId + `"     >Geschlecht:</label><select onchange="getController().sexChanged()"        name="` + this.sexId + `"      id="` + this.sexId + `"      style="margin-top: 0.2em; margin-right: 0.2em; width: 21em; float: left;"><option>weiblich</option><option>m&auml;nnlich</option></select>
        </div>`;
        html += `<br/>`;
        html += `<div style="border: 1px solid #0077BB; width: auto; padding: 0px; content: ''; display: table; clear: both;" id="` + this.formId + `"></div>`;
        if (this.parent != null) {
            this.parent.innerHTML = html;
        }
        this.updateYears();
        this.updateAgegroups();
        this.resetForm();
    }
}
var controller = new Controller();
function getController() {
    return controller;
}
var data = [
    new Year(2007, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernis", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m k. Schwimmen", [
                new Record(Sexes.female, 35.7),
                new Record(Sexes.male, 35.1),
            ]),
            new Discipline("50m Flossen", [
                new Record(Sexes.female, 24.3),
                new Record(Sexes.male, 23.6),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 59.2),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 30.4),
                new Record(Sexes.male, 26.9),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.8),
                new Record(Sexes.male, 35.4),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.7),
                new Record(Sexes.male, 57.9),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernis", [
                new Record(Sexes.female, 142),
                new Record(Sexes.male, 129.7),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.1),
                new Record(Sexes.male, 33.3),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 61.6),
                new Record(Sexes.male, 54),
            ]),
        ]),
        new Agegroup(Types.individual, "AK offen", 3, [
            new Discipline("200m Hindernis", [
                new Record(Sexes.female, 129.98),
                new Record(Sexes.male, 115.31),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 30.69),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.93),
                new Record(Sexes.male, 50.48),
            ]),
            new Discipline("100m k. Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.78),
                new Record(Sexes.male, 63.64),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 62.19),
                new Record(Sexes.male, 53.75),
            ]),
            new Discipline("200m Super Lifesaver", [
                new Record(Sexes.female, 148.59),
                new Record(Sexes.male, 129.29),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25, AK 30", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 59),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 57.6),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 59),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.7),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40, AK 45", 3, [
            new Discipline("50m Hindernis", [
                new Record(Sexes.female, 32.02),
                new Record(Sexes.male, 27.5),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.7),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50+", 3, [
            new Discipline("50m Freistil", [
                new Record(Sexes.female, 36.8),
                new Record(Sexes.male, 28.5),
            ]),
            new Discipline("50m k. Schwimmen", [
                new Record(Sexes.female, 44.9),
                new Record(Sexes.male, 35.2),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 27.9),
                new Record(Sexes.male, 23.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernis", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m k. Staffel", [
                new Record(Sexes.female, 67.1),
                new Record(Sexes.male, 64),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 77),
                new Record(Sexes.male, 74.7),
            ]),
            new Discipline("4*25m RLB", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 86.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 126.2),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.7),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 123.2),
                new Record(Sexes.male, 116),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.3),
                new Record(Sexes.male, 139.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 105.2),
                new Record(Sexes.male, 93.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.1),
                new Record(Sexes.male, 106.3),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 127.4),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 126.1),
                new Record(Sexes.male, 110.9),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 95.71),
                new Record(Sexes.male, 83.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 112.3),
                new Record(Sexes.male, 100.9),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 136.1),
                new Record(Sexes.male, 120.1),
            ]),
        ]),
        new Agegroup(Types.team, "AK offen", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 114.2),
                new Record(Sexes.male, 101.5),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 86.39),
                new Record(Sexes.male, 71.77),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 103.52),
                new Record(Sexes.male, 93.01),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100-170", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 111.8),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104),
                new Record(Sexes.male, 84.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.9),
                new Record(Sexes.male, 103.6),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 143.4),
                new Record(Sexes.male, 120.5),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200+", 3, [
            new Discipline("4*50m Freistil", [
                new Record(Sexes.female, 168.6),
                new Record(Sexes.male, 117.2),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 75),
                new Record(Sexes.male, 58.7),
            ]),
            new Discipline("4*25m RLB", [
                new Record(Sexes.female, 108),
                new Record(Sexes.male, 88.6),
            ]),
        ]),
    ]),
    new Year(2008, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernis", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m k. Schwimmen", [
                new Record(Sexes.female, 35.37),
                new Record(Sexes.male, 35.1),
            ]),
            new Discipline("50m Flossen", [
                new Record(Sexes.female, 24.3),
                new Record(Sexes.male, 23.6),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 64.63),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 30.4),
                new Record(Sexes.male, 26.9),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.94),
                new Record(Sexes.male, 35.13),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.7),
                new Record(Sexes.male, 56.74),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernis", [
                new Record(Sexes.female, 137.83),
                new Record(Sexes.male, 123.98),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.94),
                new Record(Sexes.male, 33.3),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 61.6),
                new Record(Sexes.male, 53.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK offen", 3, [
            new Discipline("200m Hindernis", [
                new Record(Sexes.female, 129.92),
                new Record(Sexes.male, 115.31),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 29.48),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.93),
                new Record(Sexes.male, 49.49),
            ]),
            new Discipline("100m k. Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.78),
                new Record(Sexes.male, 62.74),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 61.96),
                new Record(Sexes.male, 53.75),
            ]),
            new Discipline("200m Super Lifesaver", [
                new Record(Sexes.female, 148.59),
                new Record(Sexes.male, 129.29),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25, AK 30", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 59),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 57.6),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 59),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.7),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40, AK 45", 3, [
            new Discipline("50m Hindernis", [
                new Record(Sexes.female, 32.02),
                new Record(Sexes.male, 27.5),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.7),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50+", 3, [
            new Discipline("50m Freistil", [
                new Record(Sexes.female, 36.02),
                new Record(Sexes.male, 27.7),
            ]),
            new Discipline("50m k. Schwimmen", [
                new Record(Sexes.female, 44.2),
                new Record(Sexes.male, 35.2),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 27.9),
                new Record(Sexes.male, 23.47),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernis", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m k. Staffel", [
                new Record(Sexes.female, 73.27),
                new Record(Sexes.male, 78.75),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 74.87),
                new Record(Sexes.male, 74.7),
            ]),
            new Discipline("4*25m RLB", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 86.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 126.2),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.7),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 123.3),
                new Record(Sexes.male, 116),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.3),
                new Record(Sexes.male, 139.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 105.2),
                new Record(Sexes.male, 93.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.1),
                new Record(Sexes.male, 106.3),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 127.4),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 126.1),
                new Record(Sexes.male, 108.86),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 95.71),
                new Record(Sexes.male, 82.66),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 112.3),
                new Record(Sexes.male, 99.65),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 134.01),
                new Record(Sexes.male, 120.1),
            ]),
        ]),
        new Agegroup(Types.team, "AK offen", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 114.2),
                new Record(Sexes.male, 101.5),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 86.39),
                new Record(Sexes.male, 71.77),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 103.52),
                new Record(Sexes.male, 92.52),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100-170", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 111.8),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104),
                new Record(Sexes.male, 84.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.9),
                new Record(Sexes.male, 103.6),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 120.5),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200+", 3, [
            new Discipline("4*50m Freistil", [
                new Record(Sexes.female, 149.36),
                new Record(Sexes.male, 117.2),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 75),
                new Record(Sexes.male, 58.7),
            ]),
            new Discipline("4*25m RLB", [
                new Record(Sexes.female, 108),
                new Record(Sexes.male, 88.6),
            ]),
        ]),
    ]),
    new Year(2009, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernis", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m k. Schwimmen", [
                new Record(Sexes.female, 35.37),
                new Record(Sexes.male, 35.1),
            ]),
            new Discipline("50m Flossen", [
                new Record(Sexes.female, 23.63),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 64.63),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 30.4),
                new Record(Sexes.male, 26.9),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.85),
                new Record(Sexes.male, 35.13),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.25),
                new Record(Sexes.male, 56.5),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernis", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 123.98),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.85),
                new Record(Sexes.male, 33.29),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 61.6),
                new Record(Sexes.male, 53.44),
            ]),
        ]),
        new Agegroup(Types.individual, "AK offen", 3, [
            new Discipline("200m Hindernis", [
                new Record(Sexes.female, 129.03),
                new Record(Sexes.male, 115.31),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 29.48),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.93),
                new Record(Sexes.male, 49.42),
            ]),
            new Discipline("100m k. Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.78),
                new Record(Sexes.male, 61.72),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.61),
                new Record(Sexes.male, 53.75),
            ]),
            new Discipline("200m Super Lifesaver", [
                new Record(Sexes.female, 148.59),
                new Record(Sexes.male, 129.29),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25, AK 30", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 59),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 57.6),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernis", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 59),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.7),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40, AK 45", 3, [
            new Discipline("50m Hindernis", [
                new Record(Sexes.female, 32.02),
                new Record(Sexes.male, 27.5),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.7),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50+", 3, [
            new Discipline("50m Freistil", [
                new Record(Sexes.female, 32.53),
                new Record(Sexes.male, 26.86),
            ]),
            new Discipline("50m k. Schwimmen", [
                new Record(Sexes.female, 40.92),
                new Record(Sexes.male, 32.63),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 27.9),
                new Record(Sexes.male, 23.47),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernis", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m k. Staffel", [
                new Record(Sexes.female, 73.27),
                new Record(Sexes.male, 76.67),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 72.39),
            ]),
            new Discipline("4*25m RLB", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 86.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 126.2),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.7),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 123.2),
                new Record(Sexes.male, 116),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.3),
                new Record(Sexes.male, 139.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 105.2),
                new Record(Sexes.male, 93.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.1),
                new Record(Sexes.male, 106.3),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 127.4),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 120.82),
                new Record(Sexes.male, 107.35),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 92.51),
                new Record(Sexes.male, 77.53),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.91),
                new Record(Sexes.male, 99.65),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 134.01),
                new Record(Sexes.male, 119.46),
            ]),
        ]),
        new Agegroup(Types.team, "AK offen", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 114.2),
                new Record(Sexes.male, 99.55),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 86.39),
                new Record(Sexes.male, 71.39),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 103.52),
                new Record(Sexes.male, 89.66),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100-170", 4, [
            new Discipline("4*50m Hindernis", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 111.8),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104),
                new Record(Sexes.male, 84.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.9),
                new Record(Sexes.male, 103.6),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 117.48),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200+", 3, [
            new Discipline("4*50m Freistil", [
                new Record(Sexes.female, 149.36),
                new Record(Sexes.male, 117.2),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 75),
                new Record(Sexes.male, 58.7),
            ]),
            new Discipline("4*25m RLB", [
                new Record(Sexes.female, 108),
                new Record(Sexes.male, 88.6),
            ]),
        ]),
    ]),
    new Year(2010, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 35.37),
                new Record(Sexes.male, 35.1),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 23.63),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.74),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 30.06),
                new Record(Sexes.male, 26.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.85),
                new Record(Sexes.male, 35.13),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.25),
                new Record(Sexes.male, 56.5),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 123.98),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.63),
                new Record(Sexes.male, 32.08),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 61.6),
                new Record(Sexes.male, 53.44),
            ]),
        ]),
        new Agegroup(Types.individual, "AK offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 114.97),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.61),
                new Record(Sexes.male, 53.75),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.78),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.41),
                new Record(Sexes.male, 48.36),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 148.59),
                new Record(Sexes.male, 129.29),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25, AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 58.82),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 57.6),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 58.82),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.67),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40, AK 45", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 32.02),
                new Record(Sexes.male, 27.5),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.67),
                new Record(Sexes.male, 26.1),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50+", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 32.05),
                new Record(Sexes.male, 26.13),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 39.1),
                new Record(Sexes.male, 30.06),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 26.86),
                new Record(Sexes.male, 22.87),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 86.6),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 72.39),
            ]),
            new Discipline("4*25m kombinierte Staffel", [
                new Record(Sexes.female, 73.27),
                new Record(Sexes.male, 74.45),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 126.2),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.7),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 121.47),
                new Record(Sexes.male, 116),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.3),
                new Record(Sexes.male, 139.6),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 105.2),
                new Record(Sexes.male, 93.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.1),
                new Record(Sexes.male, 106.3),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 127.4),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 120.82),
                new Record(Sexes.male, 107.35),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 92.51),
                new Record(Sexes.male, 77.53),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.91),
                new Record(Sexes.male, 99.65),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 134.01),
                new Record(Sexes.male, 117.46),
            ]),
        ]),
        new Agegroup(Types.team, "AK offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.49),
                new Record(Sexes.male, 98.86),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 86.39),
                new Record(Sexes.male, 70.46),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.35),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100-170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 111.8),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104),
                new Record(Sexes.male, 80.48),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.9),
                new Record(Sexes.male, 103.6),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 117.48),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 144.11),
                new Record(Sexes.male, 117.2),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 107.83),
                new Record(Sexes.male, 81.81),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 72.3),
                new Record(Sexes.male, 57),
            ]),
        ]),
    ]),
    new Year(2011, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 30.52),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 35.37),
                new Record(Sexes.male, 35.1),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 23.63),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.74),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 29.91),
                new Record(Sexes.male, 26.31),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.85),
                new Record(Sexes.male, 33.35),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.25),
                new Record(Sexes.male, 55.8),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 114.97),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.61),
                new Record(Sexes.male, 53.75),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.73),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.41),
                new Record(Sexes.male, 48.36),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 148.59),
                new Record(Sexes.male, 129.29),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 114.97),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.61),
                new Record(Sexes.male, 53.75),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.73),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.41),
                new Record(Sexes.male, 48.36),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 148.59),
                new Record(Sexes.male, 129.29),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 57.6),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 68.7),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40.7),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.5),
                new Record(Sexes.male, 59.09),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.5),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 42.72),
                new Record(Sexes.male, 33.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 71),
                new Record(Sexes.male, 63),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 79),
                new Record(Sexes.male, 64),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 44.22),
                new Record(Sexes.male, 35.26),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 74),
                new Record(Sexes.male, 66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 86),
                new Record(Sexes.male, 70),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.46),
                new Record(Sexes.male, 36.6),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 81),
                new Record(Sexes.male, 70),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 94),
                new Record(Sexes.male, 75),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 49),
                new Record(Sexes.male, 40),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 38),
                new Record(Sexes.male, 32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 102),
                new Record(Sexes.male, 80),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 56),
                new Record(Sexes.male, 46),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 45),
                new Record(Sexes.male, 38),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.05),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.9),
                new Record(Sexes.male, 37.2),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 32.39),
                new Record(Sexes.male, 24.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 39.8),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 34.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 41.1),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.1),
                new Record(Sexes.male, 24.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 49.42),
                new Record(Sexes.male, 37.4),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 65.2),
                new Record(Sexes.male, 51),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.83),
                new Record(Sexes.male, 28.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 62.68),
                new Record(Sexes.male, 43),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 65.2),
                new Record(Sexes.male, 55.4),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 70),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 75),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 44),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 70),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 75),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 44),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 86.6),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 72.39),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 62.1),
                new Record(Sexes.male, 59),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.7),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.58),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.3),
                new Record(Sexes.male, 132.18),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 105.2),
                new Record(Sexes.male, 93.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.1),
                new Record(Sexes.male, 106.3),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 127.4),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.49),
                new Record(Sexes.male, 98.86),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 85.45),
                new Record(Sexes.male, 68.96),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.35),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.49),
                new Record(Sexes.male, 98.86),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 85.45),
                new Record(Sexes.male, 68.96),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.35),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 108.87),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104),
                new Record(Sexes.male, 80.48),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.9),
                new Record(Sexes.male, 101.23),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 117.48),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 108.87),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 108.4),
                new Record(Sexes.male, 80.63),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.9),
                new Record(Sexes.male, 101.23),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 119.67),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.5),
                new Record(Sexes.male, 112.05),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 112.1),
                new Record(Sexes.male, 87.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 125.26),
                new Record(Sexes.male, 104.44),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 152.6),
                new Record(Sexes.male, 121.5),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 139.23),
                new Record(Sexes.male, 117.19),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 120.82),
                new Record(Sexes.male, 96.62),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 130.96),
                new Record(Sexes.male, 108.57),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 160.71),
                new Record(Sexes.male, 133.5),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 156),
                new Record(Sexes.male, 132),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 133),
                new Record(Sexes.male, 109),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 141),
                new Record(Sexes.male, 118),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 177),
                new Record(Sexes.male, 148),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 137.41),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 95.8),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 66.8),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 226.92),
                new Record(Sexes.male, 166.68),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 150.05),
                new Record(Sexes.male, 122.11),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 101.84),
                new Record(Sexes.male, 76.39),
            ]),
        ]),
    ]),
    new Year(2012, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 30.52),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 35.37),
                new Record(Sexes.male, 35.1),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 23.63),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.74),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 29.91),
                new Record(Sexes.male, 26.31),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.85),
                new Record(Sexes.male, 33.35),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 63.71),
                new Record(Sexes.male, 54.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 114.97),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.49),
                new Record(Sexes.male, 52.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.6),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.38),
                new Record(Sexes.male, 47.88),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 146.46),
                new Record(Sexes.male, 127.86),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 114.97),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.49),
                new Record(Sexes.male, 52.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 72.6),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.38),
                new Record(Sexes.male, 47.88),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 146.46),
                new Record(Sexes.male, 127.86),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 68.33),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40.17),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.5),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.54),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 42.58),
                new Record(Sexes.male, 33.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 70.3),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.54),
                new Record(Sexes.male, 62.31),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 42.58),
                new Record(Sexes.male, 35.26),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 71),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 79.31),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.46),
                new Record(Sexes.male, 36.48),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 78.05),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 79.95),
                new Record(Sexes.male, 65),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 47.09),
                new Record(Sexes.male, 38.13),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 33.17),
                new Record(Sexes.male, 27.5),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 86.03),
                new Record(Sexes.male, 70.97),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 54.17),
                new Record(Sexes.male, 42.76),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 40.17),
                new Record(Sexes.male, 29.34),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.05),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 37.2),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.68),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 39),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.68),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 41.1),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.68),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 42.71),
                new Record(Sexes.male, 37.36),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 53.94),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.83),
                new Record(Sexes.male, 28.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 62.68),
                new Record(Sexes.male, 43),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 65.2),
                new Record(Sexes.male, 55.4),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 86.37),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 72.39),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 62.1),
                new Record(Sexes.male, 59),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.7),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.58),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.3),
                new Record(Sexes.male, 132.18),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 105.18),
                new Record(Sexes.male, 93.2),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.1),
                new Record(Sexes.male, 106.3),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 127.4),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.49),
                new Record(Sexes.male, 98.86),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 83.85),
                new Record(Sexes.male, 67.95),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.35),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.49),
                new Record(Sexes.male, 98.86),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 83.85),
                new Record(Sexes.male, 67.95),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.35),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 129.66),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.65),
                new Record(Sexes.male, 106.12),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 101.06),
                new Record(Sexes.male, 79.83),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.1),
                new Record(Sexes.male, 98.84),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 117.48),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 108.87),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 108.4),
                new Record(Sexes.male, 79.83),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.9),
                new Record(Sexes.male, 101.23),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 117.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 112.05),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 112.1),
                new Record(Sexes.male, 87.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 125.26),
                new Record(Sexes.male, 104.44),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 150.5),
                new Record(Sexes.male, 121.5),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 117.19),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 114.3),
                new Record(Sexes.male, 91.75),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 128.26),
                new Record(Sexes.male, 108.57),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 160.71),
                new Record(Sexes.male, 133.5),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 151.97),
                new Record(Sexes.male, 127.07),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 129.69),
                new Record(Sexes.male, 103.94),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 140.95),
                new Record(Sexes.male, 117.93),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 172.45),
                new Record(Sexes.male, 150.01),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 137.41),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.39),
                new Record(Sexes.male, 92.79),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 65.22),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 226.92),
                new Record(Sexes.male, 166.68),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 150.05),
                new Record(Sexes.male, 118.23),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 101.84),
                new Record(Sexes.male, 75.64),
            ]),
        ]),
    ]),
    new Year(2013, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 30.52),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 35.37),
                new Record(Sexes.male, 35.1),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 23.63),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.74),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 29.91),
                new Record(Sexes.male, 26.31),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.85),
                new Record(Sexes.male, 32.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 63.71),
                new Record(Sexes.male, 54.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.44),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.49),
                new Record(Sexes.male, 51.36),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 71.23),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.38),
                new Record(Sexes.male, 46.44),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.55),
                new Record(Sexes.male, 127.86),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.44),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.49),
                new Record(Sexes.male, 51.36),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.26),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 71.23),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 56.38),
                new Record(Sexes.male, 46.44),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.55),
                new Record(Sexes.male, 127.86),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.94),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 68.33),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40.17),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.5),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.54),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.23),
                new Record(Sexes.male, 33.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 70.3),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.54),
                new Record(Sexes.male, 62.31),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 42.58),
                new Record(Sexes.male, 35.26),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 71),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.05),
                new Record(Sexes.male, 63.35),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.32),
                new Record(Sexes.male, 36.33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 73.9),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 78.73),
                new Record(Sexes.male, 65),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 47.09),
                new Record(Sexes.male, 37.99),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 33.17),
                new Record(Sexes.male, 27.5),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.92),
                new Record(Sexes.male, 70.22),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 46.21),
                new Record(Sexes.male, 41.12),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 37.97),
                new Record(Sexes.male, 28.45),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.05),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 37.2),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.03),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 39),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.68),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 41.1),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.68),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 42.14),
                new Record(Sexes.male, 36.63),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.43),
                new Record(Sexes.male, 28.37),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 62.68),
                new Record(Sexes.male, 43),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 65.2),
                new Record(Sexes.male, 55.4),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 86.37),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 72.39),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 62.1),
                new Record(Sexes.male, 59),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.7),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.58),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.3),
                new Record(Sexes.male, 132.18),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 99.06),
                new Record(Sexes.male, 93.01),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.6),
                new Record(Sexes.male, 106.3),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 127.4),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.39),
                new Record(Sexes.male, 98.48),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 83.05),
                new Record(Sexes.male, 66.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.35),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 126.46),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.39),
                new Record(Sexes.male, 98.48),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 83.05),
                new Record(Sexes.male, 66.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.35),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 126.46),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.65),
                new Record(Sexes.male, 106.12),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 101.06),
                new Record(Sexes.male, 79.83),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.97),
                new Record(Sexes.male, 98.84),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 142.79),
                new Record(Sexes.male, 116.44),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 108.87),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 98.17),
                new Record(Sexes.male, 79.83),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 118.8),
                new Record(Sexes.male, 101.23),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 138.29),
                new Record(Sexes.male, 116.49),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 112.05),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.55),
                new Record(Sexes.male, 87.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 125.26),
                new Record(Sexes.male, 104.44),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 149.9),
                new Record(Sexes.male, 121.5),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 116.54),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 113.78),
                new Record(Sexes.male, 91.37),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 128.26),
                new Record(Sexes.male, 108.57),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 156.9),
                new Record(Sexes.male, 131.69),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 151.97),
                new Record(Sexes.male, 126.7),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 123.87),
                new Record(Sexes.male, 101.97),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 140.24),
                new Record(Sexes.male, 116.01),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 168.86),
                new Record(Sexes.male, 140.03),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 135.8),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 91.99),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 64.16),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 226.92),
                new Record(Sexes.male, 166.68),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 150.05),
                new Record(Sexes.male, 118.23),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 101.84),
                new Record(Sexes.male, 75.64),
            ]),
        ]),
    ]),
    new Year(2014, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 30.52),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 35.37),
                new Record(Sexes.male, 34.9),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 23.63),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.97),
                new Record(Sexes.male, 61.74),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 29.91),
                new Record(Sexes.male, 26.31),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.07),
                new Record(Sexes.male, 32.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 63.48),
                new Record(Sexes.male, 54.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.44),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 59.68),
                new Record(Sexes.male, 50.53),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.74),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 69.59),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 55.72),
                new Record(Sexes.male, 45.99),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.55),
                new Record(Sexes.male, 126.33),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.44),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 59.68),
                new Record(Sexes.male, 50.53),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.74),
                new Record(Sexes.male, 28.94),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 69.59),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 55.72),
                new Record(Sexes.male, 45.99),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.55),
                new Record(Sexes.male, 126.33),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.94),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 65.8),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 66.39),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40.17),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.5),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.54),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.23),
                new Record(Sexes.male, 33.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 70.3),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.54),
                new Record(Sexes.male, 62.31),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.43),
                new Record(Sexes.male, 34.45),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 70.79),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.05),
                new Record(Sexes.male, 62.58),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.32),
                new Record(Sexes.male, 34.45),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 72.07),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 78.73),
                new Record(Sexes.male, 65),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 46.21),
                new Record(Sexes.male, 37.97),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 33.17),
                new Record(Sexes.male, 27.5),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.92),
                new Record(Sexes.male, 65.88),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 46.21),
                new Record(Sexes.male, 38.17),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 35.6),
                new Record(Sexes.male, 27.78),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.05),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.44),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 30.73),
                new Record(Sexes.male, 24.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 39),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 24.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 41.1),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.68),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 36.63),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.43),
                new Record(Sexes.male, 28.37),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 62.68),
                new Record(Sexes.male, 43),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 65.2),
                new Record(Sexes.male, 55.4),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 86.2),
                new Record(Sexes.male, 81.07),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 72.39),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 61.02),
                new Record(Sexes.male, 59),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 109.47),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 143.46),
                new Record(Sexes.male, 132.18),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 127.3),
                new Record(Sexes.male, 116.1),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 99.06),
                new Record(Sexes.male, 87.54),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.6),
                new Record(Sexes.male, 106.08),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.9),
                new Record(Sexes.male, 122),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.39),
                new Record(Sexes.male, 98.25),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 81.37),
                new Record(Sexes.male, 66.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.04),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 126.46),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 110.39),
                new Record(Sexes.male, 98.25),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 81.37),
                new Record(Sexes.male, 66.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 101.03),
                new Record(Sexes.male, 89.04),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 126.46),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.65),
                new Record(Sexes.male, 106.12),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 98.17),
                new Record(Sexes.male, 76.87),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.97),
                new Record(Sexes.male, 98.84),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 138.29),
                new Record(Sexes.male, 116.44),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.2),
                new Record(Sexes.male, 108.87),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 98.17),
                new Record(Sexes.male, 79.83),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 118.8),
                new Record(Sexes.male, 101.23),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 138.29),
                new Record(Sexes.male, 116.49),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 112.05),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 111.55),
                new Record(Sexes.male, 86.43),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 125.26),
                new Record(Sexes.male, 104.44),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.89),
                new Record(Sexes.male, 119.35),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 116.54),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 113.78),
                new Record(Sexes.male, 91.37),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 128.26),
                new Record(Sexes.male, 108.57),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 156.9),
                new Record(Sexes.male, 128.55),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 151.97),
                new Record(Sexes.male, 126.7),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 123.87),
                new Record(Sexes.male, 97.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 140.24),
                new Record(Sexes.male, 116.01),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 168.86),
                new Record(Sexes.male, 140.03),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 133.69),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 91.99),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 64.16),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 226.92),
                new Record(Sexes.male, 166.68),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 100.61),
                new Record(Sexes.male, 75.64),
            ]),
        ]),
    ]),
    new Year(2015, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.9),
                new Record(Sexes.male, 30.52),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 34.26),
                new Record(Sexes.male, 34.9),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 22.7),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.97),
                new Record(Sexes.male, 61.74),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 41.7),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 29.91),
                new Record(Sexes.male, 26.31),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.3),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.07),
                new Record(Sexes.male, 32.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 62.67),
                new Record(Sexes.male, 51.23),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 58.03),
                new Record(Sexes.male, 50.36),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.74),
                new Record(Sexes.male, 28.25),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 69.18),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.15),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.21),
                new Record(Sexes.male, 125.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 58.03),
                new Record(Sexes.male, 50.36),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.74),
                new Record(Sexes.male, 28.25),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 69.18),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.15),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.21),
                new Record(Sexes.male, 125.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 65.17),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.61),
                new Record(Sexes.male, 32.65),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 66.39),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.75),
                new Record(Sexes.male, 33),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.23),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.4),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.75),
                new Record(Sexes.male, 33.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 69.72),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.4),
                new Record(Sexes.male, 62.31),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.75),
                new Record(Sexes.male, 34.45),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 70.34),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.05),
                new Record(Sexes.male, 62.58),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.08),
                new Record(Sexes.male, 34.45),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 71.85),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 78.73),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 46.21),
                new Record(Sexes.male, 37.61),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 33.17),
                new Record(Sexes.male, 26.31),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.92),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 46.21),
                new Record(Sexes.male, 37.67),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 35.29),
                new Record(Sexes.male, 27.78),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 30.02),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.44),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 30.73),
                new Record(Sexes.male, 24.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 39),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 24.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 41.1),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.68),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 36.63),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.43),
                new Record(Sexes.male, 28.28),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 62.68),
                new Record(Sexes.male, 43),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 65.2),
                new Record(Sexes.male, 55.4),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 39.57),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 84.82),
                new Record(Sexes.male, 81.07),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 72.33),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 58.17),
                new Record(Sexes.male, 59),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 133.3),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 109.47),
                new Record(Sexes.male, 98.6),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 143.46),
                new Record(Sexes.male, 132.18),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.76),
                new Record(Sexes.male, 115.21),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 98.15),
                new Record(Sexes.male, 86.07),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.25),
                new Record(Sexes.male, 103.63),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 136.82),
                new Record(Sexes.male, 120.85),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 109.68),
                new Record(Sexes.male, 97.48),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.98),
                new Record(Sexes.male, 65.51),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 87.04),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 126.46),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 109.68),
                new Record(Sexes.male, 97.48),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.98),
                new Record(Sexes.male, 65.51),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 87.04),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 126.46),
                new Record(Sexes.male, 105.66),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.65),
                new Record(Sexes.male, 106.12),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.59),
                new Record(Sexes.male, 76.44),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.97),
                new Record(Sexes.male, 98.73),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 113.25),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 128.04),
                new Record(Sexes.male, 106.83),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.59),
                new Record(Sexes.male, 76.44),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.12),
                new Record(Sexes.male, 98.73),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 113.25),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 132.82),
                new Record(Sexes.male, 112.05),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 107.29),
                new Record(Sexes.male, 86.43),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.8),
                new Record(Sexes.male, 104.44),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.83),
                new Record(Sexes.male, 119.35),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 116.54),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 113.78),
                new Record(Sexes.male, 91.37),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 128.26),
                new Record(Sexes.male, 108.57),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 156.9),
                new Record(Sexes.male, 128.55),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 151.97),
                new Record(Sexes.male, 123.78),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 123.41),
                new Record(Sexes.male, 97.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 138.45),
                new Record(Sexes.male, 116.01),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 164.97),
                new Record(Sexes.male, 136.3),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 125.49),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 91.99),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 64.16),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 219.78),
                new Record(Sexes.male, 163.03),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 99.35),
                new Record(Sexes.male, 75.64),
            ]),
        ]),
    ]),
    new Year(2016, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.03),
                new Record(Sexes.male, 30.52),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 32.69),
                new Record(Sexes.male, 34.15),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 22.7),
                new Record(Sexes.male, 21.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 68.6),
                new Record(Sexes.male, 61.74),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40.18),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 29.27),
                new Record(Sexes.male, 26.14),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.47),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.07),
                new Record(Sexes.male, 32.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 59.82),
                new Record(Sexes.male, 49.35),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 58.03),
                new Record(Sexes.male, 50.36),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.27),
                new Record(Sexes.male, 28.25),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 69.18),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.15),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.21),
                new Record(Sexes.male, 125.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 58.03),
                new Record(Sexes.male, 50.36),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.27),
                new Record(Sexes.male, 28.25),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 69.18),
                new Record(Sexes.male, 59.78),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.15),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 144.21),
                new Record(Sexes.male, 125.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.92),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.41),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.92),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.41),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.4),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.75),
                new Record(Sexes.male, 33.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 68.23),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.4),
                new Record(Sexes.male, 60.23),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.75),
                new Record(Sexes.male, 34.45),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 69.73),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.05),
                new Record(Sexes.male, 62.58),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.08),
                new Record(Sexes.male, 34.45),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 71.85),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 78.73),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 33.17),
                new Record(Sexes.male, 25.33),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.48),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 35.29),
                new Record(Sexes.male, 26.78),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 28.98),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.44),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 30.73),
                new Record(Sexes.male, 23.75),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 39),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 24.62),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 41.1),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.44),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 36.01),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.43),
                new Record(Sexes.male, 24.71),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 62.68),
                new Record(Sexes.male, 43),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 65.2),
                new Record(Sexes.male, 55.4),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 37.67),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 37.67),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 84.6),
                new Record(Sexes.male, 81.07),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 71.49),
                new Record(Sexes.male, 72.33),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 58.17),
                new Record(Sexes.male, 59),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.44),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104.6),
                new Record(Sexes.male, 93.05),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 140.89),
                new Record(Sexes.male, 128.73),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.07),
                new Record(Sexes.male, 109.9),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.78),
                new Record(Sexes.male, 78.35),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.31),
                new Record(Sexes.male, 103.36),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 132.57),
                new Record(Sexes.male, 116.67),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 109.68),
                new Record(Sexes.male, 97.06),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.98),
                new Record(Sexes.male, 65.17),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 87.04),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 124.77),
                new Record(Sexes.male, 99.92),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 109.68),
                new Record(Sexes.male, 97.06),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.98),
                new Record(Sexes.male, 65.17),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 87.04),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 124.77),
                new Record(Sexes.male, 99.92),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 87.7),
                new Record(Sexes.male, 72.98),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.97),
                new Record(Sexes.male, 97),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 134.65),
                new Record(Sexes.male, 110.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106.83),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.59),
                new Record(Sexes.male, 76.44),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.12),
                new Record(Sexes.male, 98.73),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 113.25),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 132.82),
                new Record(Sexes.male, 112.05),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 105.37),
                new Record(Sexes.male, 77.14),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 120.8),
                new Record(Sexes.male, 102.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.09),
                new Record(Sexes.male, 114.19),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 116.54),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 112.02),
                new Record(Sexes.male, 89.75),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 128.26),
                new Record(Sexes.male, 108.57),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 155.13),
                new Record(Sexes.male, 128.55),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 151.97),
                new Record(Sexes.male, 123.78),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 123.41),
                new Record(Sexes.male, 94.17),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 138.45),
                new Record(Sexes.male, 116.01),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 164.97),
                new Record(Sexes.male, 135.09),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 123.83),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 86.94),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 63.12),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 219.78),
                new Record(Sexes.male, 163.03),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 99.35),
                new Record(Sexes.male, 75.64),
            ]),
        ]),
    ]),
    new Year(2017, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.03),
                new Record(Sexes.male, 30.02),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 32.69),
                new Record(Sexes.male, 34.15),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 22.7),
                new Record(Sexes.male, 21.32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 66.51),
                new Record(Sexes.male, 61.23),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 40.04),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 27.51),
                new Record(Sexes.male, 25.84),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.47),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.07),
                new Record(Sexes.male, 32.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 59.82),
                new Record(Sexes.male, 49.35),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.94),
                new Record(Sexes.male, 49.87),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 32.79),
                new Record(Sexes.male, 28.06),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 68.86),
                new Record(Sexes.male, 59.38),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.15),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 142.03),
                new Record(Sexes.male, 124.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.94),
                new Record(Sexes.male, 49.87),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 32.79),
                new Record(Sexes.male, 28.06),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 68.86),
                new Record(Sexes.male, 59.38),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.15),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 142.03),
                new Record(Sexes.male, 124.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 63.72),
                new Record(Sexes.male, 56.11),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 63.64),
                new Record(Sexes.male, 53.69),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.92),
                new Record(Sexes.male, 56.7),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.41),
                new Record(Sexes.male, 53.69),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.15),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 66.56),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.15),
                new Record(Sexes.male, 57.68),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 66.56),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.05),
                new Record(Sexes.male, 62.15),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 44.98),
                new Record(Sexes.male, 34.34),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 71.85),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.82),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 33.17),
                new Record(Sexes.male, 24.91),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.48),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 35.29),
                new Record(Sexes.male, 26.78),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 28.98),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.44),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 30.73),
                new Record(Sexes.male, 22.09),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 38.25),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 25.55),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 41.1),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.44),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 35.07),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.43),
                new Record(Sexes.male, 24.71),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 43.83),
                new Record(Sexes.male, 41.86),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 61.4),
                new Record(Sexes.male, 45.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 28.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 37.67),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 86.75),
                new Record(Sexes.male, 75),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 84.59),
                new Record(Sexes.male, 75),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 48.08),
                new Record(Sexes.male, 50),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 84.6),
                new Record(Sexes.male, 81.07),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 71.49),
                new Record(Sexes.male, 72.33),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 58.17),
                new Record(Sexes.male, 59),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.44),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104.6),
                new Record(Sexes.male, 93.05),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 139.16),
                new Record(Sexes.male, 126.56),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.07),
                new Record(Sexes.male, 109.9),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.78),
                new Record(Sexes.male, 77.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.31),
                new Record(Sexes.male, 103.36),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 132.57),
                new Record(Sexes.male, 113.93),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 108.37),
                new Record(Sexes.male, 97.06),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.98),
                new Record(Sexes.male, 64.73),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 86.75),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 124.77),
                new Record(Sexes.male, 98.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 108.37),
                new Record(Sexes.male, 97.06),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.98),
                new Record(Sexes.male, 64.73),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 86.75),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 124.77),
                new Record(Sexes.male, 98.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 87.7),
                new Record(Sexes.male, 72.98),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.97),
                new Record(Sexes.male, 97),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 134.65),
                new Record(Sexes.male, 110.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106.83),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.3),
                new Record(Sexes.male, 74.36),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.12),
                new Record(Sexes.male, 98.73),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 113.25),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 132.82),
                new Record(Sexes.male, 112.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 97.65),
                new Record(Sexes.male, 74.79),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.27),
                new Record(Sexes.male, 102.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.09),
                new Record(Sexes.male, 114.19),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 116.54),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 107.43),
                new Record(Sexes.male, 86.19),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 125.49),
                new Record(Sexes.male, 108.57),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 153.99),
                new Record(Sexes.male, 124.2),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 151.97),
                new Record(Sexes.male, 123.78),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 122.16),
                new Record(Sexes.male, 91),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 138.45),
                new Record(Sexes.male, 115.96),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 164.97),
                new Record(Sexes.male, 135.09),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 122.17),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 86.94),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 62.01),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 219.78),
                new Record(Sexes.male, 163.03),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 99.35),
                new Record(Sexes.male, 74.78),
            ]),
        ]),
    ]),
    new Year(2018, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.03),
                new Record(Sexes.male, 30.02),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 32.69),
                new Record(Sexes.male, 34.15),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 22.7),
                new Record(Sexes.male, 21.32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.56),
                new Record(Sexes.male, 61.23),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.95),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 26.8),
                new Record(Sexes.male, 25.24),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.47),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.07),
                new Record(Sexes.male, 32.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 59.61),
                new Record(Sexes.male, 49.35),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.18),
                new Record(Sexes.male, 49.02),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 32.79),
                new Record(Sexes.male, 27.27),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 68.86),
                new Record(Sexes.male, 58.82),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.09),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 141.73),
                new Record(Sexes.male, 124.33),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.18),
                new Record(Sexes.male, 49.02),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 32.79),
                new Record(Sexes.male, 27.27),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 68.86),
                new Record(Sexes.male, 58.82),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 51.64),
                new Record(Sexes.male, 45.09),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 141.73),
                new Record(Sexes.male, 124.33),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 63.72),
                new Record(Sexes.male, 56.11),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 63.64),
                new Record(Sexes.male, 52.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.92),
                new Record(Sexes.male, 56.7),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.41),
                new Record(Sexes.male, 52.67),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.15),
                new Record(Sexes.male, 57.68),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 56.09),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.44),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 42.73),
                new Record(Sexes.male, 34.34),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 68.74),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.82),
                new Record(Sexes.male, 63.81),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.57),
                new Record(Sexes.male, 36.37),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 33.17),
                new Record(Sexes.male, 24.91),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.48),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 35.29),
                new Record(Sexes.male, 26.17),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 35.38),
                new Record(Sexes.male, 28.98),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 43.19),
                new Record(Sexes.male, 36.44),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 29.13),
                new Record(Sexes.male, 22.09),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.9),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 25.55),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 40.48),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.44),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 35.07),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.43),
                new Record(Sexes.male, 24.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 43.83),
                new Record(Sexes.male, 37.84),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 59.17),
                new Record(Sexes.male, 45.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 28.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 37.67),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 86.75),
                new Record(Sexes.male, 75),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 84.59),
                new Record(Sexes.male, 75),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 48.08),
                new Record(Sexes.male, 45),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 84.6),
                new Record(Sexes.male, 80.26),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 71.49),
                new Record(Sexes.male, 71.13),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 58.17),
                new Record(Sexes.male, 56.74),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.44),
                new Record(Sexes.male, 122.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 104.6),
                new Record(Sexes.male, 93.05),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 139.16),
                new Record(Sexes.male, 126.56),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.07),
                new Record(Sexes.male, 109.9),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.78),
                new Record(Sexes.male, 77.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.31),
                new Record(Sexes.male, 102.46),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 132.57),
                new Record(Sexes.male, 113.93),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 108.37),
                new Record(Sexes.male, 96.62),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.69),
                new Record(Sexes.male, 64.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 86.75),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 122.86),
                new Record(Sexes.male, 98.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 108.37),
                new Record(Sexes.male, 96.62),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 79.69),
                new Record(Sexes.male, 64.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.86),
                new Record(Sexes.male, 86.75),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 122.86),
                new Record(Sexes.male, 98.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 87.7),
                new Record(Sexes.male, 72.85),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 114.97),
                new Record(Sexes.male, 97),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 133.12),
                new Record(Sexes.male, 110.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106.83),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 95.7),
                new Record(Sexes.male, 72.85),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.12),
                new Record(Sexes.male, 98.73),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 112.25),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 132.82),
                new Record(Sexes.male, 112.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 97.65),
                new Record(Sexes.male, 74.79),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.27),
                new Record(Sexes.male, 102.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 139.62),
                new Record(Sexes.male, 114.19),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 116.54),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 107.43),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 124.7),
                new Record(Sexes.male, 105.95),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 153.23),
                new Record(Sexes.male, 117.69),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 151.97),
                new Record(Sexes.male, 117.04),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 122.16),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 138.45),
                new Record(Sexes.male, 110.25),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 164.97),
                new Record(Sexes.male, 122.77),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 182.09),
                new Record(Sexes.male, 122.17),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 86.94),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 80.76),
                new Record(Sexes.male, 62.01),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 219.78),
                new Record(Sexes.male, 160.92),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 99.35),
                new Record(Sexes.male, 74.78),
            ]),
        ]),
    ]),
    new Year(2019, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.03),
                new Record(Sexes.male, 30.02),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 32.69),
                new Record(Sexes.male, 34.15),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 22.7),
                new Record(Sexes.male, 21.32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.56),
                new Record(Sexes.male, 61.23),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.95),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 26.8),
                new Record(Sexes.male, 23.23),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 63.44),
                new Record(Sexes.male, 57.1),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 36.96),
                new Record(Sexes.male, 32.8),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 55.01),
                new Record(Sexes.male, 49.35),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.05),
                new Record(Sexes.male, 49.02),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 32.79),
                new Record(Sexes.male, 27.27),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 68.86),
                new Record(Sexes.male, 58.82),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 50.78),
                new Record(Sexes.male, 44.21),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 141.73),
                new Record(Sexes.male, 124.33),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 121.88),
                new Record(Sexes.male, 113.33),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.05),
                new Record(Sexes.male, 49.02),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 32.79),
                new Record(Sexes.male, 27.27),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 68.86),
                new Record(Sexes.male, 58.82),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 50.78),
                new Record(Sexes.male, 44.21),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 141.73),
                new Record(Sexes.male, 124.33),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 63.72),
                new Record(Sexes.male, 56.11),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 58.72),
                new Record(Sexes.male, 52.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.92),
                new Record(Sexes.male, 56.7),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.41),
                new Record(Sexes.male, 52.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 54.87),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.15),
                new Record(Sexes.male, 57.68),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 56.09),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.44),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.34),
                new Record(Sexes.male, 34.34),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.9),
                new Record(Sexes.male, 57.83),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.82),
                new Record(Sexes.male, 61.5),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.1),
                new Record(Sexes.male, 34.44),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 32.05),
                new Record(Sexes.male, 24.91),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.48),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 35.04),
                new Record(Sexes.male, 25.52),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 35.06),
                new Record(Sexes.male, 27.7),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 41.43),
                new Record(Sexes.male, 30.88),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 28.8),
                new Record(Sexes.male, 19.56),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.9),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 25.55),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 40.48),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.44),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 35.07),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 34.13),
                new Record(Sexes.male, 24.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 43.83),
                new Record(Sexes.male, 37.84),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 59.17),
                new Record(Sexes.male, 45.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 28.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 37.67),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 86.75),
                new Record(Sexes.male, 75),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 84.59),
                new Record(Sexes.male, 75),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 48.08),
                new Record(Sexes.male, 45),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*25m Hindernisstaffel", [
                new Record(Sexes.female, 66.2),
                new Record(Sexes.male, 64.1),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 84.6),
                new Record(Sexes.male, 80.26),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 71.49),
                new Record(Sexes.male, 71.13),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 58.17),
                new Record(Sexes.male, 56.74),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.44),
                new Record(Sexes.male, 119.22),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 101.68),
                new Record(Sexes.male, 92.27),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 139.16),
                new Record(Sexes.male, 126.56),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.07),
                new Record(Sexes.male, 109.9),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.78),
                new Record(Sexes.male, 77.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.31),
                new Record(Sexes.male, 102.46),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 132.26),
                new Record(Sexes.male, 113.93),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 106.16),
                new Record(Sexes.male, 96.62),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 77.63),
                new Record(Sexes.male, 64.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.47),
                new Record(Sexes.male, 86.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 120.83),
                new Record(Sexes.male, 98.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 106.16),
                new Record(Sexes.male, 96.62),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 77.63),
                new Record(Sexes.male, 64.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 97.47),
                new Record(Sexes.male, 86.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 120.83),
                new Record(Sexes.male, 98.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.45),
                new Record(Sexes.male, 106),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 87.7),
                new Record(Sexes.male, 72.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 110.8),
                new Record(Sexes.male, 95.17),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 133.12),
                new Record(Sexes.male, 110.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106.28),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 95.7),
                new Record(Sexes.male, 72.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.12),
                new Record(Sexes.male, 95.17),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 135.94),
                new Record(Sexes.male, 112.25),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.85),
                new Record(Sexes.male, 112.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 97.65),
                new Record(Sexes.male, 74.79),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.27),
                new Record(Sexes.male, 102.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 139.62),
                new Record(Sexes.male, 114.19),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 138.42),
                new Record(Sexes.male, 115.29),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 107.43),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 124.7),
                new Record(Sexes.male, 105.95),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 153.23),
                new Record(Sexes.male, 117.69),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 142.41),
                new Record(Sexes.male, 117.04),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 116.05),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 129.18),
                new Record(Sexes.male, 110.25),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 161.79),
                new Record(Sexes.male, 122.77),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 158.4),
                new Record(Sexes.male, 122.17),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 86.94),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 79),
                new Record(Sexes.male, 62.01),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 219.78),
                new Record(Sexes.male, 160.92),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 99.35),
                new Record(Sexes.male, 74.78),
            ]),
        ]),
    ]),
    new Year(2020, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.03),
                new Record(Sexes.male, 30.02),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 32.69),
                new Record(Sexes.male, 34.15),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 22.7),
                new Record(Sexes.male, 21.32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.56),
                new Record(Sexes.male, 61.23),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.95),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 26.8),
                new Record(Sexes.male, 23.23),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 131.97),
                new Record(Sexes.male, 123.85),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 61.24),
                new Record(Sexes.male, 56.44),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.25),
                new Record(Sexes.male, 32.39),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 73.61),
                new Record(Sexes.male, 71.4),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 52.15),
                new Record(Sexes.male, 49.35),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 150.39),
                new Record(Sexes.male, 146.8),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 131.97),
                new Record(Sexes.male, 122.3),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.93),
                new Record(Sexes.male, 52.19),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.25),
                new Record(Sexes.male, 30.16),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 73.61),
                new Record(Sexes.male, 62.47),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 52.15),
                new Record(Sexes.male, 45.96),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 150.39),
                new Record(Sexes.male, 133.42),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 131.69),
                new Record(Sexes.male, 117),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.58),
                new Record(Sexes.male, 49.38),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.28),
                new Record(Sexes.male, 27.27),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 71.43),
                new Record(Sexes.male, 59.06),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 52.15),
                new Record(Sexes.male, 44.04),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 143.32),
                new Record(Sexes.male, 125.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 63.72),
                new Record(Sexes.male, 56.11),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 58.72),
                new Record(Sexes.male, 52.01),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 62.87),
                new Record(Sexes.male, 54.01),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.92),
                new Record(Sexes.male, 56.7),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.41),
                new Record(Sexes.male, 52.2),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 65.16),
                new Record(Sexes.male, 56.76),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 54.56),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 69.07),
                new Record(Sexes.male, 57.52),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.15),
                new Record(Sexes.male, 57.68),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 54.56),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 69.07),
                new Record(Sexes.male, 59.28),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.44),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.34),
                new Record(Sexes.male, 34.13),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.9),
                new Record(Sexes.male, 57.83),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 69.53),
                new Record(Sexes.male, 60.91),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.82),
                new Record(Sexes.male, 61.5),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.1),
                new Record(Sexes.male, 34.13),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.99),
                new Record(Sexes.male, 24.91),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.01),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.99),
                new Record(Sexes.male, 25.52),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 35.06),
                new Record(Sexes.male, 27.7),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 41.43),
                new Record(Sexes.male, 30.88),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 28.8),
                new Record(Sexes.male, 19.23),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.9),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 22.61),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 40.48),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.44),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 35.07),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.81),
                new Record(Sexes.male, 24.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 43.83),
                new Record(Sexes.male, 37.84),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 59.17),
                new Record(Sexes.male, 45.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 28.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 37.67),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 86.75),
                new Record(Sexes.male, 99.18),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 84.59),
                new Record(Sexes.male, 101.34),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 48.08),
                new Record(Sexes.male, 49.33),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 145.64),
                new Record(Sexes.male, 141.02),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 82.19),
                new Record(Sexes.male, 80.26),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 71.33),
                new Record(Sexes.male, 71.13),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 58.17),
                new Record(Sexes.male, 56.74),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.44),
                new Record(Sexes.male, 119.22),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 101.68),
                new Record(Sexes.male, 92.27),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.16),
                new Record(Sexes.male, 130.49),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.07),
                new Record(Sexes.male, 109.9),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.25),
                new Record(Sexes.male, 77.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.31),
                new Record(Sexes.male, 100.72),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 140.26),
                new Record(Sexes.male, 118.81),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 116.7),
                new Record(Sexes.male, 103.25),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 84.93),
                new Record(Sexes.male, 69.98),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 103.9),
                new Record(Sexes.male, 92.88),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 131.42),
                new Record(Sexes.male, 115.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 113.25),
                new Record(Sexes.male, 97.48),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 80.63),
                new Record(Sexes.male, 64.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 100.66),
                new Record(Sexes.male, 86.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 128.2),
                new Record(Sexes.male, 106.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.45),
                new Record(Sexes.male, 106),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 87.7),
                new Record(Sexes.male, 72.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 110.8),
                new Record(Sexes.male, 95.17),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.12),
                new Record(Sexes.male, 118.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106.28),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 94.75),
                new Record(Sexes.male, 72.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.12),
                new Record(Sexes.male, 95.17),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 143.94),
                new Record(Sexes.male, 119.75),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.85),
                new Record(Sexes.male, 112.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 97.65),
                new Record(Sexes.male, 74.79),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.27),
                new Record(Sexes.male, 102.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.62),
                new Record(Sexes.male, 122.19),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.37),
                new Record(Sexes.male, 115.07),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 102.48),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 121.22),
                new Record(Sexes.male, 105.95),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 154.34),
                new Record(Sexes.male, 125.69),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 142.41),
                new Record(Sexes.male, 117.04),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 116.05),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 129.18),
                new Record(Sexes.male, 110.25),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 169.79),
                new Record(Sexes.male, 130.77),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 158.4),
                new Record(Sexes.male, 120.42),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 86.94),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 79),
                new Record(Sexes.male, 62.01),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 219.78),
                new Record(Sexes.male, 151.51),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 99.35),
                new Record(Sexes.male, 74.78),
            ]),
        ]),
    ]),
    new Year(2021, [
        new Agegroup(Types.individual, "AK 12", 3, [
            new Discipline("50m Hindernisschwimmen", [
                new Record(Sexes.female, 31.03),
                new Record(Sexes.male, 30.02),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 32.69),
                new Record(Sexes.male, 34.15),
            ]),
            new Discipline("50m Flossenschwimmen", [
                new Record(Sexes.female, 22.7),
                new Record(Sexes.male, 21.32),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 13/14", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.56),
                new Record(Sexes.male, 61.23),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.95),
                new Record(Sexes.male, 35.9),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 26.8),
                new Record(Sexes.male, 23.23),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 15/16", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 131.97),
                new Record(Sexes.male, 123.85),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 61.24),
                new Record(Sexes.male, 56.44),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.25),
                new Record(Sexes.male, 32.39),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 73.61),
                new Record(Sexes.male, 71.4),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 52.15),
                new Record(Sexes.male, 49.35),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 150.39),
                new Record(Sexes.male, 146.8),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 17/18", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 131.97),
                new Record(Sexes.male, 122.3),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 60.93),
                new Record(Sexes.male, 52.19),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 35.25),
                new Record(Sexes.male, 30.16),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 73.61),
                new Record(Sexes.male, 62.47),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 52.15),
                new Record(Sexes.male, 45.96),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 150.39),
                new Record(Sexes.male, 133.42),
            ]),
        ]),
        new Agegroup(Types.individual, "AK Offen", 3, [
            new Discipline("200m Hindernisschwimmen", [
                new Record(Sexes.female, 131.69),
                new Record(Sexes.male, 117),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 57.58),
                new Record(Sexes.male, 49.38),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 34.28),
                new Record(Sexes.male, 27.27),
            ]),
            new Discipline("100m Kombinierte Rettungs&uuml;bung", [
                new Record(Sexes.female, 71.43),
                new Record(Sexes.male, 59.06),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 52.15),
                new Record(Sexes.male, 44.04),
            ]),
            new Discipline("200m Super-Lifesaver", [
                new Record(Sexes.female, 145.84),
                new Record(Sexes.male, 125.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 25", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 63.72),
                new Record(Sexes.male, 56.11),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 58.72),
                new Record(Sexes.male, 52.01),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 62.87),
                new Record(Sexes.male, 54.01),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 30", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 64.92),
                new Record(Sexes.male, 56.7),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 37.82),
                new Record(Sexes.male, 32.03),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.41),
                new Record(Sexes.male, 52.2),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 65.16),
                new Record(Sexes.male, 56.76),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 35", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 67),
                new Record(Sexes.male, 57.52),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 54.56),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 69.07),
                new Record(Sexes.male, 57.52),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 40", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 69.15),
                new Record(Sexes.male, 57.68),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 38.38),
                new Record(Sexes.male, 32.25),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 64.73),
                new Record(Sexes.male, 54.56),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 69.07),
                new Record(Sexes.male, 59.28),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 45", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 70.45),
                new Record(Sexes.male, 61.44),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 39.34),
                new Record(Sexes.male, 34.13),
            ]),
            new Discipline("100m Retten mit Flossen", [
                new Record(Sexes.female, 67.9),
                new Record(Sexes.male, 57.83),
            ]),
            new Discipline("100m Lifesaver", [
                new Record(Sexes.female, 69.53),
                new Record(Sexes.male, 60.91),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 50", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 75.82),
                new Record(Sexes.male, 61.5),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.1),
                new Record(Sexes.male, 34.13),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.99),
                new Record(Sexes.male, 24.91),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 55", 3, [
            new Discipline("100m Hindernisschwimmen", [
                new Record(Sexes.female, 80.01),
                new Record(Sexes.male, 63.94),
            ]),
            new Discipline("50m Retten", [
                new Record(Sexes.female, 45.91),
                new Record(Sexes.male, 36.42),
            ]),
            new Discipline("50m Retten mit Flossen", [
                new Record(Sexes.female, 31.99),
                new Record(Sexes.male, 25.52),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 60", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 35.06),
                new Record(Sexes.male, 27.7),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 41.43),
                new Record(Sexes.male, 30.88),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 28.8),
                new Record(Sexes.male, 19.23),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 65", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 37.2),
                new Record(Sexes.male, 31.1),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 44.14),
                new Record(Sexes.male, 36.9),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.08),
                new Record(Sexes.male, 22.61),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 70", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 38.6),
                new Record(Sexes.male, 32.22),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 46.8),
                new Record(Sexes.male, 40.48),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 31.44),
                new Record(Sexes.male, 24.43),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 75", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 41.62),
                new Record(Sexes.male, 35.07),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 50.17),
                new Record(Sexes.male, 44.64),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 33.81),
                new Record(Sexes.male, 24.66),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 80", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 43.83),
                new Record(Sexes.male, 37.84),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 59.17),
                new Record(Sexes.male, 45.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 37.61),
                new Record(Sexes.male, 28.39),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 85", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 73.98),
                new Record(Sexes.male, 63.08),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 72.61),
                new Record(Sexes.male, 68.23),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 41.87),
                new Record(Sexes.male, 37.67),
            ]),
        ]),
        new Agegroup(Types.individual, "AK 90", 3, [
            new Discipline("50m Freistilschwimmen", [
                new Record(Sexes.female, 86.75),
                new Record(Sexes.male, 99.18),
            ]),
            new Discipline("50m Kombiniertes Schwimmen", [
                new Record(Sexes.female, 84.59),
                new Record(Sexes.male, 101.34),
            ]),
            new Discipline("25m Schleppen einer Puppe", [
                new Record(Sexes.female, 48.08),
                new Record(Sexes.male, 49.33),
            ]),
        ]),
        new Agegroup(Types.team, "AK 12", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 145.64),
                new Record(Sexes.male, 141.02),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 82.19),
                new Record(Sexes.male, 80.26),
            ]),
            new Discipline("4*25m Gurtretterstaffel", [
                new Record(Sexes.female, 71.33),
                new Record(Sexes.male, 71.13),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 58.17),
                new Record(Sexes.male, 56.74),
            ]),
        ]),
        new Agegroup(Types.team, "AK 13/14", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.44),
                new Record(Sexes.male, 119.22),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 101.68),
                new Record(Sexes.male, 92.27),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.03),
                new Record(Sexes.male, 109.79),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.16),
                new Record(Sexes.male, 130.49),
            ]),
        ]),
        new Agegroup(Types.team, "AK 15/16", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.07),
                new Record(Sexes.male, 109.9),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 96.25),
                new Record(Sexes.male, 77.92),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 111.31),
                new Record(Sexes.male, 100.72),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 140.26),
                new Record(Sexes.male, 118.81),
            ]),
        ]),
        new Agegroup(Types.team, "AK 17/18", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 116.7),
                new Record(Sexes.male, 103.25),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 84.93),
                new Record(Sexes.male, 69.98),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 103.9),
                new Record(Sexes.male, 92.88),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 131.42),
                new Record(Sexes.male, 115.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK Offen", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 113.25),
                new Record(Sexes.male, 97.48),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 80.63),
                new Record(Sexes.male, 64.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 100.66),
                new Record(Sexes.male, 86.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 128.2),
                new Record(Sexes.male, 106.78),
            ]),
        ]),
        new Agegroup(Types.team, "AK 100", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 124.45),
                new Record(Sexes.male, 106),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 87.7),
                new Record(Sexes.male, 72.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 110.8),
                new Record(Sexes.male, 95.17),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 141.12),
                new Record(Sexes.male, 118.95),
            ]),
        ]),
        new Agegroup(Types.team, "AK 120", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 126.17),
                new Record(Sexes.male, 106.28),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 94.75),
                new Record(Sexes.male, 72.04),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 115.12),
                new Record(Sexes.male, 95.17),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 143.94),
                new Record(Sexes.male, 119.75),
            ]),
        ]),
        new Agegroup(Types.team, "AK 140", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 130.85),
                new Record(Sexes.male, 112.02),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 97.65),
                new Record(Sexes.male, 74.79),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 119.27),
                new Record(Sexes.male, 102.19),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 147.62),
                new Record(Sexes.male, 122.19),
            ]),
        ]),
        new Agegroup(Types.team, "AK 170", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 131.37),
                new Record(Sexes.male, 115.07),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 102.48),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 121.22),
                new Record(Sexes.male, 105.95),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 154.34),
                new Record(Sexes.male, 125.69),
            ]),
        ]),
        new Agegroup(Types.team, "AK 200", 4, [
            new Discipline("4*50m Hindernisstaffel", [
                new Record(Sexes.female, 142.41),
                new Record(Sexes.male, 117.04),
            ]),
            new Discipline("4*25m Puppenstaffel", [
                new Record(Sexes.female, 116.05),
                new Record(Sexes.male, 81.26),
            ]),
            new Discipline("4*50m Gurtretterstaffel", [
                new Record(Sexes.female, 129.18),
                new Record(Sexes.male, 110.25),
            ]),
            new Discipline("4*50m Rettungsstaffel", [
                new Record(Sexes.female, 169.79),
                new Record(Sexes.male, 130.77),
            ]),
        ]),
        new Agegroup(Types.team, "AK 240", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 158.4),
                new Record(Sexes.male, 120.42),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 112.01),
                new Record(Sexes.male, 86.94),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 79),
                new Record(Sexes.male, 62.01),
            ]),
        ]),
        new Agegroup(Types.team, "AK 280+", 3, [
            new Discipline("4*50m Freistilstaffel", [
                new Record(Sexes.female, 219.78),
                new Record(Sexes.male, 151.51),
            ]),
            new Discipline("4*25m R&uuml;ckenlage ohne Armt&auml;tigkeit", [
                new Record(Sexes.female, 133.58),
                new Record(Sexes.male, 110.04),
            ]),
            new Discipline("4*25m Rettungsstaffel", [
                new Record(Sexes.female, 99.35),
                new Record(Sexes.male, 74.78),
            ]),
        ]),
    ]),
].sort((y1, y2) => y2.getYear() - y1.getYear());
var rechner = getController();
rechner.configure("Calculator", data);
rechner.initialize();
</script>
