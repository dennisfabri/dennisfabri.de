<?php
if (php_sapi_name() == 'cli-server') {
	header('Access-Control-Allow-Origin: http://localhost:4000');
} else {
	header('Access-Control-Allow-Origin: https://www.dennisfabri.de');
}
  
function get()
{	
		$prefix = "dmm";
		$response = "{ \"data\": [";

        $values = array(
			array(1973, "Hannover", ""),
			array(1974, "Wolfsburg &amp; Warendorf", ""),
			array(1975, "Stetten a.k.M., Warendorf &amp; Otterndorf", ""),
			array(1976, "Frankfurt a.M., Berlin (West) &amp; Otterndorf", ""),
			array(1977, "Braunschweig", ""),
			array(1978, "Oberhausen / Rheinland", ""),
			array(1979, "Pforzheim", ""),
			array(1980, "Kassel", ""),
			array(1981, "Warendorf", ""),
			array(1982, "Wei&szlig;enh&auml;user Strand", ""),
			array(1983, "Bietigheim-Bissingen", ""),
			array(1984, "Brake", ""),
			array(1985, "Damp 2000", ""),
			array(1986, "Bad Hersfeld", ""),
			array(1987, "M&uuml;hlheim an der Ruhr", ""),
			array(1988, "Berlin (West)", ""),
			array(1989, "Ludwigshafen", ""),
			array(1990, "M&uuml;nchen", ""),
			array(1991, "Warendorf", ""),
			array(1992, "Heidelberg", ""),
			array(1993, "Bad Nauheim", ""),
			array(1994, "Bremerhaven", ""),
			array(1995, "Neu Wulmstorf", ""),
			array(1996, "Braunschweig", ""),
			array(1997, "Leinfelden-Echterdingen", ""),
			array(1998, "Regensburg", ""),
			array(1999, "Bad Nauheim", ""),
			array(2000, "Halle / Saale", ""),
			array(2001, "Itzehoe", ""),
			array(2002, "Uelzen", ""),
			array(2003, "Braunschweig", ""),
			array(2004, "Paderborn", ""),
			array(2005, "Wetzlar", ""),
			array(2006, "Wuppertal", ""),
			array(2007, "Duisburg", ""),
			array(2008, "Paderborn", ""),
			array(2009, "Itzehoe", ""),
			array(2010, "Heidenheim", ""),
			array(2011, "Bremen", ""),
			array(2012, "Paderborn", ""),
			array(2013, "Bamberg", ""),			
			array(2014, "Heidenheim", ""),
			array(2015, "Osnabr&uuml;ck", ""),
			array(2016, "W&uuml;rzburg", ""),
			array(2017, "Hagen", ""),
			array(2018, "Leipzig", ""),
			array(2019, "Hagen", ""),
			array(2020, "-<sup>2</sup>", ""),
			array(2021, "Freiburg", ""),
		);

        for ($x = count($values) - 1; $x >= 0; $x--) {

		  $value = $values[$x];
		  
		  $year = $value[0];
		  $location = $value[1];
		  $url = $value[2];

	      $einzel = "";
		  $mannschaft = "";
		  $lv = "";
		  $og = "";
	
	      $nr = "";
	      if ($value[0] != null) {
		    $nr = $value[0] - 2018;
	      }
	
	      $name = "DMM_" . $year . "_Ergebnis_Einzel.pdf";
	      if (file_exists("$prefix/$name")) {
		    $einzel = $name;
	      }
	      $name = "DMM_" . $year . "_Ergebnis_Mannschaft.pdf";
	      if (file_exists("$prefix/$name")) {
		    $mannschaft = $name;
		  }
	      $name = "DMM_" . $year . "_Gesamtwertung_LV.pdf";
	      if (file_exists("$prefix/$name")) {
		    $lv = $name;
	      }
	      $name = "DMM_" . $year . "_Gesamtwertung_OG.pdf";
	      if (file_exists("$prefix/$name")) {
		    $og = $name;
	      }
		  
		  $response .= "{ \"year\": $year, \"location\": \"$location\", \"homepage\": \"$url\", \"individual\": \"$einzel\", \"team\": \"$mannschaft\", \"lv\": \"$lv\", \"og\": \"$og\" }";
		  if ($x > 0) {
			  $response .= ", ";
		  }
		}
		
		$response .= "] }";

		return $response;
	}

print(get());

?>