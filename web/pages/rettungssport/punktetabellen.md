---
layout: page
title: Punktetabellen
date: 2021-01-01 00:00
category: Rettungssport
author: Dennis Fabri
summary: 
permalink: /rettungssport/punktetabellen.html
---

# Punktetabellen

Seit dem DLRG-Regelwerk von 2007 können sich Rec-Werte einzelner Disziplinen jährlich ändern. Darüber hinaus ist die
Formel zur Punkteberechnung nicht darauf ausgelegt, einfach im Kopf ausgerechnet zu werden. Daher veröffentliche ich
auf dieser Seite seit 2007 zu Beginn jeden Jahres aktuelle Punktetabellen für alle Alterklassen und Disziplinen.

<div id='infobox-downloads'></div>

Die [aktuellen Punktetabellen](https://github.com/dennisfabri/DLRG-Punketabellen/releases/latest) könnt ihr
auch von [Github](https://github.com/dennisfabri/DLRG-Punketabellen) herunterladen.

An welchen Stellen können die Punktetabellen sinnvoll eingesetzt werden?

- Bewertung der Leistung von Schwimmer während des Trainings bzw. eines Wettkampfs (Trainer, Schwimmer)
- Vergleich mit anderen Schwimmern/Ergebnissen
- ...

An welchen Stellen sind die Punktetabellen nicht sinnvoll?

- Zur Auswertung eines Wettkampfs, da die Punktetabellen nicht für jede Zeit die entsprechende Punktzahl enthalten.
- ...

<script language="javascript" type="text/javascript">

$(document).ready(function () {
     GetLatestReleaseInfo();  
});  

function GetLatestReleaseInfo() {
   $.getJSON("https://api.github.com/repos/dennisfabri/DLRG-Punketabellen/releases").done(function (json) {
        var release = json[0];
        var downloadURL = release.html_url;
        var version = release.name;
        var publishedAt = new Date(release.published_at).toLocaleDateString(undefined);
        var einzel = "";
        var mannschaft = "";
        release.assets.forEach(a => {
            console.info(a.name);
            var entry = {
                url: a.browser_download_url,
                name: a.name,
                downloads: a.download_count,
                size: "" + Math.round(a.size / 1000)+ " KB"
            };

            if (a.name.includes("Einzel")) {
                einzel = entry;
                einzel.os = "Einzel";
            } else if (a.name.includes("Mannschaft")) {
                mannschaft = entry;
                mannschaft.os = "Mannschaft";
            }
        });
        var entries = [einzel, mannschaft];

        var html = '<p>Die Version "' + version + '" wurde am ' + publishedAt + ' veröffentlicht.</p>';
        html += '<table style="max-width: 100%; width: min(100%, 40em); margin-bottom: 1em; border-collapse: collapse; border: 1px solid #0077BB;">';
        html += '<tr style="background-color: #0077BB; color: white;">';
        html += '<th style="text-align: center;">Art</th>';
        html += '<th style="text-align: center;">Datei</th>';
        html += '<th style="text-align: center;">Größe</th>';
        html += '<th style="text-align: center;">Downloads</th>';
        html += '</tr>';
        var odd = true;
        entries.forEach(e => {
            html += '<tr style="background-color: ' + (odd ? 'white' : '#f8f8ff') + ';">';
            html += '<td>'+e.os+'</td>';
            html += '<td><a href="'+e.url+'">'+e.name+'</a></td>';
            html += '<td style="text-align: right;">'+e.size+'</td>';
            html += '<td style="text-align: right;">'+e.downloads+'</td>';
            html += '</tr>';
            odd = !odd;
        });

        html += "</table>";
        document.getElementById("infobox-downloads").innerHTML = html;
   });
}  
</script>
