---
layout: page
title: Deutsche Seniorenmeisterschaften im Rettungssport
date: 2021-01-01 00:00
category: Rettungssport
author: Dennis Fabri
summary: 
permalink: /ergebnisse/dsm.html
redirect_from:
  - /rettungssport/dsm.html
---

# Deutsche Seniorenmeisterschaften im Rettungssport

Die Deutschen Seniorenmeisterschaften der DLRG werden unabhängig von den Deutschen Meisterschaften ausgetragen und
stellen einen der ersten Höhepunkte in jedem Wettkampfjahr dar.

<!-- markdownlint-disable MD033 -->

  <div id="display"></div>
  <script>
    const baseurl = "{{site.phpurl}}/ergebnisse/dsm/";
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
        var og = "-";
        var lv = "-";

        if (competition.url != "" && (('' + competition.url) != 'undefined')) {
          location = "<a href=\"" + competition.url + "\">" + competition.location + "</a>";
        }
        if (competition.individual != "" && (('' + competition.individual) != 'undefined')) {
          individual = "<a href=\"" + baseurl + competition.individual + "\">Einzel</a>";
        }
        if (competition.team != "" && (('' + competition.team) != 'undefined')) {
          team = "<a href=\"" + baseurl + competition.team + "\">Mannschaft</a>";
        }
        if (competition.lv != "" && (('' + competition.lv) != 'undefined')) {
          lv = "<a href=\"" + baseurl + competition.lv + "\">LV-Wertung</a>";
        }
        if (competition.og != "" && (('' + competition.og) != 'undefined')) {
          og = "<a href=\"" + baseurl + competition.og + "\">OG-Wertung</a>";
        }

        rows += "<tr>";
        rows += "<td style=\"border-left: 1px solid #0077BB; text-align: center; padding-right: 0.2em;\">" + year + "</td>";
        rows += "<td>" + location + "</td><td style=\"text-align: center; padding-right: 0.2em;\">" + individual + "</td>";
        rows += "<td style=\"text-align: center; padding-right: 0.2em;\">" + team + "</td>";
        rows += "<td style=\"text-align: center; padding-right: 0.2em;\">" + og + "</td>";
        rows += "<td style=\"border-right: 1px solid #0077BB; text-align: right; padding-right: 0.2em;\">" + number + "</td>";
        rows += "</tr>";

        number--;
      };

      var table = '<table style="border: 1px solid #0077BB; width: min(99%, 75em) ; border-collapse: collapse;">';
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

    listCompetitions();
  </script>

<sup>1)</sup> Diese Wettkämpfe wurden wegen des Ausbruchs von SARS-CoV-2 (Corona) abgesagt.

Die Daten stammen zum Teil von der Internetseite [rettungssport.com](https://www.rettungssport.com). Der ursprüngliche Link
```https://www.rettungssport.com/home/specials/specials-anzeigen/article/dsm-alle-infos.html``` wurde am 05.06.2009
geprüft und ist nicht mehr verfügbar.

[Fehler melden](mailto:info@dennisfabri.de)
