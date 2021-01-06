<?php
class Rechner
{
	function display($tpl = null)
	{
		$this->title = 'Punkteberechnung f&uuml;r DLRG-Wettk&auml;mpfe';
		
		$message = "";
		
		$mode = isset($_GET['mode']) ? $_GET["mode"] : "<not-set>";
		$all = false;
		if ($mode == "overview") {
			$mode = "overview";
		} else if ($mode == "overview_all") {
			$mode = "overview";
			$all = true;
		} else if ($mode == "calculate") {
			$mode = "calculate";
		} else {
			$mode = "overview";
		}
		
		if ($mode == "overview") {
			$message .= $this->getOverview($all);
		} else if ($mode == "calculate") {
			$message .= $this->getPunkterechner();
		} else {
			$message .= "<p>Diese Seite ist leider nicht verf&uuml;gbar.</p>";
		}
		
		$this->body = $message;

		// Display the view
		parent::display($tpl);
	}
	
	function getSiteError($info = null) {
		$server = $_SERVER["SERVER_NAME"];
		$url = $_SERVER["REQUEST_URI"];
		$site = htmlspecialchars("http://" . $server . $url);
		$message .= "<h4>Seite nicht verf&uuml;gbar</h4>";
		$message .= '<p>Die angeforderte Seite existiert nicht. Bitte melden Sie dieses Problem mit einer kurzen Beschreibung an <a href="mailto:info@dennisfabri.de">info@dennisfabri.de</a>.</p>';
		$message .= "<h4>Information zur Ursache</h4>";
		if ($info != null) {
		  $message .= "<p>$info</p>";
		}
	        $message .= "<p>Aktuelle Seite: $site</p>";;
		return $message;
	}
	
	function createLink($parameter = null) {
		$url = $_SERVER['PHP_SELF'];
		if ($parameter == null) {
			$parameter = array();
		}
		$parameter["option"] = "com_dlrg_rettungssport";
		$parameter["view"] = "rechner";
		$first = true;
		foreach ($parameter as $key => $value) {
		  $url .= $first ? "?" : "&";
		  $url .= "$key=$value";
		  $first = false;
		}
		return $url;
	}
	
	function getOverview($all = false) {
		$recs = $this->getRecs();
		$message = "<p>Der Punkterechner unterst&uuml;tzt die Berechnung von Punkten nach DLRG-Regelwerk mit den Rec-Werten seit 2007. Die Wertung in der offenen Altersklasse im Einzel erfolgt &uuml;ber die drei (3) besten Disziplinen. Dabei wird nicht ber&uuml;cksichtigt, ob maximal vier Disziplinen angegeben wurden, wodurch man f&uuml;r einzelne Schwimmer in einem Durchgang die Punkte f&uuml;r alle sechs Disziplinen ermitteln kann.</p>";
		$year = date("Y") + 1;
		$years = array();
		$amount = 0;

		$message .= '<div style="overflow: hidden;">';
		for ($x = $year; $x >= 2006; $x--) {
		  if (array_key_exists ($x ,$recs)) {
			array_push($years, $x);
			$amount++;
			$message .= $this->getYearOverview($x, $recs[$x]);
			if ($x == 2011) {
				$message .= '<div style="clear: both;"/>';
			}
		  }
		  if ($amount >= 2 && !$all) {
			  break;
		  }
		}
		$message .= "</div>";
		if (!$all) {
			$link = $this->createLink(array("mode" => "overview_all"));
			$message .= "<p><a href=\"$link\">Alle Jahre anzeigen</a></p>";
		}
		return $message;
	}
	
	function createList($year, $single, $array) {
		$title = $single == "e" ? "Einzel" : "Mannschaft";
		$message = "		<table style=\"align: center; border: 1px solid #0077bb;width: 90%; margin: 0.5em;\"><tr style=\"background-color: #0077bb; color: white;\"><th>$title</th></tr>\n";
		for ($x = 0; $x < count($array); $x++) {
		  $link = $this->createLink(array(
		    "year" => $year, 
		    "mode" => "calculate", 
		    "single" => $single, 
		    "ak" => $x)
		  );
		  $message.= '		  <tr><td style="padding-left: 0.2em; padding-right: 0.2em;"><a href="'.$link.'">' . $array[$x] . '</a></td></tr>' . "\n";
		}
		$message .= '		</table>' . "\n";
		return $message;
	}
	
