---
layout: post
title: JAuswertung 11
date: 2015-12-25 00:00
category: JAuswertung
author: Dennis Fabri
tags: [JAuswertung]
summary: 
---

JAuswertung erscheint in Version 11. Es enthält wie gewohnt zum Jahreswechsel die neuen Rec-Werte für alle Altersklassen.
Da es in diesem Jahr ein neues Regelwerk gibt, haben sich auch einige Fehlercodes geändert und die HLW wurde entfernt.

Mit Version 11 erhalten Funktionen für Freigewässerwettkämpfe Einzug in JAuswertung. Diese können durch die entsprechenden
Formeln im Regelwerk aktiviert werden. Vorläufig sind diese noch als Beta-Version markiert, da noch nicht alle gewünschten
Funktionen umgesetzt werden konnten. 2015 wurden aber bereits die Landesmeisterschaften Freiwasser sowie der DLRG Cup Pool
erfolgreich mit diesen Funktionen durchgeführt. Bei Fragen zu oder Problemen mit den neuen Funktionen wendet euch wie
immer an <info@dennisfabri.de>.

Neues:

- Unterstützung von Wettkämpfen mit Vor- und Zwischenläufen.
- Meldezeiten können jetzt im Bereich "Daten prüfen" geprüft werden. Kriterien sind "fehlt", "sehr niedrig" (< Rec-Wert)
  und "sehr hoch".
- Mannschaftswettkämpfe erhalten eine erweiterte Meldungsprüfung
  - Konfigurierbar: Forderung vollständiger namentlicher Meldung mit Jahrgang
  - Prüfung des Alters der Teilnehmer gegen die Altersklasse (Junioren und Senioren)
- Grafikoptionen: Da Probleme mit einigen Treibern in Bezug zu Java bestehen, gibt es jetzt die Möglichkeit die Optionen
  zur Grafikbeschleunigung für JAuswertung zu konfigurieren. Über die Verknüpfung "Grafikoptionen" kann die
  Hardwarebeschleunigung deaktiviert werden, womit Darstellungsfehler vermieden werden.

Überarbeitungen:

- Die Altersklassen einer Wertungsgruppe müssen nicht mehr die gleichen Rec-Werte haben. Es werden dann die niedrigsten
  Rec-Werte genutzt.
- Weitere Bildformate werden unterstützt.
- Tabulatorverhalten in den Fenstern "Eigenschaften" und "Kampfrichter" verbessert.

Bug-Fixes:

- Meldedateien mit "Nachrückern" können jetzt importiert werden.

Sonstiges:

- Bibliotheken von Drittanbietern wurden aktualisiert.
- Die Installation wurde überarbeitet.
