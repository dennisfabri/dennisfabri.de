<?php
if (php_sapi_name() == 'cli-server') {
	header('Access-Control-Allow-Origin: http://localhost:4000');
} else {
	header('Access-Control-Allow-Origin: https://www.dennisfabri.de');
}

class RestDEM
{
	public static function get()
	{	
		$prefix = "dem";
		$response = "{\"data\": [";

        $values = array(
			array(2019, "Magdeburg", ""),
			array(2020, "-<sup>1</sup>", ""),
			array(2021, "Berlin", ""),
			array(2022, "Warendorf", ""),
			array(2023, "Stuttgart", ""),
		);

        for ($x = count($values) - 1; $x >= 0; $x--) {

		  $value = $values[$x];
		  
		  $year = $value[0];
		  $location = $value[1];
		  $url = $value[2];

	      $einzel = "";
	      $mannschaft = "";
	
	      $nr = "";
	      if ($value[0] != null) {
		    $year = 0 + $value[0];
			if ($year == 2020) {
				$nr = "";
			} else if ($year > 2020) {
		        $nr = $year - 2018 - 1;
			} else {
		        $nr = $year - 2018;
			}
	      }
	
	      $name = "DEM_" . $year . "_Ergebnis_Einzel.pdf";
	      if (file_exists("$prefix/$name")) {
		    $einzel = $name;
	      }
	      $name = "DEM_" . $year . "_Ergebnis_Mannschaft.pdf";
	      if (file_exists("$prefix/$name")) {
		    $mannschaft = $name;
	      }
		  
		  $response .= "{ \"year\": $year, \"location\": \"$location\", \"homepage\": \"$url\", \"individual\": \"$einzel\", \"team\": \"$mannschaft\", \"number\": \"$nr\" }";
		  if ($x > 0) {
			  $response .= ", ";
		  }
		}
		
		$response .= "]}";

		return $response;
	}
}

print(RestDEM::get());

?>