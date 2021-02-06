<?php
if (php_sapi_name() == 'cli-server') {
	header('Access-Control-Allow-Origin: http://localhost:4000');
} else {
	header('Access-Control-Allow-Origin: https://www.dennisfabri.de');
}

function get()
{	
		$prefix = "dsm";
		$response = "{ \"data\": [";

        $values = array(
			array(1988, "Rheda-Wiedenbr&uuml;ck", "http://rheda-wiedenbrueck.dlrg.de/"),
			array(1989, "Bietigheim-Bissingen", "http://bietigheim-bissingen.dlrg.de/"),
			array(1990, "Helmstedt", "http://helmstedt.dlrg.de/"),
			array(1991, "Wetzlar", "http://www.dlrg-wetzlar.de/"),
			array(1992, "Gelsenkirchen", "http://www.ge-rettet.de/"),
			array(1993, "Memmingen", "http://memmingen.dlrg.de/"),
			array(1994, "Gladbeck", "http://gladbeck.dlrg.de/"),
			array(1995, "Bietigheim-Bissingen", "http://bietigheim-bissingen.dlrg.de/"),
			array(1996, "Rendsburg", "http://rendsburg.dlrg.de/"),
			array(1997, "Gladbeck", "http://gladbeck.dlrg.de/"),
			array(1998, "Pfullingen", "http://pfullingen.dlrg.de/"),
			array(1999, "Helmstedt", "http://helmstedt.dlrg.de/"),
			array(2000, "Georgsmarienh&uuml;tte", "http://georgsmarienhuette.dlrg.de/"),
			array(2001, "Pfullingen", "http://pfullingen.dlrg.de/"),
			array(2002, "V&ouml;lklingen/Saar", "http://voelklingen.dlrg.de/"),
			array(2003, "Bayreuth", "http://bayreuth.dlrg.de/"),
			array(2004, "Rheda-Wiedenbr&uuml;ck", "http://rheda-wiedenbrueck.dlrg.de/"),
			array(2005, "L&uuml;beck-Travem&uuml;nde (EM)", NULL),
			array(2006, "Duderstadt / Eichsfeld", "http://eichsfeld.dlrg.de/"),
			array(2007, "Bietigheim-Bissingen", "http://bietigheim-bissingen.dlrg.de/"),
			array(2008, "Weener", "http://weener.dlrg.de/"),
			array(2009, "Anklam", "http://anklam.dlrg.de/"),
			array(2010, "Harsewinkel", "http://harsewinkel.dlrg.de/"),
			array(2011, "Geislingen", "http://geislingen.dlrg.de/"),
            array(2012, "Bielefeld-Sennestadt", "http://senne.dlrg.de/"),
            array(2013, "Stuttgart", "http://bez-stuttgart.dlrg.de/"),
            array(2014, "Berlin Charlottenburg-Wilmersdorf", "http://charlottenburg-wilmersdorf.dlrg.de/"),
            array(2015, "Georgsmarienh&uuml;tte", "http://georgsmarienhuette.dlrg.de/"),
            array(2016, "Luckenwalde", "http://luckenwalde.dlrg.de/"),
            array(2017, "Andernach", "http://dlrg-andernach.de/?site=dsm"),
            array(2018, "Harsewinkel", "https://harsewinkel.dlrg.de/dsm-2018.html"),
            array(2019, "Sulzbach", "https://sulzbach.dlrg.de/"),
            array(2020, "-<sup>1</sup>", ""),
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
	
	      $name = "DSM_" . $year . "_Ergebnis_Einzel.pdf";
	      if (file_exists("$prefix/$name")) {
		    $einzel = $name;
	      }
	      $name = "DSM_" . $year . "_Ergebnis_Mannschaft.pdf";
	      if (file_exists("$prefix/$name")) {
		    $mannschaft = $name;
		  }
	      $name = "DSM_" . $year . "_Gesamtwertung_LV.pdf";
	      if (file_exists("$prefix/$name")) {
		    $lv = $name;
	      }
	      $name = "DSM_" . $year . "_Gesamtwertung.pdf";
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