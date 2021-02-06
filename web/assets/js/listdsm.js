const baseurl = "https://dlrg.dennisfabri.de/ergebnisse/dsm";
const listCompetitions = async () => {
    const response = await fetch(baseurl + ".php", {
        method: 'GET'
    });

    const data = await response.json(); //extract JSON from the http response

    let rows = "";
    let number = data.data.length;

    for (const d in data.data) {
        const competition = data.data[d];
        const year = competition.year;
        let location = competition.location;
        let individual = "-";
        let team = "-";
        let og = "-";

        if (competition.url != "" && (('' + competition.url) != 'undefined')) {
            location = "<a href=\"" + competition.url + "\">" + competition.location + "</a>";
        }
        if (competition.individual != "" && (('' + competition.individual) != 'undefined')) {
            individual = "<a href=\"" + baseurl + "/" + competition.individual + "\">Einzel</a>";
        }
        if (competition.team != "" && (('' + competition.team) != 'undefined')) {
            team = "<a href=\"" + baseurl + "/" + competition.team + "\">Mannschaft</a>";
        }
        if (competition.og != "" && (('' + competition.og) != 'undefined')) {
            og = "<a href=\"" + baseurl + "/" + competition.og + "\">OG-Wertung</a>";
        }

        rows += "<tr>";
        rows += "<td style=\"border-left: 1px solid #0077BB; text-align: center; padding-right: 0.2em;\">" + year + "</td>";
        rows += "<td>" + location + "</td><td style=\"text-align: center; padding-right: 0.2em;\">" + individual + "</td>";
        rows += "<td style=\"text-align: center; padding-right: 0.2em;\">" + team + "</td>";
        rows += "<td style=\"text-align: center; padding-right: 0.2em;\">" + og + "</td>";
        rows += "<td style=\"border-right: 1px solid #0077BB; text-align: right; padding-right: 0.2em;\">" + number + "</td>";
        rows += "</tr>";

        number--;
    }

    let table = '<table style="border: 1px solid #0077BB; width: min(99%, 75em); border-collapse: collapse;">';
    table += '<tr style="background-color: #0077BB; color: WHITE; border: 1px solid #0077bb;">';
    table += '<th style="border-left: 1px solid #0077BB; text-align: center;">Jahr</th>';
    table += '<th style="text-align: center;">Ort</th>';
    table += '<th colspan="3" style="text-align: center;">Ergebnisse</th>';
    table += '<th style="border-right: 1px solid #0077BB; text-align: center;">Nr</th>';
    table += '</tr>';
    table += rows;
    table += '</table>';

    document.getElementById("display").innerHTML = table;
}