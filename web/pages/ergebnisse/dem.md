---
layout: page
title: Deutsche Einzelstrecken-Meisterschaften im Rettungssport
date: 2021-01-01 00:00
category: Rettungssport
author: Dennis Fabri
summary: 
permalink: /ergebnisse/dem.html
redirect_from:
  - /rettungssport/dem.html
---

# Deutsche Einzelstrecken-Meisterschaften im Rettungssport

Die DEM ist die deutsche Meisterschaft über die einzelnen Disziplinen und grenzt sich damit deutlich gegen die
Deutsche Mehrkampf-Meisterschaft (ehemals Deutsche Meisterschaft) ab. Sie ging aus dem DLRG Cup Pool hervor,
der bis 2018 insbesondere als Auswahlwettkampf für die Nationalmanschaft durchgeführt wurde.

<!-- markdownlint-disable MD033 -->

  <div id="display"></div>
  <script>
    const baseurl = "{{site.phpurl}}/ergebnisse/dem/";
    const listCompetitions = async () => {
      const response = await fetch(baseurl, {
        method: 'GET'
      });

      const data = await response.json(); //extract JSON from the http response

      var rows = "";
      var number = data.data.length;

      for (d in data.data) {
        var competition = data.data[d];
        var year = competition.year;
        var location = competition.location;
        var individual = "-";
        var team = "-";
        if (competition.url != "" && (('' + competition.url) != 'undefined')) {
          location = "<a href=\"" + competition.url + "\">" + competition.location + "</a>";
        }
        if (competition.individual != "" && (('' + competition.individual) != 'undefined')) {
          individual = "<a href=\"" + baseurl + competition.individual + "\">Einzel</a>";
        }
        if (competition.team != "" && (('' + competition.team) != 'undefined')) {
          team = "<a href=\"" + baseurl + competition.team + "\">Mannschaft</a>";
        }

        rows += "<tr>";
        rows += "<td style=\"border-left: 1px solid #0077BB; text-align: center; padding-right: 0.2em;\">" + year + "</td>";
        rows += "<td>" + location + "</td><td style=\"text-align: center; padding-right: 0.2em;\">" + individual + "</td>";
        rows += "<td style=\"text-align: center; padding-right: 0.2em;\">" + team + "</td>";
        rows += "<td style=\"border-right: 1px solid #0077BB; text-align: right; padding-right: 0.2em;\">" + number + "</td>";
        rows += "</tr>";

        number--;
      };

      var table = '<table style="border: 1px solid #0077BB; width: min(99%, 75em); border-collapse: collapse;">';
      table += '<tr style="background-color: #0077BB; color: WHITE; border: 1px solid #0077bb;">';
      table += '<th style="border-left: 1px solid #0077BB; text-align: center;">Jahr</th>';
      table += '<th style="text-align: center;">Ort</th>';
      table += '<th colspan="2" style="text-align: center;">Ergebnisse</th>';
      table += '<th style="border-right: 1px solid #0077BB; text-align: center;">Nr</th>';
      table += '</tr>';
      table += rows;
      table += '</table>';

      document.getElementById("display").innerHTML = table;
    }

    listCompetitions();
  </script>

  <sup>1)</sup> Diese Wettkämpfe wurden wegen des Ausbruchs von SARS-CoV-2 (Corona) abgesagt.  

[Fehler melden](mailto:info@dennisfabri.de)
