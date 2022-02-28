<?php

function loadJson($fileName){
    if(!is_file($fileName)){
        return [];
    }
    return json_decode(file_get_contents($fileName),true);
}

// Fetch Vaccination

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

// Generate Basic Data

function createWeeklyJson($weeklyData){
    $populations = loadJson('input/population.json');
    foreach($weeklyData as $date => $data){
        $filePath = "generated/percentage/weekly/$date.json";
        $totalFilePath = "generated/total/weekly/$date.json";
        file_put_contents($filePath,json_encode($data));
        foreach($data as $city => $value){
            $data[$city] = intval(($populations[$city] / 100000 ) * intval($value));
        }
        file_put_contents($totalFilePath,json_encode($data));
    }
}

function createCityNumbers(){
    $translations = loadJson('input/translations.json');
    $totals = [];
    $percentage = [];
    $countryTotals = [];
    $countryAverageTotals = [];
    foreach($translations as $short => $translation){
        $percentagePath = "generated/percentage/weekly/$short.json";
        $totalFilePath = "generated/total/weekly/$short.json";
        createCityData($percentage,$percentagePath);
        createCityData($totals,$totalFilePath);
        array_push($countryTotals,createSumCityData($totalFilePath));
    }
    foreach($countryTotals as $total){
        array_push($countryAverageTotals, intval($total / 836));
    }
    file_put_contents('generated/total/country.json',json_encode($countryTotals,JSON_PRETTY_PRINT));
    file_put_contents('generated/total/city.json',json_encode($totals,JSON_PRETTY_PRINT));
    file_put_contents('generated/percentage/city.json',json_encode($percentage,JSON_PRETTY_PRINT));
    file_put_contents('generated/percentage/country.json',json_encode($countryAverageTotals,JSON_PRETTY_PRINT));
}

function createCityData(&$targetArray,$path){
    $currentWeek = loadJson($path);
    foreach($currentWeek as $city => $value){
        $data = [];
        if(array_key_exists($city,$targetArray)){
            $data = $targetArray[$city];
        }
        array_push($data,$value);
        $targetArray[$city] = $data;
    }
}

function createSumCityData($path){
    $currentWeek = loadJson($path);
    $total = 0;
    foreach($currentWeek as $city => $value){
        $total += $value;
    }
    return $total;
}

$weekly = loadJson('input/new.json');
createWeeklyJson($weekly);
createCityNumbers();

// Find Percentage Overall


$weekNames = array_keys(loadJson("input/translations.json"));

$all = [];
foreach($weekNames as $currentWeak) {

    $total = 0;
    $totalPercentage = 0.0;

    $percentages = loadJson("generated/total/weekly/" . $currentWeak . ".json");
    
    arsort($percentages);
    
    foreach($percentages as $city=>$value){
        $total += $value;
    }
    
    $arr = [];
    
    foreach(array_slice($percentages,0,9) as $city=>$value){
        $foo = number_format(($value / $total * 100),2);
        $totalPercentage += $foo;
        $arr[$city] = $foo;
    }
    $arr["Diğer"] = number_format(100 - $totalPercentage,2);
    
    $all[$currentWeak] = $arr;
}

file_put_contents("generated/top10percentage.json",json_encode($all,JSON_PRETTY_PRINT));


// Find Top Date

$translations = array_keys(loadJson("input/translations.json"));

$cityPercentages = loadJson("generated/percentage/city.json");

$peakTimes = [];

foreach($cityPercentages as $name => $data ) {
    $max = max($data);
    $date = $translations[array_search($max,$data)];
    if(array_key_exists($date,$peakTimes)){
        $foo = &$peakTimes[$date];
        $foo[] = $name;
    }else{
        $peakTimes[$date] = [$name];
    }
}

file_put_contents('generated/peaktimes.json',json_encode($peakTimes,JSON_PRETTY_PRINT));