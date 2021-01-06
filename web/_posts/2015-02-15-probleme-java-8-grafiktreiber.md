---
layout: post
title: Probleme von Java 8 mit einigen Grafikkartentreibern
date: 2015-02-15 00:00
category: JAuswertung
author: Dennis Fabri
tags: [JAuswertung]
summary: 
---

Dieses Jahr haben mich ein paar Nutzer von JAuswertung kontaktiert, da sie Darstellungsfehler in JAuswertung unter
Windows beobachtet haben. Diese Probleme reichten von Verzerrungen bis hin zum Einfrieren der Benutzeroberfläche.
In allen Fällen hat die Deaktivierung der Grafikbeschleunigung in JAuswertung die Probleme beseitigt. Daraus lässt sich
ableiten, dass die jeweiligen Grafikkartentreiber nicht gut mit Java 8 zusammenarbeiten. In solchen Fällen sollte zuerst
der aktuellste Grafikkartentreiber installiert werden.

Da jedoch gerade bei Notebooks die Hersteller in der Regel sehr zurückhaltend mit Treiberupdates sind, kann damit nicht
immer das Problem beseitigt werden. Darüber hinaus ist ein Treiberupdate während eines Wettkampfs nicht risikolos. Deshalb
wird ab der nächsten Version ein Programm zur Deaktivierung der Grafikbeschleunigung über die Verknüpfung "Grafikoptionen"
mitinstalliert.

Das Programm wird folgende Einstellungen ermöglichen:

1. Standard: Es werden die normalen Einstellungen von Java zur Hardwarebeschleunigung genutzt. Dies ermöglicht auf den
   meisten Systemen die beste Darstellung.
2. OpenGL: Es wird die OpenGL-Schnittstelle zur Grafikbeschleunigung genutzt. Die Darstellung erfolgt immernoch
   hardwarebeschleunigt. Die Darstellungsqualität ist jedoch in der Regel nicht so gut wie unter Standard.
3. Software: Die Benutzeroberfläche wird vollständig von der CPU berechnet. Dies ist die sicherste Einstellung und sollte
   bei Darstellungsproblemen gewählt werden. Die Darstellungsqualität ist jedoch nicht so gut wie unter Standard.
   Die Darstellungsgeschwindigkeit kann auf älteren Systemen spürbar langsamer sein.
