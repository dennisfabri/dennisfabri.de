---
layout: page
title: AlphaServer
permalink: /jauswertung/alphaserver.html
---

<!-- markdownlint-disable MD033 -->

# AlphaServer

## Beschreibung

Alpha Server ist ein Programm zur Verbindung von PCs mit der Zeitmessanlage ARES21 der Firma Omega Timing. Die gemeldeten
Zeiten werden dabei gesammelt und über einen integrierten Webserver als XML-Datei zur Verfügung gestellt.

## Installation unter Windows

AlphaServer ist Teil des Setups von JAuswertung. Eine Verknüpfung mit AlphaServer wird automatisch angelegt.
Weitere Schritte sind nicht notwendig.

## Installation auf einem Raspberry Pi

Diese Anleitung geht von einem frisch installierten und aktualisiertem Raspian mit Desktop auf einem Raspberry Pi aus.
Anleitungen dazu finden sich zu genüge im Netz. Grundsätzliche Linux-Kenntnisse werden vorausgesetzt.

Da der Raspberry Pi selbst keinen RS-232-Anschluss bietet, wird ein USB-RS232-Adapter benötigt2. Diese müssen nicht mehr
als 10,- € kosten und es gibt sie zum Teil auch noch billiger (welcher Adapter mit dem Raspberry Pi kompatibel sind, muss
im Einzelfall geprüft werden).

### Teil 1: Installation benötigter Bibliotheken

    sudo apt-get -y install librxtx-java

Dies installiert eine Bibliothek<sup>1</sup>, die Alpha Server benötigt, um auf den seriellen Port zugreifen zu können.

### Teil 2: Installieren von Alpha Server als Teil von JAuswertung

Laden Sie JAuswertung in der aktuellen Version herunter. Starten Sie ein Terminal und wechseln Sie in das
Verzeichnis, das die Installationsdatei enthält. Starten Sie die Installation mit "java -jar". Folgen Sie den Schritten
des Installationstools. JAuswertung wird dann in das Verzeichnis ```/home/pi/JAuswertung``` installiert.

### Teil 3: Starten von Alpha Server

Alpha Server kann jetzt mit dem folgenden Befehl gestartet werden:

    sudo java -Djava.library.path=/usr/lib/jni \
      -cp .:jauswertung.jar:libs.jar:jutils.jar:jhall.jar \
      -Xmx256m -splash:logo.png -Xms64m de.dm.collector.JCollector

Der Befehler sudo ist notwendig, da Alpha Server einen Webserver auf Port 80 öffnet.

### Optional: Alternative zum USB-Adapter

Der Raspberry Pi bietet auch die Möglichkeit einen RS-232-Anschluss über die Pinleiste zu verbinden. Die Installation läuft
grundsätzlich genauso ab, allerdings sieht der Befehl zum Starten von Alpha Server dann wie folgt aus:

    sudo java -Djava.library.path=/usr/lib/jni \
      -Dgnu.io.rxtx.SerialPorts=/dev/ttyUSB0:/dev/ttyUSB1:/dev/ttyAMA0 \
      -cp .:jauswertung.jar:libs.jar:jutils.jar:jhall.jar -Xmx256m \
      -splash:logo.png -Xms64m de.dm.collector.JCollector

Der zusätzliche Parameter ist notwendig, weil sonst der Port nicht gefunden wird.

Quellen:

<sup>1)</sup> <https://eclipsesource.com/blogs/2012/10/17/serial-communication-in-java-with-raspberry-pi-and-rxtx/>
geprüft am 11.02.2016)
