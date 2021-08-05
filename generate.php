<?php

function loadJson($fileName){
    if(!is_file($fileName)){
        return [];
    }
    return json_decode(file_get_contents($fileName),true);
}

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