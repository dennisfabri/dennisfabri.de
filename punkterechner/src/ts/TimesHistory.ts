import { Year } from './Year';
import { Agegroup } from "./Agegroup";
import { Calculator } from './Calculator';

export class YearAgegroup {
    public readonly year: number;
    public readonly agegroup: Agegroup;

    public constructor(year: number, agegroup: Agegroup) {
        this.year = year;
        this.agegroup = agegroup;
    }
}

class Entry {
    public readonly year: number;
    public readonly points: number | undefined;
    public readonly pointsFormatted: string;

    public constructor(year: number, points: number | undefined, pointsFormatted: string) {
        this.year = year;
        this.points = points;
        this.pointsFormatted = pointsFormatted;
    }
}

class DisciplineHistory {

    private static readonly colors = ["#999999", "#0077BB", "#e78ac3", "#a6d854", "#fc8d62", "#66c2a5", "#B25177"];
    private static readonly pointStyles = ["dash", "circle", "triangle", "rect", "star", "crossRot", "rectRot"];

    public readonly name: string;
    public readonly data: Entry[];
    public readonly color: string;
    public readonly pointStyle: string;

    public constructor(name: string, index: number) {
        this.name = name;
        this.color = DisciplineHistory.colors[index];
        this.pointStyle = DisciplineHistory.pointStyles[index];
        this.data = [];
    }

    public add(entry: Entry): void {
        this.data.push(entry);
    }

    public getChartLabels(): string[] {
        return this.data.sort((e1, e2) => e1.year - e2.year).map(entry => "" + entry.year);
    }

    public getYears(): number[] {
        return this.data.map(entry => entry.year);
    }

    getEntry(year: number): Entry | undefined {
        return this.data.filter(e => e.year == year)[0];
    }

    public getChartData(): any {
        return {
            label: this.name,
            data: this.data.sort((e1, e2) => e1.year - e2.year).map(e => e.points),
            fill: false,
            borderColor: this.color,
            lineTension: 0.1,
            borderWidth: 1,
            borderDash: (this.name == 'Summe' ? [5, 5] : undefined),
            pointStyle: this.pointStyle,
            pointRadius: 3,
            pointBorderColor: this.color,
            pointBackgroundColor: this.color,
            yAxisID: (this.name == 'Summe' ? 'right' : 'left')
        };
    }
}

export class TimesHistory {

    private readonly disciplines: DisciplineHistory[];

    public constructor(calculator: Calculator) {
        this.disciplines = [];
        for (var x = 0; x < calculator.getDisciplineCount(); x++) {
            this.disciplines.push(new DisciplineHistory(calculator.getDisciplineName(x), x + 1));
        }
        this.disciplines.push(new DisciplineHistory("Summe", 0));
    }

    public add(year: number, calculator: Calculator) {
        for (var x = 0; x < calculator.getDisciplineCount(); x++) {
            var discipline = this.disciplines.filter(d => d.name == calculator.getDisciplineName(x))[0];
            if (discipline != undefined) {
                discipline.add(new Entry(year, calculator.getPoints(x), calculator.getFormattedPoints(x)));
            }
        }
        this.disciplines.filter(d => d.name == "Summe")[0].add(new Entry(year, calculator.getPointsSum() < 0.005 ? undefined : calculator.getPointsSum(), calculator.getPointsSum() < 0.005 ? '-' : calculator.getFormattedPointsSum()));
        this.disciplines.forEach(d => {
            if (d.data.filter(e => e.year == year).length == 0) {
                d.add(new Entry(year, undefined, '-'));
            }
        });
    }

    public getChartData(): any {
        return {
            type: "line",
            data: {
                labels: this.disciplines[0].getChartLabels(),
                datasets: this.disciplines.map(d => d.getChartData())
            },
            options: {
                animation: {
                    duration: 0
                },
                legend: {
                    align: "start",
                    labels: {
                        usePointStyle: true
                    }
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ": " + new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
                        },
                    }
                },
                scales: {
                    left: {
                        id: 'left',
                        position: 'left',
                        suggestedMin: 0,
                        scaleLabel: {
                            display: 'true',
                            labelString: 'pro Disziplin',

                        },
                        ticks: {
                            min: 0,
                        }
                    },
                    right: {
                        id: 'right',
                        position: 'right',
                        suggestedMin: 0,
                        scaleLabel: {
                            display: 'true',
                            labelString: 'Summe',
                            fontColor: "#999999"
                        },
                        ticks: {
                            min: 0,
                            fontColor: "#999999"
                        },
                        gridLines: {
                            borderDash: [5, 5],
                        }
                    }
                }
            }
        }
    }

    getHistoryTable(): string {
        var html = "";
        html += "<table style='border-collapse: collapse; width: 100%;'>";
        html += "<tr style='background: #0077BB; color: #FFFFFF;'><th style='text-align: center;'>Jahr</th>";
        this.disciplines.forEach(d => html += "<th style='text-align: center;'>" + d.name + "</th>");
        var odd = true;
        this.disciplines[0].getYears().forEach(year => {
            var color = odd ? '#FFFFFF' : '#f8f8ff';
            html += "<tr style='background-color: " + color + "'><td style='text-align: center;'>" + year + "</td>";
            this.disciplines.forEach(d => {
                var text = "-";
                if (d.getEntry(year) != undefined) {
                    var entry = d.getEntry(year) as Entry;
                    text = entry.pointsFormatted;
                }
                html += "<td style='text-align: center;'>" + text + "</td>";
            });
            html += "</tr>";
            odd = !odd;
        });
        html += "</tr>";
        html += "</table>";
        return html;
    }
}