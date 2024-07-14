---
layout: page
title: HTML-Vorlagen
permalink: /jauswertung/anleitungen/html-vorlagen.html
---

# HTML-Vorlagen

Der Export von HTML-Dateien sowie die Ausgabe des HTTP-Servers wird durch so genannte XSL-Templates festgelegt. Sie können auf diese Weise die Ausgabe beliebig anpassen. Der interne Ablauf der Erstellung von HTML-Dateien verläuft dabei wie folgt:

1. JAuswertung erstellt aus dem aktuellen Wettkampf ein XML-Datei, die alle nötigen Daten enthält.
2. Über einen sogenannten Transformer wird die XML-Datei mit einer XSLT-Datei verknüpft und so die HTML-Datei erstellt.

Der Aufbau der XML-Dateien entspricht dabei dem der Dateien, die von JAuswertung exportiert werden können. Wenn Sie also die Ausgabe anpassen wollen, müssen Sie nur die entsprechenden Dateien im Unterverzeichnis "xsl" im Installationsordner von JAuswertung entsprechend anpassen.

**Anmerkung 1:** Auf eine genaue Beschreibung zum Umgang mit XSLT wird hier verzichtet, da entsprechende Beschreibungen im Internet in ausreichender Menge und Qualität vorhanden sind.

**Anmerkung 2:** Ein Fehler in der XSLT-Datei führt dazu, dass die Transformation nicht durchgeführt werden kann. JAuswertung meldet daraufhin, dass die Datei nicht gespeichert werden konnte.