	function extractAKs($rec) {
		$aks = array();
		foreach ($rec as $value) {
			array_push($aks, $value[0]);
		}
		return $aks;
	}
	
	function getYearOverview($year, $rec) {
		
		$message = "<table style=\"margin-right: 1em; margin-bottom: 1em; padding: 1em; border: 1px solid #0077bb; float: left;\"><tr style=\"background-color: #0077bb; color: white;\"><th colspan=\"2\">$year</th></tr>";
		$message .= "<tr><td width=\"50%\">";
		$aks = $this->extractAKs($rec["e"]);
		$message .= $this->createList($year, "e", $aks);
		$message .= "</td><td width=\"50%\">";
		$aks = $this->extractAKs($rec["m"]);
		$message .= $this->createList($year, "m", $aks);
		$message .= "</td></tr>";
		$message .= "</table>";
		return $message;
	}
	
	function getRecs() {
		include 'components/com_dlrg_rettungssport/views/rechner/data.php';
		return $recs;
	}
	
	function getRec($year, $single, $ak = null) {
		$recs = $this->getRecs();
		if ($ak == null) {
		  return $recs[$year][$single];
		}
		return $recs[$year][$single][$ak];
	}	
	
	function getPunkterechner() {
		$ok = array_key_exists("year", $_GET);
		if (!$ok) {
			return $this->getSiteError("Jahr fehlt");
		}
		$ok = array_key_exists("single", $_GET);
		if (!$ok) {
			return $this->getSiteError("Mannschaft/Einzel fehlt");
		}
		$ok = array_key_exists("ak", $_GET);
		if (!$ok) {
			return $this->getSiteError("Altersklasse fehlt");
		}
		$year = $_GET["year"];
		$single = $_GET["single"];
		$ak = $_GET["ak"];
		return $this->punkterechner($year, $single, $ak);
	}
	
