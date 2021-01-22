---
layout: page
title: Downloads
permalink: /jauswertung/downloads.html
---

# Downloads

<!-- markdownlint-disable MD013  MD033 MD037-->

<div id='infobox-downloads'></div>

Die jeweils aktuelle Version von JAuswertung kann auf [Github](https://github.com/dennisfabri/JAuswertung/) im Bereich
[Releases](https://github.com/dennisfabri/JAuswertung/releases) heruntergeladen werden.

<script language="javascript" type="text/javascript">

$(document).ready(function () {
     GetLatestReleaseInfo();  
});  

function GetLatestReleaseInfo() {
   $.getJSON("https://api.github.com/repos/dennisfabri/jauswertung/releases").done(function (json) {
        var release = json[0];
        var downloadURL = release.html_url;
        var version = release.name;
        var publishedAt = new Date(release.published_at).toLocaleDateString(undefined);
        var windows = "";
        var linux = "";
        var macos = "";
        release.assets.forEach(a => {
            console.info(a.name);
            var entry = {
                url: a.browser_download_url,
                name: a.name,
                downloads: a.download_count,
                size: "" + Math.round(a.size / 1000 / 1000)+ " MB"
            };

            if (a.name.endsWith(".exe")) {
                windows = entry;
                windows.os = "Windows";
            } else if (a.name.endsWith(".tar")) {
                linux = entry;
                linux.os = "Linux";
            } else if (a.name.endsWith(".dmg")) {
                macos = entry;
                macos.os = "MacOS";
            }
        });
        var entries = [windows, linux, macos];

        var html = '<p>Die Version "' + version + '" wurde am ' + publishedAt + ' veröffentlicht.</p>';
        html += '<table style="max-width: 100%; width: min(100%, 40em); margin-bottom: 1em; border-collapse: collapse; border: 1px solid #0077BB;">';
        html += '<tr style="background-color: #0077BB; color: white;">';
        html += '<th style="text-align: center;">Betriebssystem</th>';
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
