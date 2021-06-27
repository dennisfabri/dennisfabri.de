---
layout: page
title: Checksummen
permalink: /jauswertung/anleitungen/checksummen.html
---

# Checksummen

Einsatzzwecke

- Einfache Überprüfung der Regelwerkseinstellungen vor dem Wettkampf
- Schnellere Unterscheidung von Ergebnissen während eines Wettkampfs
- Überprüfung der Konsistenz von Protokollen bei der Meldung zu LVM oder DM

## Übersicht

Checksummen werden überall dort eingesetzt, wo es wichtig ist, schnell zu entscheiden, ob es sich bei den vorliegenden 
Daten, um die erwünschten Daten handelt. Dabei gilt grundsätzlich:

- Sind die Checksummen unterschiedlich, so sind auch die zu Grunde liegenden Daten unterschiedlich.
- Sind die Checksummen gleich, so sind auch die Daten mit hoher Wahrscheinlichkeit gleich (mehr dazu später).

Innerhalb von JAuswertung werden Checksummen für zwei Bereiche eingesetzt:

- Checksummen für die Einstellungen im Regelwerk
- Checksummen für die einzelnen Ergebnisse

## Funktionsweise

Das in JAuswertung eingesetzte Checksummenverfahren reagiert vor allem auf kleine Veränderungen. Wurde z.B. von einem
Ergebnis zum nächsten eine Zeit geändert, wird sich die Checksumme mit fast 100-prozentiger Wahrscheinlichkeit verändern.
Im Gegenzug kann es bei großen Unterschieden durchaus vorkommen, dass zwei unterschiedliche Ergebnisse (z.B. die der AK
12 und der AK 13/14) mit der gleichen Checksumme versehen werden.

In der Praxis bedeutet dies, dass wenn man zwei Ergebnisse der gleichen Altersklasse vergleicht, das Vergleichen der
Checksummen ausreicht.

### Ergebnisse

Die Checksummen der Ergebnisse werden auf jede Ergebnisseite gedruckt. In der unteren linken Ecke steht jeweils ein
Text in der Form "Checksumme: 1234567 (Ergebnis) / 1234567 (Altersklasse) / 1234567 (Regelwerk)".
Die Checksummen beziehen sich jeweils auf den danach in Klammern genannten Bereich.

![Checksummen sind in den Ergebnissen unten links dargestellt](/assets/img/jauswertung/anleitungen/checksummen/checksummen-ergebnisse.png)

### Protokoll

Auf der ersten Seite des Protokolls werden die Checksummen ebenfalls verwendet. In der Zeile Regelwerk befinden sich
die Checksummen des gesamten Regelwerks, der Junioren Altersklassen (AK 12 – AK offen) und der Senioren Altersklassen.
In der Tabelle darunter befinden sich die Checksummen der Ergebnisse für jede Altersklasse. Nicht besetzte Altersklassen
werden dabei ausgelassen.

![Checksummen sind im Protokoll auf der ersten Seite dargestellt](/assets/img/jauswertung/anleitungen/checksummen/checksummen-protokoll.png)