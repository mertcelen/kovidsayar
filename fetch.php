<?php

$url = "https://covid19.saglik.gov.tr/";

function getVaccinePercentage(){
    global $url;
    $contents = file_get_contents($url);

    $regex = '/data-adi=\'.+?\'>/m';
    
    preg_match_all($regex, $contents, $matches, PREG_SET_ORDER, 0);
    $parsed = [];
    foreach($matches as $data){
        $data = $data[0];
        $bar = explode("'",$data);
        $parsed[$bar[1]] = substr($bar[5],2);
    }
    return $parsed;
}
$vaccinePercentage = getVaccinePercentage();
arsort($vaccinePercentage);
$vaccinePercentage["Afyon"] = $vaccinePercentage["Afyonkarahisar"];
file_put_contents('generated/vaccine_percents.json',json_encode($vaccinePercentage));