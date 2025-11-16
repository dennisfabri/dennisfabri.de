---
layout: page
title: Meldeunterlagen
permalink: /jauswertung/anleitungen/meldeunterlagen.html
---

# Meldeunterlagen

Die [vorgefertigten Meldeunterlagen](/jauswertung/downloads.html) sind so gestaltet, dass die Meldungen direkt mit JAuswertung importiert werden können. Die Dateien können zusammen mit der Ausschreibung zur elektronischen Meldung ausgegeben werden.


Die Meldeunterlagen enthalten vorgefertigte Tabellen, in denen die benötigten Informationen übersichtlich abgefragt werden. Bitte beachten Sie, dass die Daten möglichst korrekt eingetragen werden. JAuswertung beherrscht bereits einige Abweichungen, so dass z.B. „4x50m Hindernis“ auch als „4*50m Hindernisstaffel“ erkannt werden. Es ist jedoch nicht möglich alle Abweichungen zu erkennen.

Die meisten Meldeunterlagen enthalten Spalten mit den jeweiligen Disziplinen. Hier können Meldezeiten in der Form „m:ss,00“ (Minuten:Sekunden,Hundertstel) eingetragen werden. Die Meldezeiten werden zur Laufeinteilung genutzt, wenn dies gewünscht ist. Wird in einer Disziplin keine Meldezeit angegeben, so wird angenommen, dass der Teilnehmer bzw. die Mannschaft langsamer ist, als die langsamste gemeldete Zeit. Aus den Meldezeiten kann JAuswertung unter berücksichtigung der aktuellen Rec-Werte Meldepunkte berechnen.

Bei Einzelmeisterschaften können in einigen Altersklassen Disziplinen ausgewählt werden. Dies geschieht wahlweise durch die Eingabe von Meldezeiten oder durch ein „+“ in der Spalte der jeweiligen Disziplin. Dies führt dazu, dass der Teilnehmer an Disziplinen, zu denen keine Angabe gemacht wird, nicht teilnimmt. Z.B. kann ein Schwimmer in der offenen Altersklasse in den Spalten zu „200m Hindernis“, „50m Retten“, „100m Retten mit Flossen“ und „Super-Lifesaver“ jeweils ein „+“ eintragen und die restlichen Spalten leer lassen und nimmt so an den vier genannten Disziplinen teil.

Neben den Meldezeiten können auch Meldepunkte angegeben werden, die z.B. bei der Zulassung oder der Erstellung von Lauflisten berücksichtigt werden können. In den Meldedateien existiert dazu ggf. die Spalte „Meldepunkte“.

## Hinweise

Beim Import der Meldedateien sollten Sie sicherheitshalber überprüfen, ob alle Daten korrekt importiert wurden. JAuswertung gibt dazu während des Importvorgangs detaillierte Informationen über die Anzahl der importieren Teilnehmer bzw. Mannschaften aus.

**Anmerkung:** Es kommt leider gelegentlich zu *interessanten* Formatierungen der Zeiten, die dann zu Problemen beim Import führen. In der Regel kann das Zeitformat aber korrekt bestimmt werden.

## Meldeunterlagen Einzel- / Mannschaftsmeisterschaften

Diese Meldeunterlagen enthalten für jede Altersklasse eine eigene Tabelle. Es sind jeweils die geschwommenen Disziplinen der Altersklasse aufgeführt, so dass ggf. Meldezeiten eingetragen werden können.

<!-- markdownlint-disable MD033 -->
<img alt="Meldeunterlagen Mannschaftsmeisterschaften" src="/assets/img/jauswertung/anleitungen/meldeunterlagen/meldeunterlagen-mannschaftsmeisterschaften.png" width="800"/>
<em>Abbildung 1: Meldeunterlagen Mannschaftsmeisterschaften</em>
<!-- markdownlint-enable MD033 -->

**Anmerkung:** Enthält ein Tabellenblatt bei der Meldung von Einzelteilnehmern die Spalte Jahrgang, so kann JAuswertung auf der Basis des Jahrgangs die richtige Altersklasse bestimmen. Die Altersklasse muss dann nicht zwingend angegeben werden.

**Anmerkung:** Wenn Sie nicht alle Altersklassen anbieten (z.B. Senioren), können Sie einfach die nicht benötigten Tabellenblätter löschen.

## Meldeunterlagen Einzel- / Mannschaftsmeisterschaften (kompakt)

Diese Meldeunterlagen enthalten ein Tabellenblatt, in das alle Altersklassen eingetragen werden können. Hier sind alle Disziplinen des Regelwerks aufgeführt. Beim Eintragen der Teilnehmer bzw. Mannschaften können Meldezeiten eingetragen werden. Disziplinen, die in der jeweiligen Altersklasse nicht geschwommen werden, können ignoriert werden.

<!-- markdownlint-disable MD033 -->
<img alt="Meldeunterlagen Einzelmeisterschaften (kompakt)" src="/assets/img/jauswertung/anleitungen/meldeunterlagen/meldeunterlagen-einzelmeisterschaften-kompakt.png" width="800"/>
<em>Abbildung 2: Meldeunterlagen Einzelmeisterschaften (kompakt)</em>
<!-- markdownlint-enable MD033 -->

**Anmerkung:** Die beiden unterschiedlichen Formen von Meldeunterlagen haben ihre Vor- und Nachteile. Je nach aktuellem Kenntnisstand werden gelegentlich Tabellenblätter übersehen. Auf der anderen Seite kann auch die kompakte Darstellung zu Verwirrungen führen, da nicht jedem genau klar ist, welche Altersklasse an welchen Disziplinen teilnimmt oder die unterschiedlichen Distanzen z.B. beim Hindernisschwimmen übersehen werden. Sie sollten daher je nach Zielgruppe die besser geeignete Datei oder ggf. beide Versionen nutzen.

## Meldeunterlagen FWK Einzel / Mannschaft

Diese Meldeunterlagen enthalten eine Tabelle für alle Altersklassen. Die Meldung ist ohne Meldezeiten vorgesehen und daher vor allem für Freundschaftswettkämpfe (FWKs) interessant, kann aber auch für Ortsgruppen- und Bezirksmeisterschaften genutzt werden, wenn keine Meldezeiten gewünscht sind.

**Anmerkung:** Bitte beachten Sie, dass diese Vorlage für Einzelwettkämpfe nur dann funktioniert, wenn in der offenen Altersklasse keine Wahlmöglichkeit besteht. Dazu müssen Sie das Regelwerk des jeweiligen Wettkampfs entsprechend anpassen.

## Erstellung von Meldeunterlagen

Eigene Meldeunterlagen können auf unterschiedliche Arten erstellt werden. Zum einen können die bereitgestellten Unterlagen angepasst werden. Zum anderen besteht die Möglichkeit Meldeunterlagen aus JAuswertung zu exportieren.

Für letzteres muss zuerst der Wettkampf in JAuswertung nach Wunsch angelegt und konfiguriert werden. In diesem Wettkampf muss dann ein Sportler/eine Mannschaft angelegt werden. Daraufhin kann die Meldung exportiert werden. Diese Datei kann zum einen direkt wieder zum Import genutzt werden. Es besteht aber auch die Möglichkeit nicht benötigte Spalten zu löschen. Sollten zu viele Spalten gelöscht worden sein, wird der Import mit einer entsprechenden Fehlermeldung fehlschlagen. In der Regel geht die fehlende Spalte daraus direkt hervor.