<?php
if (php_sapi_name() == 'cli-server') {
	header('Access-Control-Allow-Origin: http://localhost:4000');
}

class RestDEM
{
	public static function get()
	{	
		$response = "{\"data\": [";

        $values = array(
			array(2019, "Magdeburg", ""),
			array(2020, "-<sup>1</sup>", ""),
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
		    $nr = $value[0] - 2018;
	      }
	
	      $name = "DEM_" . $year . "_Ergebnis_Einzel.pdf";
	      if (file_exists($name)) {
		    $einzel = $name;
	      }
	      $name = "DEM_" . $year . "_Ergebnis_Mannschaft.pdf";
	      if (file_exists($name)) {
		    $mannschaft = $name;
	      }
		  
		  $response .= "{ \"year\": $year, \"location\": \"$location\", \"homepage\": \"$url\", \"individual\": \"$einzel\", \"team\": \"$mannschaft\" }";
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