    function punkterechner($year, $single, $ak) {
	  $recs = $this->getRecs();
      $ok = array_key_exists($year, $recs);
	  if (!$ok) {
			return $this->getSiteError("Jahr &quot;$year&quot; nicht gefunden");
	  }
      $ok = array_key_exists($single, $recs[$year]);
	  if (!$ok) {
			return $this->getSiteError("Typ &quot;$single&quot; nicht gefunden");
	  }
	  if ($ak >= 0) {
        $ok = array_key_exists($ak, $recs[$year][$single]);
	    if (!$ok) {
			return $this->getSiteError("Altersklasse &quot;$ak&quot; nicht gefunden");
	    }
	  }

	  $rec = $this->getRec($year, $single);
	  $id = "$year-$single-$ak";
	  $url = $this->createLink(array("mode" => "calculate", "year" => $year, "single" => "$single", "ak" => $ak));
	  $offset = $ak;
	  
	  $message = "";
	  
      $punkte = NULL;
      $zeiten = NULL;
      if (!isset($_SESSION["DLRG_WebRechner"])) {
	    $_SESSION["DLRG_WebRechner"] = array();
      }

      if (isset($_SESSION["DLRG_WebRechner"][$id])) {
	    $daten = $_SESSION["DLRG_WebRechner"];
	    $punkte = $daten[$id]["Punkte"];
	    $zeiten = $daten[$id]["Zeiten"];
      } else {
	    $punkte = array();
	    $zeiten = array();
	    for ($x = 0; $x < count($rec); $x++) {
		    $punkte[$x] = array();
	    	$zeiten[$x] = array();
    		for ($y = 0; $y < count($rec[$x][4]); $y++) {
		    	for ($z=0; $z < 2; $z++) {
	    			$zeiten[$x][$z][$y] = "0:00,00";
    				$punkte[$x][$z][$y] = "";
			    }
		    }
	    }
      }

      if (isset($_POST["calculate"])) {
	    $x = $_POST["ak"];
	    $z = $_POST["sex"];
	
	    $daten1 = array();
	    $daten2 = array();
	    $daten3 = array();
	    $sum = 0;
	    for ($y = 0; $y < count($rec[$x][4]); $y++) {
		    $eingabe = $_POST["time" . $y];
		    if (count(explode(":", $eingabe)) > 1) {
			    $splitted = explode(":", $eingabe);
			    if (count($splitted) > 3) {
				    $eingabe = 0;
			    } else if (count($splitted) == 3) {
			    	$eingabe = $splitted[0] * 100 * 100 + $splitted[1] * 100 + $splitted[2];
		    	} else {
	    		    $splitted[1] = str_replace(",", ".", str_replace(";", ".", $splitted[1]));
    			    $eingabe = $splitted[0] * 100 * 100 + $splitted[1] * 100;
			    }
		    } else {
			    $eingabe = str_replace(",", ".", str_replace(";", ".", $eingabe));
                        if ($eingabe < 60) {
                          $eingabe *= 100;
                        }
		    }
            $eingabe = $eingabe + 0.001;
		    $minuten = (int) ($eingabe / (100 * 100));
		    $sekunden = (int) ((($eingabe % 10000) / 100) % 60);
		    $hundertstel = (int) ($eingabe % 100);
		    $zeit = $minuten *60 + $sekunden + $hundertstel / 100;
		    $daten1[$y] = $minuten . ":" . ($sekunden < 10 ? "0" : "") . $sekunden . "," . ($hundertstel < 10 ? "0": "") . $hundertstel;
		    $daten2[$y] = "";
		    if ($zeit > 0) {
			    $quot = $zeit / $rec[$x][2 + $z][$y];
			    $result = 0;
			    if ($quot >= 5) {
				    $result = 0;
			    } else if ($quot >= 2) {
				    $result = 2000 / 3 - 400 / 3 * $quot;
			    } else {
				    $result = 467 * $quot * $quot - 2001 * $quot + 2534;
			    }
			    $result = round($result, 2);
		    	$daten2[$y] = $result;
	    		$daten3[$y] = number_format($result, 2, ",", ".");
    			$sum += $result;
		    }
	    }
	    if ($rec[$x][1] > 0) {
		    $daten4 = $daten2;
		    sort($daten4);
		    $sum = 0;
	    	for ($a = 1; $a <= $rec[$x][1]; $a++) {
    			$sum += $daten4[count($daten4) - $a];
		    }
	    }
	
	    if ($sum <= 0.005) {
	    	$wert = "";
    	} else {
    		$wert = number_format($sum, 2, ",", ".");
	    }
	    $daten3[count($daten2)] = $wert;
	    $zeiten[$x][$z] = $daten1;
	    $punkte[$x][$z] = $daten3;
      }

      $daten = $_SESSION["DLRG_WebRechner"];
      $daten[$id]["Zeiten"] = $zeiten;
      $daten[$id]["Punkte"] = $punkte;
      $_SESSION["DLRG_WebRechner"] = $daten;

      $start = 0;
      $max = count($rec);
      if ($offset >= 0) {
	    $start = $offset;
	    $max = $offset + 1;
      }
      for ($x = $start; $x < $max; $x++) {
    	$data = $rec[$x];
	    for ($z = 0; $z < 2; $z++) {
    		$message .= '  <table style="border: 1px solid #0077BB;">' . "\n";
		    $message .= '            <tr><th colspan="4" style="background-color: #0077BB; padding-left: 0.2em; color: white;">' . $data[0] . " " . ($z == 1 ? "m&auml;nnlich": "weiblich"). '</th></tr>' . "\n";
	    	$message .= '            <tr><td style="margin-right: 0.2em;">' . "\n";
    		$message .= '        <form action="' . $url . '" method="post">' . "\n";
		    $message .= '          <table>' . "\n";
	    	$message .= '            <tr style="padding-top: 0.1em; border-top: 0px;">' . "\n";
    		$message .= '              <th style="text-align: center; padding-left: 0.2em; padding-right: 0.5em; padding-top: 0.1em; border-top: 0px;">Disziplin</th>' . "\n";
		    $message .= '              <th style="text-align: center; padding-right: 0.5em; padding-top: 0.1em; border-top: 0px;">Eingabe</th>' . "\n";
	    	$message .= '              <th style="text-align: center; padding-right: 0.5em; padding-top: 0.1em; border-top: 0px;">Zeit</th>' . "\n";
    		$message .= '              <th style="text-align: center; padding-right: 0.5em; padding-top: 0.1em; border-top: 0px;">Punkte</th>' . "\n";
		    $message .= '            </tr>' . "\n";
	    	for ($y=0; $y < count($data[4]); $y++) {
    		    $value = $data[2+$z][$y] + 0.001;
			    $minuten = (int) ($value / 60);
		    	$sekunden = (int) ($value % 60);
	    		$hundertstel = (int) ($value * 100) % 100;
    		    $recwert = $minuten . ":" . ($sekunden < 10 ? "0" : "") . $sekunden . "," . ($hundertstel < 10 ? "0": "") . $hundertstel;
			
		        $message .= '            <tr style="vertical-align: center; padding-top: 0.1em; border-top: 0px;">' . "\n";
	    		$message .= '              <td style="vertical-align: center; padding-left: 0.2em; padding-right: 0.5em; padding-top: 0.1em; border-top: 0px;">' . $data[4][$y] . ' (' . $recwert . '):</td>'. "\n";
    			$message .= '              <td style="vertical-align: center; padding-right: 0.5em; padding-top: 0.1em; padding-bottom: 0.1em; border-top: 0px;"><input style="text-align: right; line-height: 1; height: auto; padding: 0.2em;" name="time' . $y . '" type="text" size="10" maxlength="10" value="' . ($zeiten[$x][$z][$y] == "0:00,00" ? "" : $zeiten[$x][$z][$y]). '"/></td>' . "\n";
			    $message .= '              <td style="text-align: right; vertical-align: center; padding-right: 0.5em; padding-top: 0.1em; border-top: 0px;">' . $zeiten[$x][$z][$y].'</td>' . "\n";
	        	$message .= '              <td style="text-align: right;vertical-align: center; padding-right: 0.5em; padding-top: 0.1em; border-top: 0px;">' . ($zeiten[$x][$z][$y] == "0:00,00" ? "" : $punkte[$x][$z][$y]).'</td>' . "\n";
    		    $message .= '            </tr>' . "\n";
		    }
	    	$message .= '            <tr style=" border-top: 1px solid #dddddd;"><td colspan="3" style="text-align: right; padding-right: 0.5em;">Gesamtpunkte:</td><td style="text-align: right; padding-right: 0.5em;">' . (isset($punkte[$x][$z][$y]) ? $punkte[$x][$z][$y] : "") . '</td></tr>';
    		$message .= '          </table>' . "\n";
		    $message .= '          <p style="text-align: right; margin: 0.5em;">' . "\n";
	    	$message .= '          <input type="hidden" name="ak" value="' . $x . '" />' . "\n";
    		$message .= '          <input type="hidden" name="sex" value="' . $z . '" />' . "\n";
		    $message .= '          <input type="hidden" name="calculate" value="1" />' . "\n";
	    	$message .= '          <input type="submit" value="Berechnen" />' . "\n";
    		$message .= '          </p>' . "\n";
		    $message .= '        </form>' . "\n";
	    	$message .= '      </td>' . "\n";
    		$message .= '    </tr>' . "\n";
		    $message .= '  </table>' . "\n";
		    $message .= '  <br/>' . "\n";
	    }
      }
	  $message .= '<p><a href="' . $this->createLink() . '">Zur&uuml;ck zur &Uuml;bersicht</a></p>';
	  return $message;
    }
	
}

?>